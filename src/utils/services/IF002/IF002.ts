// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

// Generate all 2,034 ReturnItems definitions for IF002
// 113 rows x 18 columns (Cols C=3 to T=20)
// Codes range from IF002_53708 to IF002_55741

const REGION_NAMES = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
    "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
];

function buildIF002Definitions() {
    const defs = [];
    let codeIndex = 53708;

    const columnSuffixes = [
        " Public Enterprise _Amount ", " Public Enterprise _ # of Depositors ", " Public Enterprise _ # of Accounts  ",
        " Private & Coop. _Amount ", " Private & Coop. _ # of Depositors ", " Private & Coop. _ # of Accounts  ",
        " Regional Gov't _Amount ", " Regional Gov't _ # of Depositors ", " Regional Gov't _ # of Accounts  ",
        " Banks _Amount ", " Banks _ # of Depositors ", " Banks _ # of Accounts  ",
        " Others* _Amount ", " Others* _ # of Depositors ", " Others* _ # of Accounts  ",
        " Total  _Amount ", " Total  _ # of Depositors ", " Total  _ # of Accounts  "
    ];

    REGION_NAMES.forEach((region, rIdx) => {
        const subRowTypes = [
            "",
            "Demand_",
            "Saving_",
            `Time (${rIdx + 1}.3.1+${rIdx + 1}.3.2)_`,
            "Restricted Investment Deposit_",
            "Unrestricted Investment Deposit_",
            "Urban_",
            "Rural_"
        ];

        subRowTypes.forEach(sub => {
            columnSuffixes.forEach(suffix => {
                const code = `IF002_${codeIndex}`;
                let desc = `${region}_${sub}${suffix}`;
                if (sub === "") {
                    desc = `${region}_${suffix}`;
                }
                defs.push({
                    code,
                    description: desc,
                    dataType: "NUMERIC",
                    required: false
                });
                codeIndex++;
            });
        });
    });

    // Total Deposits Row (18 items)
    columnSuffixes.forEach(suffix => {
        const code = `IF002_${codeIndex}`;
        defs.push({
            code,
            description: `Total Deposits_${suffix}`,
            dataType: "NUMERIC",
            required: false
        });
        codeIndex++;
    });

    return defs;
}

const IF002_ITEM_DEFINITIONS = buildIF002Definitions();

