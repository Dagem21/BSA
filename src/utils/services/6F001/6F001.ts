// @ts-nocheck
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import {
    F6001_CELL_MAPPING,
    F6001_ITEM_DEFINITIONS,
    F6001JsonData
} from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return "";
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) return str;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    return str;
}

export function getDirectCellValue(cell: any): string {
    if (!cell || cell === null || cell === undefined) return "";
    let val = cell;
    if (cell && typeof cell === "object" && "value" in cell) {
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
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "[object Object]" ? "" : trimmed;
    }
    if (val instanceof Date) {
        return formatIsoString(val);
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && val.result !== null && "error" in val.result) {
                return "";
            }
            if (typeof val.result === "number") return String(val.result);
            if (typeof val.result === "string") {
                const s = val.result.trim();
                return s === "[object Object]" ? "" : s;
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t: any) => (t && t.text ? t.text : "")).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
    }
    if (cell.result !== undefined && cell.result !== null) {
        if (typeof cell.result === "object" && "error" in cell.result) return "";
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return String(val).trim();
}

export function process6F001(
    worksheet: ExcelJS.Worksheet,
    instCodeOverride?: string,
    startDateOverride?: string,
    endDateOverride?: string
): F6001JsonData {
    let instCode = instCodeOverride || "0000001";
    let finYear = 2026;
    let startDate = startDateOverride || "2026-07-01T00:00:00";
    let endDate = endDateOverride || "2026-09-30T00:00:00";

    const c8Val = getDirectCellValue(worksheet.getCell("C8"));
    if (c8Val && c8Val.length >= 3) {
        instCode = c8Val;
    }

    const c9Val = getDirectCellValue(worksheet.getCell("C9"));
    if (c9Val) {
        const parsedYear = parseInt(c9Val, 10);
        if (!isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
            finYear = parsedYear;
        }
    }

    const c10Val = getDirectCellValue(worksheet.getCell("C10"));
    if (c10Val) {
        const iso = formatIsoString(c10Val);
        if (iso) startDate = iso;
    }

    const c11Val = getDirectCellValue(worksheet.getCell("C11"));
    if (c11Val) {
        const iso = formatIsoString(c11Val);
        if (iso) endDate = iso;
    }

    const returnItemsList: any[] = [];
    for (const m of F6001_CELL_MAPPING) {
        const cell = worksheet.getCell(`${m.col}${m.row}`);
        const rawVal = getDirectCellValue(cell);
        returnItemsList.push({
            Code: m.code,
            Value: rawVal || "0",
            _description: m.desc,
            _dataType: "NUMERIC",
            _required: false
        });
    }

    return {
        ReturnKey: "MFER6F001",
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcel6F001(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<ExcelJS.Workbook> {
    let templatePath = path.join(process.cwd(), "templates", "6F001.xlsx");
    if (!fs.existsSync(templatePath)) {
        templatePath = path.join(process.cwd(), "templates", "DF001.xlsx");
    }

    const workbook = new ExcelJS.Workbook();
    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        workbook.addWorksheet("6. Market Risk FX");
    }

    let worksheet =
        workbook.getWorksheet("6. Market Risk FX") ||
        workbook.worksheets.find(ws => ws.name.toUpperCase().includes("MARKET RISK")) ||
        workbook.worksheets[0];

    if (!worksheet) {
        worksheet = workbook.addWorksheet("6. Market Risk FX");
    }

    // 1. Set metadata
    if (jsonPayload.ReturnKey) worksheet.getCell("A1").value = jsonPayload.ReturnKey;
    if (jsonPayload.InstCode) worksheet.getCell("C8").value = jsonPayload.InstCode;
    if (jsonPayload.FinYear) worksheet.getCell("C9").value = Number(jsonPayload.FinYear);
    if (jsonPayload.StartDate) worksheet.getCell("C10").value = jsonPayload.StartDate;
    if (jsonPayload.EndDate) worksheet.getCell("C11").value = jsonPayload.EndDate;

    // Helper to safely set cell value without overwriting formulas or breaking shared formula ranges
    const safeSet = (cellOrAddress: any, rawVal: any) => {
        if (rawVal === undefined || rawVal === null || rawVal === "") return;
        const cell = typeof cellOrAddress === "string" ? worksheet.getCell(cellOrAddress) : cellOrAddress;
        if (
            cell.type === ExcelJS.ValueType.Formula ||
            (cell.value && typeof cell.value === "object" && ("formula" in cell.value || "sharedFormula" in cell.value))
        ) {
            return;
        }
        const num = parseFloat(rawVal);
        cell.value = isNaN(num) ? rawVal : num;
    };

    // 2. Set return items
    const itemsMap: Record<string, string> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach((itm: any) => {
            if (itm && itm.Code) {
                itemsMap[itm.Code] = itm.Value !== undefined && itm.Value !== null ? String(itm.Value) : "";
            }
        });
    }

    for (const m of F6001_CELL_MAPPING) {
        safeSet(`${m.col}${m.row}`, itemsMap[m.code]);
    }

    if (outputExcelPath) {
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    return workbook;
}

export function sanitizeJsonPayload(payload: any): any {
    if (!payload || typeof payload !== "object") return payload;
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
    if (!Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = [];
    }
    return payload;
}

export async function process6F001Report(
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
                error: `Input file '${inputFilePath}' not found.`
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);
        const worksheet =
            workbook.getWorksheet("6. Market Risk FX") ||
            workbook.worksheets.find(ws => ws.name.toUpperCase().includes("MARKET RISK")) ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const rawJson = process6F001(worksheet, instCode, startDateStr, endDateStr);
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
            if (fs.existsSync(inputFilePath)) {
                fs.copyFileSync(inputFilePath, outputExcelPath);
            } else {
                await jsonToExcel6F001(jsonPayload, outputExcelPath);
            }
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing 6F001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process 6F001 report."
        };
    }
}
