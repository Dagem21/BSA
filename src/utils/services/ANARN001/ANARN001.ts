import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { ANARN001_DESCRIPTIONS, ANARN001JsonData } from "./jsonFormat";

function formatIsoString(dateVal: any, fallback: string = ""): string {
    if (!dateVal) return fallback;
    if (typeof dateVal === "string") {
        const trimmed = dateVal.trim();
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
            return trimmed.split(".")[0];
        }
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
            return `${trimmed.substring(0, 10)}T00:00:00`;
        }
        if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
            const d = new Date(trimmed);
            if (!isNaN(d.getTime())) {
                const pad = (n: number) => String(n).padStart(2, "0");
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
            }
        }
    }
    if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return fallback;
        const pad = (n: number) => String(n).padStart(2, "0");
        // Check UTC vs local date
        if (dateVal.toISOString().startsWith(`${dateVal.getUTCFullYear()}-${pad(dateVal.getUTCMonth() + 1)}-${pad(dateVal.getUTCDate())}`)) {
            return `${dateVal.getUTCFullYear()}-${pad(dateVal.getUTCMonth() + 1)}-${pad(dateVal.getUTCDate())}T00:00:00`;
        }
        return `${dateVal.getFullYear()}-${pad(dateVal.getMonth() + 1)}-${pad(dateVal.getDate())}T00:00:00`;
    }
    return fallback;
}