export function processIF002(worksheet, instCode, startDate, endDate) {
    const formatCellVal = (cellVal) => {
        if (cellVal === null || cellVal === undefined) return "";
        if (cellVal instanceof Date) {
            if (isNaN(cellVal.getTime())) return "";
            const pad = (n) => n.toString().padStart(2, "0");
            const yyyy = cellVal.getFullYear();
            const mm = pad(cellVal.getMonth() + 1);
            const dd = pad(cellVal.getDate());
            return `${yyyy}-${mm}-${dd}`;
        }
        if (typeof cellVal === "number") return cellVal.toString();
        if (typeof cellVal === "string") {
            const trimmed = cellVal.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                }
            }
            return trimmed;
        }
        if (typeof cellVal === "object") {
            if ("result" in cellVal && cellVal.result !== null && cellVal.result !== undefined) {
                return formatCellVal(cellVal.result);
            }
            if ("text" in cellVal && cellVal.text) {
                return formatCellVal(cellVal.text);
            }
        }
        return cellVal.toString().trim();
    };

    const formatDateNoShift = (val, fallback) => {
        if (!val) return fallback;
        if (val instanceof Date) {
            if (isNaN(val.getTime())) return fallback;
            const pad = (n) => n.toString().padStart(2, "0");
            return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T00:00:00`;
        }
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
                }
            }
            if (trimmed.includes("T")) return trimmed.split(".")[0];
            if (trimmed.length >= 10) return `${trimmed.substring(0, 10)}T00:00:00`;
            return fallback;
        }
        return fallback;
    };

    // Dynamically find start row for "Addis Ababa" in Column 2 (scan rows 1 to 25)
    let startRow = 16;
    for (let r = 1; r <= 25; r++) {
        const c2 = formatCellVal(worksheet.getRow(r).getCell(2).value);
        if (c2.toLowerCase().trim().includes("addis ababa")) {
            startRow = r;
            break;
        }
    }

    let parsedInstCode = instCode || "0000001";
    if (startRow > 10) {
        const c8Label = formatCellVal(worksheet.getCell("A8").value);
        if (c8Label.toLowerCase().includes("inst")) {
            const rawCode = formatCellVal(worksheet.getCell("C8").value);
            if (rawCode) parsedInstCode = rawCode;
        }
    }

    const finYearStr = startRow > 10 ? formatCellVal(worksheet.getCell("C9").value) : "";
    const sDateRaw = startRow > 10 ? worksheet.getCell("C10").value : null;
    const eDateRaw = startRow > 10 ? worksheet.getCell("C11").value : null;

    const formattedStartDate = formatDateNoShift(startDate || sDateRaw, "2026-07-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || eDateRaw, "2026-07-31T00:00:00");
    const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

    const itemValuesMap = {};
    let itemIndex = 0;

    // Read 113 data rows starting from startRow
    for (let r = startRow; r < startRow + 113; r++) {
        const row = worksheet.getRow(r);
        for (let c = 3; c <= 20; c++) {
            if (itemIndex < IF002_ITEM_DEFINITIONS.length) {
                const code = IF002_ITEM_DEFINITIONS[itemIndex].code;
                itemValuesMap[code] = formatCellVal(row.getCell(c).value);
                itemIndex++;
            }
        }
    }

    const returnItemsList = IF002_ITEM_DEFINITIONS.map(def => ({
        Code: def.code,
        Value: itemValuesMap[def.code] !== undefined ? itemValuesMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: "DIFIF002",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcelIF002(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("IF Deposits Sector & Region");

    sheet.getCell("A1").value = "DIFIF002";
    sheet.getCell("A1").font = { name: "Arial", size: 10, bold: true };

    // Row 4 Title Banner
    sheet.mergeCells("A4:T6");
    const titleCell = sheet.getCell("A4");
    titleCell.value = "Monthly Report on Interest free Deposits by Sector and Region";
    titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFF0000" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    const cleanDate = (isoStr) => isoStr ? isoStr.split("T")[0] : "";

    // Metadata Block (Rows 8-11)
    sheet.getCell("A8").value = "Instiution Code";
    sheet.getCell("C8").value = jsonPayload.InstCode || "1";

    sheet.getCell("A9").value = "Financial Year";
    sheet.getCell("C9").value = jsonPayload.FinYear || 2026;

    sheet.getCell("A10").value = "Start Date";
    sheet.getCell("C10").value = cleanDate(jsonPayload.StartDate) || "2026-08-01";

    sheet.getCell("A11").value = "End Date";
    sheet.getCell("C11").value = cleanDate(jsonPayload.EndDate) || "2026-08-31";

    // Row 13 Unit Banner Right-Aligned in Col R
    sheet.getCell("R13").value = "In Millions of Birr";
    sheet.getCell("R13").font = { name: "Arial", size: 10, bold: true };
    sheet.getCell("R13").alignment = { horizontal: "right" };

    // Headers Row 14
    sheet.getCell("A14").value = "Code";
    sheet.getCell("B14").value = "Region";

    const sectorBanners = [
        { colStart: 3, colEnd: 5, label: "Pub. Enterprise" },
        { colStart: 6, colEnd: 8, label: "Private & Coop." },
        { colStart: 9, colEnd: 11, label: "Regional Gov." },
        { colStart: 12, colEnd: 14, label: "Banks" },
        { colStart: 15, colEnd: 17, label: "Others" },
        { colStart: 18, colEnd: 20, label: "Total" }
    ];

    sectorBanners.forEach(sec => {
        const startCell = sheet.getCell(14, sec.colStart);
        const endCell = sheet.getCell(14, sec.colEnd);
        sheet.mergeCells(14, sec.colStart, 14, sec.colEnd);
        startCell.value = sec.label;
        startCell.alignment = { horizontal: "center" };
    });
    sheet.getRow(14).font = { name: "Arial", size: 10, bold: true };

    // Headers Row 15
    const subHeaders = ["Amount", "# of Depositors", "# of Accounts"];
    for (let i = 0; i < 6; i++) {
        sheet.getCell(15, 3 + i * 3).value = subHeaders[0];
        sheet.getCell(15, 4 + i * 3).value = subHeaders[1];
        sheet.getCell(15, 5 + i * 3).value = subHeaders[2];
    }
    sheet.getRow(15).font = { name: "Arial", size: 10, bold: true };

    const itemsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            itemsMap[item.Code] = item.Value;
        });
    }

    const parseNum = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? parseFloat(v) : 0;
    const parseNumInt = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? Math.round(parseFloat(v)) : 0;

    let itemIndex = 0;
    let currentRow = 16;

    // Track vertical column totals for Row 128
    const columnTotals = new Array(18).fill(0);

    REGION_NAMES.forEach((region, rIdx) => {
        const subLabels = [
            { code: `${rIdx + 1}`, label: region, isHeader: true },
            { code: `${rIdx + 1}.1`, label: "Demand", isHeader: false },
            { code: `${rIdx + 1}.2`, label: "Saving", isHeader: false },
            { code: `${rIdx + 1}.3`, label: `Time (${rIdx + 1}.3.1+${rIdx + 1}.3.2)`, isHeader: false },
            { code: `${rIdx + 1}.3.1`, label: "Restricted Investment Deposit", isHeader: false },
            { code: `${rIdx + 1}.3.2`, label: "Unrestricted Investment Deposit", isHeader: false },
            { code: "", label: "Urban", isHeader: false },
            { code: "", label: "Rural", isHeader: false }
        ];

        subLabels.forEach((sub, sIdx) => {
            const row = sheet.getRow(currentRow);
            row.getCell(1).value = sub.code;
            row.getCell(2).value = sub.label;
            if (sub.isHeader) row.font = { name: "Arial", size: 10, bold: true };

            const rowVals = [];
            for (let c = 3; c <= 20; c++) {
                if (itemIndex < IF002_ITEM_DEFINITIONS.length - 18) {
                    const code = IF002_ITEM_DEFINITIONS[itemIndex].code;
                    const val = itemsMap[code];
                    rowVals.push(val);
                    itemIndex++;
                }
            }

            // Populate Cols C to T (3 to 20)
            for (let i = 0; i < 18; i++) {
                const rawVal = rowVals[i];
                let numVal = (rawVal !== "" && rawVal !== undefined && rawVal !== null && !isNaN(parseFloat(rawVal))) ? parseFloat(rawVal) : (rawVal || "");

                // Auto-calculate horizontal Total column if missing (Cols 15, 16, 17 -> R, S, T)
                if (i === 15 && (numVal === "" || numVal === 0)) {
                    // Col R Amount = Col C (0) + Col F (3) + Col I (6) + Col L (9) + Col O (12)
                    const amtSum = parseNum(rowVals[0]) + parseNum(rowVals[3]) + parseNum(rowVals[6]) + parseNum(rowVals[9]) + parseNum(rowVals[12]);
                    if (amtSum) numVal = parseFloat(amtSum.toFixed(2));
                }
                if (i === 16 && (numVal === "" || numVal === 0)) {
                    // Col S Depositors = Col D (1) + Col G (4) + Col J (7) + Col M (10) + Col P (13)
                    const depSum = parseNumInt(rowVals[1]) + parseNumInt(rowVals[4]) + parseNumInt(rowVals[7]) + parseNumInt(rowVals[10]) + parseNumInt(rowVals[13]);
                    if (depSum) numVal = depSum;
                }
                if (i === 17 && (numVal === "" || numVal === 0)) {
                    // Col T Accounts = Col E (2) + Col H (5) + Col K (8) + Col N (11) + Col Q (14)
                    const accSum = parseNumInt(rowVals[2]) + parseNumInt(rowVals[5]) + parseNumInt(rowVals[8]) + parseNumInt(rowVals[11]) + parseNumInt(rowVals[14]);
                    if (accSum) numVal = accSum;
                }

                row.getCell(3 + i).value = numVal;

                // Accumulate region header row (sIdx === 0) into Total Deposits
                if (sIdx === 0) {
                    if (typeof numVal === "number") {
                        columnTotals[i] += numVal;
                    }
                }
            }

            currentRow++;
        });
    });

    // Row 128: Total Deposits Row
    const totalRow = sheet.getRow(currentRow);
    totalRow.getCell(1).value = "";
    totalRow.getCell(2).value = "Total Deposits";
    totalRow.font = { name: "Arial", size: 10, bold: true };

    for (let i = 0; i < 18; i++) {
        let numVal = "";
        if (itemIndex < IF002_ITEM_DEFINITIONS.length) {
            const code = IF002_ITEM_DEFINITIONS[itemIndex].code;
            const val = itemsMap[code];
            if (val !== "" && val !== undefined && val !== null && !isNaN(parseFloat(val)) && parseFloat(val) !== 0) {
                numVal = parseFloat(val);
            }
            itemIndex++;
        }
        // If JSON total item was empty or 0, use calculated sum from region headers!
        if (numVal === "" || numVal === 0) {
            if (columnTotals[i] !== 0) {
                if (i % 3 === 0) {
                    numVal = parseFloat(columnTotals[i].toFixed(2));
                } else {
                    numVal = Math.round(columnTotals[i]);
                }
            }
        }
        totalRow.getCell(3 + i).value = numVal;
    }

    // Footnotes at bottom
    currentRow += 2;
    sheet.getCell(currentRow, 1).value = "NOTE:";
    sheet.getCell(currentRow, 1).font = { name: "Arial", size: 10, bold: true };
    currentRow++;

    sheet.getCell(currentRow, 2).value = "CERS (Central Ethiopia Regional State)";
    currentRow++;

    sheet.getCell(currentRow, 2).value = "SERS (South Ethiopia Regional State)";
    currentRow++;

    sheet.getCell(currentRow, 2).value = "Classification of Urban and Rural shall be as per CSS Ethiopia database";

    return workbook;
}




function sanitizeJsonPayload(payload: any): any {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => {
            if (!item) return item;
            const val = item.Value;
            const isZero = val === null || val === undefined || String(val).trim() === "";
            return {
                ...item,
                Value: isZero ? "0" : String(val).trim()
            };
        });
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const val = subItem.Value;
                    const isZero = val === null || val === undefined || String(val).trim() === "";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (val === null || val === undefined ? "" : String(val).trim())
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    const val = entry[k];
                    if (val === null || val === undefined || String(val).trim() === "") {
                        entry[k] = "0";
                    } else {
                        entry[k] = String(val).trim();
                    }
                });
            }
            return entry;
        });
    }
    return payload;
}



export async function processIF002Report(
    instCode: string = "0000001",
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string; jsonPath?: string; excelPath?: string }> {
    try {
        if (!inputFilePath || !fs.existsSync(inputFilePath)) {
            return {
                success: false,
                error: "Input file '${inputFilePath}' not found."
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const rawJson = processIF002(worksheet, instCode, startDateStr, endDateStr);
        const jsonPayload = sanitizeJsonPayload(rawJson);

        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputPathJson, JSON.stringify(jsonPayload, null, 4), "utf8");

        if (outputExcelPath) {
            const excelDir = path.dirname(outputExcelPath);
            if (!fs.existsSync(excelDir)) {
                fs.mkdirSync(excelDir, { recursive: true });
            }
            const outWorkbook = await jsonToExcelIF002(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing IF002 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process IF002 report."
        };
    }
}


