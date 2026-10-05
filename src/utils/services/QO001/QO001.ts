import ExcelJS from "exceljs";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { QO001_DESCRIPTIONS, QO001_ROWS_CONFIG, QO001JsonData } from "./jsonFormat";

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

export function processQO001(
    worksheet: ExcelJS.Worksheet,
    options?: { instCode?: string; startDate?: string; endDate?: string }
): QO001JsonData {
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

    const templateDir = path.join(process.cwd(), "templates", "json");
    const jsonTemplatePath = path.join(templateDir, "QO001.json");

    let baseReturnItems: any[] = [];
    try {
        if (fs.existsSync(jsonTemplatePath)) {
            const rawData = fs.readFileSync(jsonTemplatePath, "utf-8");
            const rawJson = JSON.parse(rawData);
            baseReturnItems = rawJson.ReturnItemsList || [];
        }
    } catch (_) {}

    const valuesByCode: Record<string, string> = {};
    let totalFaceVal = 0;
    let totalAmount = 0;
    let totalCreditEqu = 0;
    let hasAnyInput = false;

    let itemCounter = 1;

    QO001_ROWS_CONFIG.forEach((r) => {
        if (r.row === 38) {
            return;
        }

        const rawC = getDirectCellValue(worksheet.getRow(r.row).getCell("C")).trim().replace(/,/g, "");
        const rawD = getDirectCellValue(worksheet.getRow(r.row).getCell("D")).trim().replace(/,/g, "");
        const rawE = getDirectCellValue(worksheet.getRow(r.row).getCell("E")).trim().replace(/,/g, "");
        const rawF = getDirectCellValue(worksheet.getRow(r.row).getCell("F")).trim().replace(/,/g, "");
        const rawG = getDirectCellValue(worksheet.getRow(r.row).getCell("G")).trim().replace(/,/g, "");

        const valC = rawC;
        const numC = valC !== "" ? parseFloat(valC) : NaN;
        if (!isNaN(numC)) {
            totalFaceVal += numC;
            hasAnyInput = true;
        }

        let valD = rawD !== "" ? rawD : (r.defaultFactor !== "" ? r.defaultFactor : "");
        let factorNum = valD !== "" ? parseFloat(valD.replace("%", "")) : NaN;
        if (!isNaN(factorNum) && factorNum > 1) factorNum /= 100;

        let valE = rawE;
        if (valE === "" && !isNaN(numC) && numC > 0 && !isNaN(factorNum)) {
            valE = String(numC * factorNum);
        }
        const numE = valE !== "" ? parseFloat(valE) : NaN;
        if (!isNaN(numE) && !isNaN(numC) && numC > 0) {
            totalAmount += numE;
        }

        let valF = rawF !== "" ? rawF : (r.defaultWeight !== "" ? r.defaultWeight : "");
        let weightNum = valF !== "" ? parseFloat(valF.replace("%", "")) : NaN;
        if (!isNaN(weightNum) && weightNum > 1) weightNum /= 100;

        let valG = rawG;
        if (valG === "" && !isNaN(numE) && !isNaN(weightNum)) {
            valG = String(numE * weightNum);
        }
        const numG = valG !== "" ? parseFloat(valG) : NaN;
        if (!isNaN(numG) && !isNaN(numC) && numC > 0) {
            totalCreditEqu += numG;
        }

        const codeC = `12_${String(itemCounter++).padStart(5, "0")}`;
        const codeD = `12_${String(itemCounter++).padStart(5, "0")}`;
        const codeE = `12_${String(itemCounter++).padStart(5, "0")}`;
        const codeF = `12_${String(itemCounter++).padStart(5, "0")}`;
        const codeG = `12_${String(itemCounter++).padStart(5, "0")}`;

        valuesByCode[codeC] = valC;
        valuesByCode[codeD] = valD;
        valuesByCode[codeE] = valE;
        valuesByCode[codeF] = valF;
        valuesByCode[codeG] = valG;
    });

    // Row 38 Total Row (items 12_00091 to 12_00095)
    const rawC38 = getDirectCellValue(worksheet.getRow(38).getCell("C")).trim().replace(/,/g, "");
    const rawE38 = getDirectCellValue(worksheet.getRow(38).getCell("E")).trim().replace(/,/g, "");
    const rawG38 = getDirectCellValue(worksheet.getRow(38).getCell("G")).trim().replace(/,/g, "");

    valuesByCode["12_00091"] = rawC38 !== "" ? rawC38 : (totalFaceVal > 0 ? String(totalFaceVal) : "");
    valuesByCode["12_00092"] = "";
    valuesByCode["12_00093"] = rawE38 !== "" ? rawE38 : (totalAmount > 0 ? String(totalAmount) : "");
    valuesByCode["12_00094"] = "";
    valuesByCode["12_00095"] = rawG38 !== "" ? rawG38 : (totalCreditEqu > 0 ? String(totalCreditEqu) : "");

    let returnItems: any[] = [];
    if (baseReturnItems.length > 0) {
        returnItems = baseReturnItems.map((itemDef: any) => {
            const rawVal = valuesByCode[itemDef.Code];
            return {
                Code: itemDef.Code,
                Value: rawVal !== undefined && rawVal !== "" ? rawVal : "0",
                _description: itemDef._description,
                _dataType: itemDef._dataType || "NUMERIC"
            };
        });
    } else {
        returnItems = QO001_DESCRIPTIONS.map((itemDef) => {
            const rawVal = valuesByCode[itemDef.code];
            return {
                Code: itemDef.code,
                Value: rawVal !== undefined && rawVal !== "" ? rawVal : "0",
                _description: itemDef.desc,
                _dataType: "NUMERIC"
            };
        });
    }

    return {
        ReturnKey: "CAP_ADQ_OFB_QO001",
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
}

export async function jsonToExcelQO001(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<Buffer> {
    const templatePath = path.join(process.cwd(), "templates", "QO001.xlsx");
    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.readFile(templatePath);
    } catch (_) {}

    let worksheet =
        workbook.getWorksheet("CAP_ADQ_OFB_QO001") ||
        workbook.worksheets.find((ws) => ws.name.toUpperCase().includes("QO001")) ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    if (!worksheet) {
        worksheet = workbook.addWorksheet("CAP_ADQ_OFB_QO001");
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

    QO001_DESCRIPTIONS.forEach((itemDef) => {
        const item = itemMap.get(itemDef.code);
        if (item) {
            const cellRef = `${itemDef.excelCol}${itemDef.excelRow}`;
            if (item.Value !== undefined && item.Value !== "") {
                const numVal = parseFloat(item.Value);
                worksheet.getCell(cellRef).value = isNaN(numVal) ? item.Value : numVal;
            } else if (itemDef.excelCol === "C") {
                worksheet.getCell(cellRef).value = null;
            }
        }
    });

    workbook.calcProperties.fullCalcOnLoad = true;

    if (outputExcelPath) {
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}

export async function processQO001Report(
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
            workbook.getWorksheet("CAP_ADQ_OFB_QO001") ||
            workbook.worksheets.find((ws) => ws.name.toUpperCase().includes("QO001")) ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            throw new Error("Worksheet not found in template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "QO001.json");
        const data = await readFile(filePath, "utf-8");
        const jsonTemplate = JSON.parse(data);

        const extractedData = processQO001(worksheet, {
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

        await jsonToExcelQO001(mergedJson, outputExcelPath);

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath
        };
    } catch (error: any) {
        console.error("Error processing QO001 report:", error);
        return {
            success: false,
            error: error.message || "Failed to process QO001 report."
        };
    }
}
