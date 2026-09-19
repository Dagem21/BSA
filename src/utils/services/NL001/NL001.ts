// @ts-nocheck

function getDirectCellValue(cell: any): string {
    if (!cell || cell === null || cell === undefined) return "";
    let val = cell;
    if (cell && typeof cell === "object" && "value" in cell && ("type" in cell || "address" in cell || "worksheet" in cell)) {
        val = cell.value;
    }
    if (val === null || val === undefined) {
        if (cell && typeof cell === "object") {
            if (cell.result !== undefined && cell.result !== null) {
                if (typeof cell.result === "object" && "error" in cell.result) return "";
                return String(cell.result).trim();
            }
            if (cell.text !== undefined && cell.text !== null) {
                return String(cell.text).trim();
            }
        }
        return "";
    }
    if (typeof val === "number") return String(val);
    if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "[object Object]") return "";
        return trimmed;
    }
    if (Array.isArray(val)) {
        return val.map((item: any) => {
            if (!item) return "";
            if (typeof item === "string") return item;
            if (typeof item === "object") {
                if ("text" in item && item.text) return item.text;
                if ("result" in item && item.result !== undefined && item.result !== null) return String(item.result);
            }
            return "";
        }).join("").trim();
    }
    if (val instanceof Date) {
        if (isNaN(val.getTime())) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`;
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && val.result !== null && "error" in val.result) return "";
            if (typeof val.result === "number") return String(val.result);
            if (typeof val.result === "string") {
                const s = val.result.trim();
                return s === "[object Object]" ? "" : s;
            }
            if (Array.isArray(val.result)) {
                return val.result.map((item: any) => (item && typeof item === "object" && "text" in item ? item.text : String(item))).join("").trim();
            }
            if (val.result instanceof Date) {
                if (isNaN(val.result.getTime())) return "";
                const pad = (n: number) => String(n).padStart(2, "0");
                return `${val.result.getFullYear()}-${pad(val.result.getMonth() + 1)}-${pad(val.result.getDate())}`;
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t: any) => (t && t.text ? t.text : "")).join("").trim();
        }
        if ("text" in val && val.text) return String(val.text).trim();
        if (cell && cell.result !== undefined && cell.result !== null) {
            if (typeof cell.result === "object" && "error" in cell.result) return "";
            return String(cell.result).trim();
        }
        if (cell && cell.text !== undefined && cell.text !== null) return String(cell.text).trim();
        return "";
    }
    return "";
}

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
    const formatCellVal = (cellVal: any): string => getDirectCellValue(cellVal);

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
            let val = item.Value;
            if (val && typeof val === "object") {
                val = getDirectCellValue(val);
            }
            const strVal = (val === null || val === undefined) ? "" : String(val).trim();
            const isZero = strVal === "" || strVal === "[object Object]";
            return {
                ...item,
                Value: isZero ? "0" : strVal
            };
        });
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    let val = subItem.Value;
                    if (val && typeof val === "object") {
                        val = getDirectCellValue(val);
                    }
                    const strVal = (val === null || val === undefined) ? "" : String(val).trim();
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const isZero = strVal === "" || strVal === "[object Object]";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (isZero && !isNumeric ? "" : strVal)
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    let val = entry[k];
                    if (val && typeof val === "object") {
                        val = getDirectCellValue(val);
                    }
                    const strVal = (val === null || val === undefined) ? "" : String(val).trim();
                    if (strVal === "" || strVal === "[object Object]") {
                        entry[k] = "0";
                    } else {
                        entry[k] = strVal;
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


