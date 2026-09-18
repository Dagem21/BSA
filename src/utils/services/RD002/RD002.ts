// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

// Generate all 1,356 ReturnItems definitions for RD002
// 113 rows x 12 columns (Cols C=3 to N=14)
// Codes range from RD002_52352 to RD002_53707

const REGION_NAMES = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
    "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
];

function buildRD002Definitions() {
    const defs = [];
    let codeIndex = 52352;

    const columnSuffixes = [
        "  <= Birr 100,000 _Amount ",
        " <= Birr 100,000 _ # of Depositors ",
        " <= Birr 100,000 _ # of Accounts  ",
        ">Birr 100,000-1million _ >Birr 100,000-1million _Amount ",
        ">Birr 100,000-1million _ # of Depositors ",
        " >Birr 100,000-1million _# of Accounts  ",
        " > Birr 1 million_ Amount ",
        " > Birr 1 million_ # of Depositors ",
        " > Birr 1 million_ # of Accounts  ",
        "  Total  _Amount ",
        " Total  _ # of Depositors ",
        " Total  _ # of Accounts  "
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
                const code = `RD002_${codeIndex}`;
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

    // Total Deposits Row (12 items)
    columnSuffixes.forEach(suffix => {
        const code = `RD002_${codeIndex}`;
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

const RD002_ITEM_DEFINITIONS = buildRD002Definitions();

export function processRD002(worksheet, instCode, startDate, endDate) {
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
        for (let c = 3; c <= 14; c++) {
            if (itemIndex < RD002_ITEM_DEFINITIONS.length) {
                const code = RD002_ITEM_DEFINITIONS[itemIndex].code;
                itemValuesMap[code] = formatCellVal(row.getCell(c).value);
                itemIndex++;
            }
        }
    }

    const returnItemsList = RD002_ITEM_DEFINITIONS.map(def => ({
        Code: def.code,
        Value: itemValuesMap[def.code] !== undefined ? itemValuesMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: "DIR RANGERD002",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcelRD002(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Interest Free Range & Region");

    // Row 1: Amount banner right-aligned
    sheet.getCell("L1").value = "Amount in Millions of Birr";
    sheet.getCell("L1").font = { name: "Arial", size: 10, bold: true };
    sheet.getCell("L1").alignment = { horizontal: "right" };

    // Row 2: Table Header Ranges
    sheet.getCell("A2").value = "Code";
    sheet.getCell("B2").value = "Region";

    sheet.mergeCells("C2:E2");
    sheet.getCell("C2").value = "<= Birr 100,000";
    sheet.getCell("C2").alignment = { horizontal: "center" };

    sheet.mergeCells("F2:H2");
    sheet.getCell("F2").value = ">Birr 100,000-1million";
    sheet.getCell("F2").alignment = { horizontal: "center" };

    sheet.mergeCells("I2:K2");
    sheet.getCell("I2").value = "> Birr 1 million";
    sheet.getCell("I2").alignment = { horizontal: "center" };

    sheet.mergeCells("L2:N2");
    sheet.getCell("L2").value = "Total";
    sheet.getCell("L2").alignment = { horizontal: "center" };

    sheet.getRow(2).font = { name: "Arial", size: 10, bold: true };

    // Row 4: Sub-headers
    const subHeaders = ["Amount", "# of Depositors", "# of Accounts"];
    for (let i = 0; i < 4; i++) {
        sheet.getCell(4, 3 + i * 3).value = subHeaders[0];
        sheet.getCell(4, 4 + i * 3).value = subHeaders[1];
        sheet.getCell(4, 5 + i * 3).value = subHeaders[2];
    }
    sheet.getRow(4).font = { name: "Arial", size: 10, bold: true };

    const itemsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            itemsMap[item.Code] = item.Value;
        });
    }

    const parseNum = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? parseFloat(v) : 0;
    const parseNumInt = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? Math.round(parseFloat(v)) : 0;

    let itemIndex = 0;
    let currentRow = 5; // Data starts at Row 5!

    const columnTotals = new Array(12).fill(0);

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
            for (let c = 3; c <= 14; c++) {
                if (itemIndex < RD002_ITEM_DEFINITIONS.length - 12) {
                    const code = RD002_ITEM_DEFINITIONS[itemIndex].code;
                    const val = itemsMap[code];
                    rowVals.push(val);
                    itemIndex++;
                }
            }

            // Populate Cols C to N (3 to 14)
            for (let i = 0; i < 12; i++) {
                const rawVal = rowVals[i];
                let numVal = (rawVal !== "" && rawVal !== undefined && rawVal !== null && !isNaN(parseFloat(rawVal))) ? parseFloat(rawVal) : (rawVal || "");

                // Auto-calculate horizontal Total column if missing (Cols 9, 10, 11 -> L, M, N)
                if (i === 9 && (numVal === "" || numVal === 0)) {
                    const cVal = parseNum(rowVals[0]);
                    const fVal = parseNum(rowVals[3]);
                    const iVal = parseNum(rowVals[6]);
                    if (cVal || fVal || iVal) numVal = parseFloat((cVal + fVal + iVal).toFixed(2));
                }
                if (i === 10 && (numVal === "" || numVal === 0)) {
                    const dVal = parseNumInt(rowVals[1]);
                    const gVal = parseNumInt(rowVals[4]);
                    const jVal = parseNumInt(rowVals[7]);
                    if (dVal || gVal || jVal) numVal = dVal + gVal + jVal;
                }
                if (i === 11 && (numVal === "" || numVal === 0)) {
                    const eVal = parseNumInt(rowVals[2]);
                    const hVal = parseNumInt(rowVals[5]);
                    const kVal = parseNumInt(rowVals[8]);
                    if (eVal || hVal || kVal) numVal = eVal + hVal + kVal;
                }

                row.getCell(3 + i).value = numVal;

                // Accumulate region header row (sIdx === 0) into Total Deposit Amount
                if (sIdx === 0) {
                    if (typeof numVal === "number") {
                        columnTotals[i] += numVal;
                    }
                }
            }

            currentRow++;
        });
    });

    // Row 117: Total Deposit Amount Row
    const totalRow = sheet.getRow(currentRow);
    totalRow.getCell(1).value = "";
    totalRow.getCell(2).value = "Total Deposit Amount";
    totalRow.font = { name: "Arial", size: 10, bold: true };

    for (let i = 0; i < 12; i++) {
        let numVal = "";
        if (itemIndex < RD002_ITEM_DEFINITIONS.length) {
            const code = RD002_ITEM_DEFINITIONS[itemIndex].code;
            const val = itemsMap[code];
            if (val !== "" && val !== undefined && val !== null && !isNaN(parseFloat(val)) && parseFloat(val) !== 0) {
                numVal = parseFloat(val);
            }
            itemIndex++;
        }
        // If JSON total item was empty or 0, use our calculated sum from region headers!
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



export async function processRD002Report(
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

        const rawJson = processRD002(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelRD002(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing RD002 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process RD002 report."
        };
    }
}


