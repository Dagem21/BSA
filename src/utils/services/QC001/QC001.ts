import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { QC001_DESCRIPTIONS, QC001JsonData } from "./jsonFormat";

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
    return "";
}

const ROW_BY_CODE: Record<string, number> = {
    "13_00001": 15,
    "13_00002": 16,
    "13_00003": 17,
    "13_00004": 19,
    "13_00005": 20,
    "13_00006": 21,
    "13_00007": 22,
    "13_00008": 23,
    "13_00009": 24,
    "13_00010": 25,
    "13_00011": 26,
    "13_00012": 27,
    "13_00013": 18
};

export function processQC001(
    worksheet: ExcelJS.Worksheet,
    options?: { instCode?: string; startDate?: string; endDate?: string }
): QC001JsonData {
    let instCode = options?.instCode || getDirectCellValue(worksheet.getRow(8).getCell("C")) || "0000001";
    if (/^\d+$/.test(instCode)) {
        instCode = instCode.padStart(7, "0");
    }

    const finYearRaw = getDirectCellValue(worksheet.getRow(9).getCell("C"));
    const finYear = finYearRaw ? (parseInt(finYearRaw, 10) || 2026) : 2026;

    const startDateRaw = getDirectCellValue(worksheet.getRow(10).getCell("C"));
    const startDate = startDateRaw ? formatIsoString(startDateRaw) : (options?.startDate || "2026-04-01T00:00:00");

    const endDateRaw = getDirectCellValue(worksheet.getRow(11).getCell("C"));
    const endDate = endDateRaw ? formatIsoString(endDateRaw) : (options?.endDate || "2026-06-30T00:00:00");

    const returnItems = QC001_DESCRIPTIONS.map((itemDef) => {
        const rowNum = itemDef.excelRow;
        const cellVal = getDirectCellValue(worksheet.getRow(rowNum).getCell("C"));
        return {
            Code: itemDef.code,
            Value: cellVal,
            _description: itemDef.desc,
            _dataType: "NUMERIC",
            _required: false
        };
    });

    return {
        ReturnKey: "CAP_ADQ_CAP_QC001",
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
}

export async function jsonToExcelQC001(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<Buffer> {
    const templatePath = path.join(process.cwd(), "templates", "QC001.xlsx");
    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.readFile(templatePath);
    } catch (_) {
        // If template file reading fails, fallback to creating fresh sheet
    }

    let worksheet =
        workbook.getWorksheet("CAP_ADQ_CAP_QC001") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    if (!worksheet) {
        worksheet = workbook.addWorksheet("CAP_ADQ_CAP_QC001");
    }

    if (jsonPayload.InstCode) {
        worksheet.getCell("C8").value = jsonPayload.InstCode;
    }
    if (jsonPayload.FinYear) {
        worksheet.getCell("C9").value = jsonPayload.FinYear;
    }
    if (jsonPayload.StartDate) {
        worksheet.getCell("C10").value = jsonPayload.StartDate;
    }
    if (jsonPayload.EndDate) {
        worksheet.getCell("C11").value = jsonPayload.EndDate;
    }

    const items = jsonPayload.ReturnItemsList || [];
    const itemMap = new Map<string, any>();
    items.forEach((item: any) => {
        itemMap.set(item.Code, item);
    });

    // Write values to non-formula input cells
    const formulaRows = [15, 16, 22, 26, 27];

    QC001_DESCRIPTIONS.forEach((itemDef) => {
        const rowNum = itemDef.excelRow;
        if (formulaRows.includes(rowNum)) return;

        const item = itemMap.get(itemDef.code);
        if (item && item.Value !== undefined && item.Value !== "") {
            const numVal = parseFloat(item.Value);
            worksheet.getCell(`C${rowNum}`).value = isNaN(numVal) ? item.Value : numVal;
        }
    });

    workbook.calcProperties.fullCalcOnLoad = true;

    if (outputExcelPath) {
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}

export async function processQC001Report(
    instCode: string,
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    try {
        if (!inputFilePath) {
            return { success: false, error: "No input file provided." };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);

        const worksheet =
            workbook.getWorksheet("CAP_ADQ_CAP_QC001") ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            throw new Error("Worksheet not found in template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "QC001.json");
        const data = await readFile(filePath, "utf-8");
        const jsonTemplate = JSON.parse(data);

        const extractedData = processQC001(worksheet, {
            instCode,
            startDate: startDateStr,
            endDate: endDateStr
        });

        const mergedJson = {
            ...jsonTemplate,
            ...extractedData
        };

        const jsonString = JSON.stringify(mergedJson, null, 4);
        await writeFile(outputJsonPath, jsonString, "utf8");

        await jsonToExcelQC001(mergedJson, outputExcelPath);

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath
        };
    } catch (error: any) {
        console.error("Error processing QC001 report:", error);
        return {
            success: false,
            error: error.message || "Failed to process QC001 report."
        };
    }
}
