// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

const NL001_ITEM_DEFINITIONS = [
    { code: "9_00001", description: "1-Total non-performing loans (sum 2-4)", dataType: "NUMERIC", required: false },
    { code: "9_00002", description: "2-Total substandard loans", dataType: "NUMERIC", required: false },
    { code: "9_00003", description: "2.1- Realizable security", dataType: "NUMERIC", required: false },
    { code: "9_00004", description: "2.2-Net substandard loans (2-2.1)", dataType: "NUMERIC", required: false },
    { code: "9_00005", description: "2.3-Specific provisions required (20% of 2.2)", dataType: "NUMERIC", required: false },
    { code: "9_00006", description: "2.4-Specific provisions held", dataType: "NUMERIC", required: false },
    { code: "9_00007", description: "2.5-Excess/shortfall (2.4-2.3)", dataType: "NUMERIC", required: false },
    { code: "9_00008", description: "2.6-Number of classified loans", dataType: "NUMERIC", required: false },
    { code: "9_00009", description: "3-Total Doubtful Loans", dataType: "NUMERIC", required: false },
    { code: "9_00010", description: "3.1-Realizable Security", dataType: "NUMERIC", required: false },
    { code: "9_00011", description: "3.2-Net Doubtful Loans (3-3.1)", dataType: "NUMERIC", required: false },
    { code: "9_00012", description: "3.3-Specific Provisions Required (50% of 3.2)", dataType: "NUMERIC", required: false },
    { code: "9_00013", description: "3.4-Specific Provisions Held", dataType: "NUMERIC", required: false },
    { code: "9_00014", description: "3.5-Excess /Shortfall (3.4-3.3)", dataType: "NUMERIC", required: false },
    { code: "9_00015", description: "3.6-Number of classified loans", dataType: "NUMERIC", required: false },
    { code: "9_00016", description: "4-Total Loss Loans", dataType: "NUMERIC", required: false },
    { code: "9_00017", description: "4.1-Realizable Security", dataType: "NUMERIC", required: false },
    { code: "9_00018", description: "4.2-Net Loss Loans (4-4.1)", dataType: "NUMERIC", required: false },
    { code: "9_00019", description: "4.3-Specific Provisions Required (100% of 4.2)", dataType: "NUMERIC", required: false },
    { code: "9_00020", description: "4.4-Specific Provisions Held", dataType: "NUMERIC", required: false },
    { code: "9_00021", description: "4.5-Excess/Shortfall (4.4-4.3)", dataType: "NUMERIC", required: false },
    { code: "9_00022", description: "4.6-Number of classified loans", dataType: "NUMERIC", required: false }
];

export function processNL001(worksheet, instCode, startDate, endDate) {
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

    const parsedInstCode = formatCellVal(worksheet.getCell("C8").value) || formatCellVal(worksheet.getCell("B8").value) || instCode || "0000001";
    const finYearStr = formatCellVal(worksheet.getCell("C9").value);
    const sDateRaw = worksheet.getCell("C10").value;
    const eDateRaw = worksheet.getCell("C11").value;

    const formattedStartDate = formatDateNoShift(startDate || sDateRaw, "2026-04-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || eDateRaw, "2026-06-30T00:00:00");
    const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

    const itemValuesMap = {};
    for (let r = 15; r <= 36; r++) {
        const itemIndex = r - 15;
        if (itemIndex < NL001_ITEM_DEFINITIONS.length) {
            const code = NL001_ITEM_DEFINITIONS[itemIndex].code;
            itemValuesMap[code] = formatCellVal(worksheet.getRow(r).getCell(3).value);
        }
    }

    const returnItemsList = NL001_ITEM_DEFINITIONS.map((def) => ({
        Code: def.code,
        Value: itemValuesMap[def.code] !== undefined ? itemValuesMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: "NPL&PRO_NL001",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcelNL001(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("NPL & Provisions");

    sheet.mergeCells("A4:C6");
    const titleCell = sheet.getCell("A4");
    titleCell.value = "Non-Performing Loans and Advances & Provisions";
    titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFFF0000" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2DCDB" } };

    const cleanDate = (isoStr) => isoStr ? isoStr.split("T")[0] : "";

    sheet.getCell("A8").value = "Instituion code";
    sheet.getCell("C8").value = jsonPayload.InstCode || "0000001";

    sheet.getCell("A9").value = "Financial Year";
    sheet.getCell("C9").value = jsonPayload.FinYear || 2026;

    sheet.getCell("A10").value = "Start Date";
    sheet.getCell("C10").value = cleanDate(jsonPayload.StartDate) || "2026-04-01";

    sheet.getCell("A11").value = "End Date";
    sheet.getCell("C11").value = cleanDate(jsonPayload.EndDate) || "2026-06-30";

    sheet.getCell("A14").value = "Code";
    sheet.getCell("B14").value = "Description";
    sheet.getCell("C14").value = "Amount";
    sheet.getRow(14).font = { bold: true };

    const itemsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            itemsMap[item.Code] = item.Value;
        });
    }

    NL001_ITEM_DEFINITIONS.forEach((def, idx) => {
        const r = 15 + idx;
        const row = sheet.getRow(r);
        row.getCell(1).value = def.code.replace("9_", "");
        row.getCell(2).value = def.description;
        const val = itemsMap[def.code];
        const numVal = (val !== "" && val !== undefined && !isNaN(parseFloat(val))) ? parseFloat(val) : (val || "");
        row.getCell(3).value = numVal;
    });

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



export async function processNL001Report(
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

        const rawJson = processNL001(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelNL001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing NL001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process NL001 report."
        };
    }
}