export function getDirectCellValue(cell: any): string {
    if (!cell || cell === null || cell === undefined) return "";
    let val = cell;
    if (cell && typeof cell === "object" && "value" in cell) {
        val = cell.value;
    }
    if (val === null || val === undefined) {
        if (cell && typeof cell === "object") {
            try {
                if (cell.result !== undefined && cell.result !== null) {
                    if (typeof cell.result === "object" && "error" in cell.result) return "";
                    return String(cell.result).trim();
                }
            } catch (_) {}
            try {
                if (cell.text !== undefined && cell.text !== null) {
                    return String(cell.text).trim();
                }
            } catch (_) {}
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
    try {
        if (cell.result !== undefined && cell.result !== null) {
            if (typeof cell.result === "object" && "error" in cell.result) return "";
            return String(cell.result).trim();
        }
    } catch (_) {}
    try {
        if (cell.text !== undefined && cell.text !== null) {
            return String(cell.text).trim();
        }
    } catch (_) {}
    return "";
}

function parseNum(v: string): number {
    if (!v) return 0;
    const n = parseFloat(v.replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
}

export function processANARN001(
    worksheet: ExcelJS.Worksheet,
    options?: { instCode?: string; startDate?: string; endDate?: string }
): ANARN001JsonData {
    // 1. Dynamic Start Row Detection (scan Column B for row 16 anchor)
    let startRow = 16;
    for (let r = 10; r <= 30; r++) {
        const textB = getDirectCellValue(worksheet.getRow(r).getCell("B")).toLowerCase();
        if (textB.includes("non-accrual to accrual") || textB.includes("re-categorized")) {
            startRow = r;
            break;
        }
    }

    // 2. Metadata Extraction
    let instCode = options?.instCode;
    if (!instCode && startRow > 8) {
        const c8 = getDirectCellValue(worksheet.getCell("C8"));
        if (c8) instCode = c8;
    }
    if (!instCode) instCode = "0000001";
    if (/^\d+$/.test(instCode)) {
        instCode = instCode.padStart(7, "0");
    }

    const finYearRaw = startRow > 9 ? getDirectCellValue(worksheet.getCell("C9")) : "";
    const finYear = finYearRaw ? (parseInt(finYearRaw, 10) || 2026) : 2026;

    // Check D10 / C10 for Start Date
    const sDateCell = getDirectCellValue(worksheet.getCell("D10")) || getDirectCellValue(worksheet.getCell("C10"));
    const startDate = options?.startDate
        ? formatIsoString(options.startDate)
        : (sDateCell ? formatIsoString(sDateCell, "2026-07-01T00:00:00") : "2026-07-01T00:00:00");

    // Check D11 / C11 for End Date
    const eDateCell = getDirectCellValue(worksheet.getCell("D11")) || getDirectCellValue(worksheet.getCell("C11"));
    const endDate = options?.endDate
        ? formatIsoString(options.endDate)
        : (eDateCell ? formatIsoString(eDateCell, "2026-09-30T00:00:00") : "2026-09-30T00:00:00");

    // 3. Extract Grid Values
    // Row startRow (16): Previous Quarter -> Number (Col C), Amount (Col D)
    let val1 = getDirectCellValue(worksheet.getRow(startRow).getCell("C"));
    let val2 = getDirectCellValue(worksheet.getRow(startRow).getCell("D"));

    // Row startRow + 1 (17): During Quarter -> Number (Col C), Amount (Col D)
    let val3 = getDirectCellValue(worksheet.getRow(startRow + 1).getCell("C"));
    let val4 = getDirectCellValue(worksheet.getRow(startRow + 1).getCell("D"));

    // Row startRow + 2 (18): Total -> Number (Col C), Amount (Col D)
    let val5 = getDirectCellValue(worksheet.getRow(startRow + 2).getCell("C"));
    let val6 = getDirectCellValue(worksheet.getRow(startRow + 2).getCell("D"));

    // Auto-calculate totals if empty
    if (!val5 || val5 === "0") {
        const sumNum = parseNum(val1) + parseNum(val3);
        if (sumNum !== 0) val5 = String(sumNum);
    }
    if (!val6 || val6 === "0") {
        const sumAmt = parseNum(val2) + parseNum(val4);
        if (sumAmt !== 0) val6 = (Math.round(sumAmt * 100) / 100).toFixed(2);
    }

    const valuesByCode: Record<string, string> = {
        "149_00001": val1 || "0",
        "149_00002": val2 || "0",
        "149_00003": val3 || "0",
        "149_00004": val4 || "0",
        "149_00005": val5 || "0",
        "149_00006": val6 || "0"
    };

    const returnItems = ANARN001_DESCRIPTIONS.map((itemDef) => {
        let cellVal = valuesByCode[itemDef.code] || "0";
        if (cellVal === "" || cellVal === "[object Object]") {
            cellVal = "0";
        }

        return {
            Code: itemDef.code,
            Value: cellVal,
            _description: itemDef.desc,
            _dataType: "NUMERIC"
        };
    });

    return {
        ReturnKey: "ANARN001",
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
}

export async function jsonToExcelANARN001(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("ANARN001");

    sheet.views = [{ showGridLines: true }];

    // Column widths matching layout
    sheet.getColumn(1).width = 8;   // S.No.
    sheet.getColumn(2).width = 45;  // Description
    sheet.getColumn(3).width = 28;  // Number*
    sheet.getColumn(4).width = 38;  // Amount

    // Row 1: ReturnKey
    sheet.getCell("A1").value = jsonPayload.ReturnKey || "ANARN001";
    sheet.getCell("A1").font = { name: "Arial", size: 9 };

    // Rows 4-7: Banner Header
    sheet.mergeCells("A4:D7");
    const banner = sheet.getCell("A4");
    banner.value = "Aggregate of Loans And Advances  Re-Categorized from Non-Accrual To Accrual Status";
    banner.font = { name: "Arial", size: 15, bold: true, color: { argb: "FFFF0000" } };
    banner.alignment = { horizontal: "center", vertical: "middle" };

    const pinkFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFCE4D6" }
    };
    const purpleBorderColor = "FF7030A0";
    const thinBorder: ExcelJS.Border = { style: "thin", color: { argb: "FF000000" } };

    for (let r = 4; r <= 7; r++) {
        for (let c = 1; c <= 4; c++) {
            const cell = sheet.getRow(r).getCell(c);
            cell.fill = pinkFill;
            cell.border = {
                top: r === 4 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined,
                bottom: r === 7 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined,
                left: c === 1 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined,
                right: c === 4 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined
            };
        }
    }

    // Metadata Rows 8 to 11
    const metaBorder: Partial<ExcelJS.Borders> = {
        top: thinBorder,
        bottom: thinBorder,
        left: thinBorder,
        right: thinBorder
    };

    sheet.getCell("A8").value = "Instiution Code";
    sheet.getCell("A8").font = { bold: true };
    sheet.getCell("C8").value = jsonPayload.InstCode || "0000001";

    sheet.getCell("A9").value = "Financial Year";
    sheet.getCell("A9").font = { bold: true };
    sheet.getCell("C9").value = jsonPayload.FinYear || 2026;

    sheet.getCell("A10").value = "Start Date";
    sheet.getCell("A10").font = { bold: true };
    const sDateDisplay = jsonPayload.StartDate ? jsonPayload.StartDate.split("T")[0] : "2026-07-01";
    sheet.getCell("D10").value = sDateDisplay;

    sheet.getCell("A11").value = "End Date";
    sheet.getCell("A11").font = { bold: true };
    const eDateDisplay = jsonPayload.EndDate ? jsonPayload.EndDate.split("T")[0] : "2026-09-30";
    sheet.getCell("D11").value = eDateDisplay;

    for (let r = 8; r <= 11; r++) {
        for (let c = 1; c <= 4; c++) {
            sheet.getRow(r).getCell(c).border = metaBorder;
        }
    }

    // Row 13: "Amount in Millions of Birr" in Col D
    const d13 = sheet.getCell("D13");
    d13.value = "Amount in Millions of Birr";
    d13.font = { bold: true, size: 9 };
    d13.alignment = { horizontal: "center", vertical: "middle" };
    d13.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" } // Yellow
    };
    d13.border = metaBorder;

    // Rows 14-15: Table Header
    sheet.mergeCells("A14:A15");
    sheet.getCell("A14").value = "S.No.";
    sheet.getCell("A14").font = { bold: true };
    sheet.getCell("A14").alignment = { horizontal: "center", vertical: "middle" };

    sheet.mergeCells("B14:B15");

    sheet.mergeCells("C14:C15");
    sheet.getCell("C14").value = "Number* of  Loans and\nAdvances Re-Categorized\nfrom Non-Accrual To Accrual\nStatus";
    sheet.getCell("C14").font = { bold: true };
    sheet.getCell("C14").alignment = { horizontal: "center", vertical: "middle", wrapText: true };

    sheet.mergeCells("D14:D15");
    sheet.getCell("D14").value = "Amount of  Loans and Advance Re-\nCategorized from Non-Accrual To Accrual\nStatus";
    sheet.getCell("D14").font = { bold: true };
    sheet.getCell("D14").alignment = { horizontal: "center", vertical: "middle", wrapText: true };

    const redBorder: ExcelJS.Border = { style: "medium", color: { argb: "FFFF0000" } };
    for (let r = 14; r <= 15; r++) {
        for (let c = 1; c <= 4; c++) {
            const cell = sheet.getRow(r).getCell(c);
            cell.border = {
                top: r === 14 ? redBorder : thinBorder,
                left: c === 1 ? redBorder : thinBorder,
                right: c === 4 ? redBorder : thinBorder,
                bottom: thinBorder
            };
        }
    }

    // Lookup items
    const valuesByCode: Record<string, string> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        for (const item of jsonPayload.ReturnItemsList) {
            valuesByCode[item.Code] = item.Value;
        }
    }

    // Row 16: S.No 1
    const r16 = sheet.getRow(16);
    r16.getCell(1).value = 1;
    r16.getCell(1).alignment = { horizontal: "center" };
    r16.getCell(2).value = "Loans and Advance Re-Categorized from Non-Accrual To Accrual Status at the end of the previous quarter";
    r16.getCell(2).alignment = { wrapText: true };
    const num1 = parseNum(valuesByCode["149_00001"]);
    r16.getCell(3).value = num1;
    r16.getCell(3).alignment = { horizontal: "center" };
    const amt1 = parseNum(valuesByCode["149_00002"]);
    r16.getCell(4).value = amt1;
    r16.getCell(4).alignment = { horizontal: "center" };

    // Row 17: S.No 2
    const r17 = sheet.getRow(17);
    r17.getCell(1).value = 2;
    r17.getCell(1).alignment = { horizontal: "center" };
    r17.getCell(2).value = "Loans and Advance Re-Categorized from Non-Accrual To Accrual Status during the quarter";
    r17.getCell(2).alignment = { wrapText: true };
    const num2 = parseNum(valuesByCode["149_00003"]);
    r17.getCell(3).value = num2;
    r17.getCell(3).alignment = { horizontal: "center" };
    const amt2 = parseNum(valuesByCode["149_00004"]);
    r17.getCell(4).value = amt2;
    r17.getCell(4).alignment = { horizontal: "center" };

    // Row 18: Total Row
    const r18 = sheet.getRow(18);
    r18.getCell(1).value = "";
    r18.getCell(2).value = "Total  Loans and Advances Re-Categorized from Non-Accrual To Accrual Status";
    r18.getCell(2).font = { bold: true };
    const numTot = parseNum(valuesByCode["149_00005"]) || (num1 + num2);
    r18.getCell(3).value = numTot;
    r18.getCell(3).font = { bold: true };
    r18.getCell(3).alignment = { horizontal: "center" };
    const amtTot = parseNum(valuesByCode["149_00006"]) || (Math.round((amt1 + amt2) * 100) / 100);
    r18.getCell(4).value = amtTot;
    r18.getCell(4).font = { bold: true };
    r18.getCell(4).alignment = { horizontal: "center" };

    const totalFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" } // Soft light blue fill
    };

    for (let c = 1; c <= 4; c++) {
        r18.getCell(c).fill = totalFill;
    }

    // Grid borders for data rows
    for (let r = 16; r <= 18; r++) {
        for (let c = 1; c <= 4; c++) {
            sheet.getRow(r).getCell(c).border = {
                top: thinBorder,
                bottom: r === 18 ? redBorder : thinBorder,
                left: c === 1 ? redBorder : thinBorder,
                right: c === 4 ? redBorder : thinBorder
            };
        }
    }

    // Row 20: Note
    sheet.getCell("A20").value = "Note:";
    sheet.getCell("A20").font = { bold: true, size: 9 };
    sheet.getCell("B20").value = "*Number is in figures";
    sheet.getCell("B20").font = { bold: true, size: 9 };
    sheet.getCell("A20").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" }
    };
    sheet.getCell("B20").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" }
    };

    if (outputExcelPath) {
        const dir = path.dirname(outputExcelPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    return workbook;
}

export async function processANARN001Report(
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
            workbook.getWorksheet("ANARN001") ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            throw new Error("Worksheet not found in ANARN001 template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "ANARN001.json");
        let jsonTemplate = {};
        if (fs.existsSync(filePath)) {
            const data = await readFile(filePath, "utf-8");
            jsonTemplate = JSON.parse(data);
        }

        const extractedData = processANARN001(worksheet, {
            instCode,
            startDate: startDateStr,
            endDate: endDateStr
        });

        const mergedJson = {
            ...jsonTemplate,
            ...extractedData
        };

        const jsonString = JSON.stringify(mergedJson, null, 4);
        const jsonDir = path.dirname(outputJsonPath);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        await writeFile(outputJsonPath, jsonString, "utf8");

        if (outputExcelPath) {
            await jsonToExcelANARN001(mergedJson, outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath
        };
    } catch (error: any) {
        console.error("Error processing ANARN001 report:", error);
        return {
            success: false,
            error: error.message || "Failed to process ANARN001 report."
        };
    }
}
