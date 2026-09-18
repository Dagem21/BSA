// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

// Generate all 1,530 ReturnItems definitions for RS002
// 85 rows x 18 columns (Cols C=3 to T=20)
// Codes range from RS002_50822 to RS002_52351

const REGION_NAMES = [
    "ADDIS ABABA", "AFAR", "AMHARA", "BENSHANGUL", "DIRE DAWA", "GAMBELLA",
    "HARARI", "OROMIYA", "SOMALE", "TIGRAY", "SIDAMA", "SWERS", "CENTRAL ETHIOPIA", "South Ethiopia"
];

function buildRS002Definitions() {
    const defs = [];
    let codeIndex = 50822;

    const columnSuffixes = [
        " Public Enterprise _Amount ", " Public Enterprise _ # of Borrowers ", " Public Enterprise _ # of Accounts  ",
        " Private & Coop. _Amount ", " Private & Coop. _ # of Borrowers ", " Private & Coop. _ # of Accounts  ",
        " Regional Gov't _Amount ", " Regional Gov't _ # of Borrowers ", " Regional Gov't _ # of Accounts  ",
        " Banks _Amount ", " Banks _ # of Borrowers ", " Banks _ # of Accounts  ",
        " Others* _Amount ", " Others* _ # of Borrowers ", " Others* _ # of Accounts  ",
        " Total  _Amount ", " Total  _ # of Borrowers ", " Total  _ # of Accounts  "
    ];

    REGION_NAMES.forEach((region, rIdx) => {
        const subRowTypes = [
            "",
            "Term loan_",
            "Overdraft_",
            "Merch. Loan*_",
            "Urban_",
            "Rural_"
        ];

        subRowTypes.forEach(sub => {
            columnSuffixes.forEach(suffix => {
                const code = `RS002_${codeIndex}`;
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

    // Total Amount Row (18 items)
    columnSuffixes.forEach(suffix => {
        const code = `RS002_${codeIndex}`;
        defs.push({
            code,
            description: `Total Amount_${suffix}`,
            dataType: "NUMERIC",
            required: false
        });
        codeIndex++;
    });

    return defs;
}

const RS002_ITEM_DEFINITIONS = buildRS002Definitions();

export function processRS002(worksheet, instCode, startDate, endDate) {
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
    let startRow = 14;
    for (let r = 1; r <= 25; r++) {
        const c2 = formatCellVal(worksheet.getRow(r).getCell(2).value);
        if (c2.toLowerCase().trim().includes("addis ababa")) {
            startRow = r;
            break;
        }
    }

    let parsedInstCode = instCode || "0000001";
    if (startRow > 6) {
        const c7Label = formatCellVal(worksheet.getCell("A7").value);
        if (c7Label.toLowerCase().includes("inst")) {
            const rawCode = formatCellVal(worksheet.getCell("C7").value);
            if (rawCode) parsedInstCode = rawCode;
        }
    }

    const finYearStr = startRow > 6 ? formatCellVal(worksheet.getCell("C8").value) : "";
    const sDateRaw = startRow > 6 ? worksheet.getCell("C9").value : null;
    const eDateRaw = startRow > 6 ? worksheet.getCell("C10").value : null;

    const formattedStartDate = formatDateNoShift(startDate || sDateRaw, "2026-08-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || eDateRaw, "2026-08-31T00:00:00");
    const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

    const itemValuesMap = {};
    let itemIndex = 0;

    for (let r = startRow; r < startRow + 85; r++) {
        const row = worksheet.getRow(r);
        for (let c = 3; c <= 20; c++) {
            if (itemIndex < RS002_ITEM_DEFINITIONS.length) {
                const code = RS002_ITEM_DEFINITIONS[itemIndex].code;
                itemValuesMap[code] = formatCellVal(row.getCell(c).value);
                itemIndex++;
            }
        }
    }

    const returnItemsList = RS002_ITEM_DEFINITIONS.map(def => ({
        Code: def.code,
        Value: itemValuesMap[def.code] !== undefined ? itemValuesMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: "LOAN_SEC & REGRS002",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcelRS002(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Loans Sector & Region");

    // Title Row 3
    sheet.getCell("A3").value = "Monthly Conventional Loans by Sector and Region";
    sheet.getCell("A3").font = { name: "Arial", size: 11, bold: true };

    const cleanDate = (isoStr) => isoStr ? isoStr.split("T")[0] : "";

    // Metadata Block (Rows 7-10)
    sheet.getCell("A7").value = "Instiution code";
    sheet.getCell("C7").value = jsonPayload.InstCode || "0000001";

    sheet.getCell("A8").value = "Financial Year";
    sheet.getCell("C8").value = jsonPayload.FinYear || 2026;

    sheet.getCell("A9").value = "Start Date";
    sheet.getCell("C9").value = cleanDate(jsonPayload.StartDate) || "8/1/2026";

    sheet.getCell("A10").value = "End Date";
    sheet.getCell("C10").value = cleanDate(jsonPayload.EndDate) || "8/31/2026";

    // Row 11 Unit Banner Right-Aligned in Col R
    sheet.getCell("R11").value = "(Amount in Millions of Birr)";
    sheet.getCell("R11").font = { name: "Arial", size: 10, bold: true };
    sheet.getCell("R11").alignment = { horizontal: "right" };

    // Headers Row 12
    sheet.getCell("A12").value = "CODE";
    sheet.getCell("B12").value = "REGION";

    const sectorBanners = [
        { colStart: 3, colEnd: 5, label: "Public Enterprise" },
        { colStart: 6, colEnd: 8, label: "Private AND Cooperative" },
        { colStart: 9, colEnd: 11, label: "Regional Govt" },
        { colStart: 12, colEnd: 14, label: "Banks" },
        { colStart: 15, colEnd: 17, label: "Others*" },
        { colStart: 18, colEnd: 20, label: "Total" }
    ];

    sectorBanners.forEach(sec => {
        sheet.mergeCells(12, sec.colStart, 12, sec.colEnd);
        const cell = sheet.getCell(12, sec.colStart);
        cell.value = sec.label;
        cell.alignment = { horizontal: "center" };
    });
    sheet.getRow(12).font = { name: "Arial", size: 10, bold: true };

    // Headers Row 13
    const subHeaders = ["Amount", "# of Borrowers", "# of Accounts"];
    for (let i = 0; i < 6; i++) {
        sheet.getCell(13, 3 + i * 3).value = subHeaders[0];
        sheet.getCell(13, 4 + i * 3).value = subHeaders[1];
        sheet.getCell(13, 5 + i * 3).value = subHeaders[2];
    }
    sheet.getRow(13).font = { name: "Arial", size: 10, bold: true };

    const itemsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            itemsMap[item.Code] = item.Value;
        });
    }

    const parseNum = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? parseFloat(v) : 0;
    const parseNumInt = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? Math.round(parseFloat(v)) : 0;

    let itemIndex = 0;
    let currentRow = 14; // Data starts at Row 14 (Region 7 lands on Row 50, Region 14 lands on Row 92, Total lands on Row 98!)

    // Track vertical column totals for Row 98 (Total Amount)
    const columnTotals = new Array(18).fill(0);

    REGION_NAMES.forEach((region, rIdx) => {
        const subLabels = [
            { code: `${rIdx + 1}`, label: region, isHeader: true },
            { code: `${rIdx + 1}.1`, label: "Term Loan", isHeader: false },
            { code: `${rIdx + 1}.2`, label: "Overdraft", isHeader: false },
            { code: `${rIdx + 1}.3`, label: "Merch. Loan*", isHeader: false },
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
                if (itemIndex < RS002_ITEM_DEFINITIONS.length - 18) {
                    const code = RS002_ITEM_DEFINITIONS[itemIndex].code;
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
                    const amtSum = parseNum(rowVals[0]) + parseNum(rowVals[3]) + parseNum(rowVals[6]) + parseNum(rowVals[9]) + parseNum(rowVals[12]);
                    if (amtSum) numVal = parseFloat(amtSum.toFixed(2));
                }
                if (i === 16 && (numVal === "" || numVal === 0)) {
                    const borSum = parseNumInt(rowVals[1]) + parseNumInt(rowVals[4]) + parseNumInt(rowVals[7]) + parseNumInt(rowVals[10]) + parseNumInt(rowVals[13]);
                    if (borSum) numVal = borSum;
                }
                if (i === 17 && (numVal === "" || numVal === 0)) {
                    const accSum = parseNumInt(rowVals[2]) + parseNumInt(rowVals[5]) + parseNumInt(rowVals[8]) + parseNumInt(rowVals[11]) + parseNumInt(rowVals[14]);
                    if (accSum) numVal = accSum;
                }

                row.getCell(3 + i).value = numVal;

                // Accumulate region header row (sIdx === 0) into Total Amount
                if (sIdx === 0) {
                    if (typeof numVal === "number") {
                        columnTotals[i] += numVal;
                    }
                }
            }

            currentRow++;
        });
    });

    // Row 98: Total Amount Row
    const totalRow = sheet.getRow(currentRow);
    totalRow.getCell(1).value = "";
    totalRow.getCell(2).value = "Total Amount";
    totalRow.font = { name: "Arial", size: 10, bold: true };

    for (let i = 0; i < 18; i++) {
        let numVal = "";
        if (itemIndex < RS002_ITEM_DEFINITIONS.length) {
            const code = RS002_ITEM_DEFINITIONS[itemIndex].code;
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



export async function processRS002Report(
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

        const rawJson = processRS002(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelRS002(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing RS002 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process RS002 report."
        };
    }
}


