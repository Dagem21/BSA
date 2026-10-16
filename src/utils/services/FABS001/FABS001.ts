import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { FABS001Format } from "./jsonFormat";

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

function buildRowToCodeMap(): Map<number, string> {
    const map = new Map<number, string>();
    let codeIndex = 1;
    for (let r = 16; r <= 180; r++) {
        if (r === 103 || r === 175) continue; // skip heading / note rows
        const itemCode = `FABS001_${codeIndex.toString().padStart(5, "0")}`;
        map.set(r, itemCode);
        codeIndex++;
    }
    return map;
}

const rowToCodeMap = buildRowToCodeMap();

export function processFABS001(worksheet: ExcelJS.Worksheet): any {
    const json = JSON.parse(JSON.stringify(FABS001Format));

    json.InstCode = getDirectCellValue(worksheet.getRow(7).getCell("C")).padStart(7, "0") || "0000001";
    json.FinYear = parseInt(getDirectCellValue(worksheet.getRow(8).getCell("C")), 10) || 2026;
    json.StartDate = getDirectCellValue(worksheet.getRow(9).getCell("C")) || "2026-09-01T00:00:00";
    json.EndDate = getDirectCellValue(worksheet.getRow(10).getCell("C")) || "2026-09-30T00:00:00";

    rowToCodeMap.forEach((code, rowNum) => {
        const val = getDirectCellValue(worksheet.getRow(rowNum).getCell("C"));
        const itemIndex = json.ReturnItemsList.findIndex((item: any) => item.Code === code);
        if (itemIndex !== -1) {
            const cleanVal = (val !== null && val !== undefined) ? String(val).trim() : "";
            json.ReturnItemsList[itemIndex].Value = (cleanVal !== "" && cleanVal !== "[object Object]") ? cleanVal : "0";
        }
    });

    if (Array.isArray(json.ReturnItemsList)) {
        json.ReturnItemsList = json.ReturnItemsList.map((item: any) => ({
            ...item,
            Value: (item.Value !== undefined && item.Value !== null && String(item.Value).trim() !== "") ? String(item.Value).trim() : "0"
        }));
    }

    return json;
}

export async function processFABS001Report(
    instCode: string,
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    try {
        if (!inputFilePath) {
            return { success: false };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new Error("No valid sheet found in uploaded FABS001 file.");
        }

        const json = processFABS001(worksheet);

        if (instCode) json.InstCode = instCode.padStart(7, "0");
        if (startDateStr) json.StartDate = startDateStr;
        if (endDateStr) json.EndDate = endDateStr;

        const jsonString = JSON.stringify(json, null, 2);
        await writeFile(outputJsonPath, jsonString, "utf8");

        await toExcel(outputJsonPath, outputExcelPath);

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath
        };
    } catch (error) {
        throw error;
    }
}

async function toExcel(jsonFileName: string, outputExcelPath: string) {
    try {
        if (!jsonFileName) {
            return { success: false };
        }

        const templateDir = path.join(process.cwd(), "templates");
        const filePath = path.join(templateDir, "FABS001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new Error("Sheet not found in FABS001 template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C7").value = json.InstCode;
        worksheet.getCell("C8").value = json.FinYear;
        worksheet.getCell("C9").value = json.StartDate;
        worksheet.getCell("C10").value = json.EndDate;

        // Skip writing formula rows in Excel to preserve calculation logic
        const formulas = [
            16, 17, 20, 21, 23, 26, 29, 32, 33, 38, 39, 43, 49, 50, 56, 57,
            58, 59, 63, 73, 76, 80, 83, 87, 88, 89, 98, 102, 104, 105, 106,
            121, 125, 132, 140, 141, 142, 146, 150, 154, 162, 166, 173, 174
        ];

        const itemMap = new Map<string, string>();
        if (Array.isArray(json?.ReturnItemsList)) {
            json.ReturnItemsList.forEach((item: any) => {
                if (item?.Code) {
                    itemMap.set(item.Code.trim(), item.Value);
                }
            });
        }

        rowToCodeMap.forEach((code, rowNum) => {
            if (formulas.includes(rowNum)) return;
            const valStr = itemMap.get(code);
            if (valStr !== undefined && valStr !== null) {
                const numVal = parseFloat(valStr);
                worksheet.getCell(`C${rowNum}`).value = isNaN(numVal) ? valStr : numVal;
            }
        });

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
