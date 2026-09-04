import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { BP001Format, BP001ValuesMap } from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
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

function getDirectCellValue(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) return "";
    const val = cell.value;
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        return val.trim();
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && "error" in val.result) {
                return "";
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t) => t.text).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
        return "";
    }
    if (cell.result !== undefined && cell.result !== null) {
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

export async function processBP001Report(
    instCode: string,
    inputFilePath: string,
    startDate: string,
    endDate: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);

    const worksheet =
        workbook.getWorksheet("BP001") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Default metadata headers (Assuming standard format: C8..C11)
    worksheet.getCell("C8").value = instCode;
    worksheet.getCell("C9").value = finYear;
    worksheet.getCell("C10").value = formattedStartDate;
    worksheet.getCell("C11").value = formattedEndDate;

    const valuesMap: BP001ValuesMap = {};
    
    // Get the expected items to build a mapping from normalized description to Code
    const emptyFormat = BP001Format("temp", "temp", 2026, "", "");
    const descToCode = new Map<string, string>();
    
    // Helper to robustly normalize descriptions
    const normalizeDesc = (str: string) => {
        return str
            .toLowerCase()
            .replace(/_amount$/i, "")       // Remove _Amount suffix (for JSON codes)
            .replace(/\([^)]*\)/g, "")      // Remove anything inside (...) e.g. formulas
            .replace(/\[[^\]]*\]/g, "")     // Remove anything inside [...] e.g. formulas
            .replace(/&/g, "and")           // Standardize & to and
            .replace(/[^a-z0-9]/g, "");     // Remove all non-alphanumeric
    };
    
    for (const item of emptyFormat.ReturnItemsList) {
        descToCode.set(normalizeDesc(item._description), item.Code);
    }

    // Scan a wide range of rows to find matching descriptions in Column B
    for (let r = 10; r <= 150; r++) {
        const row = worksheet.getRow(r);
        const descCell = getDirectCellValue(row.getCell(2)); // Column B (Description)
        
        if (!descCell) continue;
        
        const normDesc = normalizeDesc(descCell);
        
        if (descToCode.has(normDesc)) {
            const code = descToCode.get(normDesc)!;
            const valCell = getDirectCellValue(row.getCell(3)); // Column C (Value)
            valuesMap[code] = valCell;
        }
    }

    const jsonOutput = BP001Format(
        "INT_FRE_SP_BP001",
        instCode,
        finYear,
        formattedStartDate,
        formattedEndDate,
        valuesMap
    );

    const jsonDir = path.dirname(outputJsonPath);
    if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir, { recursive: true });
    }
    fs.writeFileSync(outputJsonPath, JSON.stringify(jsonOutput, null, 4));

    const excelDir = path.dirname(outputExcelPath);
    if (!fs.existsSync(excelDir)) {
        fs.mkdirSync(excelDir, { recursive: true });
    }
    await workbook.xlsx.writeFile(outputExcelPath);

    return {
        success: true,
        jsonPath: outputJsonPath,
        excelPath: outputExcelPath
    };
}
