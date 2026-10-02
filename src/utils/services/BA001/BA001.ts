import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { BA001_DESCRIPTIONS, BA001JsonData } from "./jsonFormat";

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

export function processBA001(
    worksheet: ExcelJS.Worksheet,
    options?: { instCode?: string; startDate?: string; endDate?: string }
): BA001JsonData {
    let instCode = options?.instCode || getDirectCellValue(worksheet.getRow(8).getCell("C")) || "0000001";
    if (/^\d+$/.test(instCode)) {
        instCode = instCode.padStart(7, "0");
    }

    const finYearRaw = getDirectCellValue(worksheet.getRow(9).getCell("C"));
    const finYear = finYearRaw ? (parseInt(finYearRaw, 10) || 2026) : 2026;

    const startDateRaw = getDirectCellValue(worksheet.getRow(10).getCell("C"));
    const startDate = startDateRaw ? formatIsoString(startDateRaw) : (options?.startDate || "2026-07-01T00:00:00");

    const endDateRaw = getDirectCellValue(worksheet.getRow(11).getCell("C"));
    const endDate = endDateRaw ? formatIsoString(endDateRaw) : (options?.endDate || "2026-09-30T00:00:00");

    const returnItems = BA001_DESCRIPTIONS.map((itemDef) => {
        const rowNum = itemDef.excelRow;
        const cell = worksheet.getRow(rowNum).getCell("C");
        let cellVal = getDirectCellValue(cell);

        // Zero-padding for numeric fields if empty or formula error
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
        ReturnKey: "BRE_INCO_BA001",
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
}

export async function jsonToExcelBA001(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("BRE_INCO_BA001");

    sheet.views = [{ showGridLines: true }];

    // Column widths matching template
    sheet.getColumn(1).width = 12; // Code
    sheet.getColumn(2).width = 65; // Description
    sheet.getColumn(3).width = 22; // Amount

    // Row 1: ReturnKey
    sheet.getCell("A1").value = jsonPayload.ReturnKey || "BRE_INCO_BA001";
    sheet.getCell("A1").font = { name: "Arial", size: 9 };

    // Rows 4-7: Banner Header
    sheet.mergeCells("A4:C7");
    const banner = sheet.getCell("A4");
    banner.value = "Breakdown of Income Accounts";
    banner.font = { name: "Arial", size: 16, bold: true, color: { argb: "FFFF0000" } };
    banner.alignment = { horizontal: "center", vertical: "middle" };

    const pinkFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFCE4D6" }
    };
    const purpleBorderColor = "FF7030A0";

    for (let r = 4; r <= 7; r++) {
        for (let c = 1; c <= 3; c++) {
            const cell = sheet.getRow(r).getCell(c);
            cell.fill = pinkFill;
            cell.border = {
                top: r === 4 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined,
                bottom: r === 7 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined,
                left: c === 1 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined,
                right: c === 3 ? { style: "medium", color: { argb: purpleBorderColor } } : undefined
            };
        }
    }

    // Rows 8-11: Institutional Metadata Block
    const metaPeachLight: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFCE4D6" }
    };
    const metaPeachDark: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8CBAD" }
    };
    const greenBorderColor = "FF548235";
    const thinBorderItem: ExcelJS.Border = { style: "thin", color: { argb: "FF000000" } };
    const thinBorders: Partial<ExcelJS.Borders> = {
        top: thinBorderItem,
        bottom: thinBorderItem,
        left: thinBorderItem,
        right: thinBorderItem
    };

    const cleanDate = (iso: string) => (iso ? iso.split("T")[0] : "");

    const metaInfo = [
        { label: "Instiution code", val: jsonPayload.InstCode ? String(jsonPayload.InstCode).padStart(7, "0") : "0000001" },
        { label: "Financial Year", val: jsonPayload.FinYear || 2026 },
        { label: "Start Date", val: cleanDate(jsonPayload.StartDate) || "2026-07-01" },
        { label: "End Date", val: cleanDate(jsonPayload.EndDate) || "2026-09-30" }
    ];

    metaInfo.forEach((m, idx) => {
        const r = 8 + idx;
        sheet.mergeCells(`A${r}:B${r}`);
        const labelCell = sheet.getCell(`A${r}`);
        labelCell.value = m.label;
        labelCell.font = { name: "Arial", size: 10, bold: true };
        labelCell.alignment = { vertical: "middle", horizontal: "left" };
        labelCell.fill = metaPeachLight;

        const valCell = sheet.getCell(`C${r}`);
        valCell.value = m.val;
        valCell.font = { name: "Arial", size: 10 };
        valCell.alignment = { vertical: "middle", horizontal: "right" };
        valCell.fill = metaPeachDark;

        sheet.getRow(r).getCell(1).border = thinBorders;
        sheet.getRow(r).getCell(2).border = thinBorders;
        sheet.getRow(r).getCell(3).border = thinBorders;
    });

    for (let r = 8; r <= 11; r++) {
        for (let c = 1; c <= 3; c++) {
            const cell = sheet.getRow(r).getCell(c);
            cell.border = {
                top: r === 8 ? { style: "medium", color: { argb: greenBorderColor } } : thinBorderItem,
                bottom: r === 11 ? { style: "medium", color: { argb: greenBorderColor } } : thinBorderItem,
                left: c === 1 ? { style: "medium", color: { argb: greenBorderColor } } : thinBorderItem,
                right: c === 3 ? { style: "medium", color: { argb: greenBorderColor } } : thinBorderItem
            };
        }
    }

    // Row 13: "In Millions of Birr"
    const unitCell = sheet.getCell("C13");
    unitCell.value = "In Millions of Birr";
    unitCell.font = { name: "Arial", size: 10, bold: true };
    unitCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" }
    };
    unitCell.alignment = { horizontal: "center", vertical: "middle" };
    unitCell.border = thinBorders;

    // Row 14: Table Headers
    const headerFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" }
    };

    const headers = [
        { col: "A", text: "Code" },
        { col: "B", text: "Description" },
        { col: "C", text: "Amount" }
    ];

    headers.forEach((h) => {
        const cell = sheet.getCell(`${h.col}14`);
        cell.value = h.text;
        cell.font = { name: "Arial", size: 11, bold: true };
        cell.fill = headerFill;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = thinBorders;
    });

    // Populate Data Items
    const items = jsonPayload.ReturnItemsList || [];
    const itemMap = new Map<string, any>();
    items.forEach((item: any) => {
        if (item && item.Code) {
            itemMap.set(item.Code.trim(), item);
        }
    });

    // Subtotal rows in BA001 that should be bolded
    const boldRows = [15, 16, 17, 27, 31, 40, 42, 49];

    BA001_DESCRIPTIONS.forEach((itemDef) => {
        const r = itemDef.excelRow;
        const row = sheet.getRow(r);
        const isBold = boldRows.includes(r);

        // Code column (A)
        const cellA = row.getCell("A");
        cellA.value = itemDef.excelCode;
        cellA.alignment = { horizontal: "center", vertical: "middle" };
        cellA.font = { name: "Arial", size: 10, bold: isBold };
        cellA.border = thinBorders;

        // Description column (B)
        const cellB = row.getCell("B");
        cellB.value = itemDef.desc;
        cellB.alignment = { horizontal: "left", vertical: "middle" };
        cellB.font = { name: "Arial", size: 10, bold: isBold };
        cellB.border = thinBorders;

        // Amount column (C)
        const cellC = row.getCell("C");
        const found = itemMap.get(itemDef.code);
        let valStr = found ? found.Value : "";
        if (valStr === "" || valStr === undefined || valStr === null) {
            cellC.value = "";
        } else {
            const num = parseFloat(String(valStr).replace(/,/g, ""));
            cellC.value = isNaN(num) ? valStr : num;
        }

        cellC.alignment = { horizontal: "right", vertical: "middle" };
        cellC.font = { name: "Arial", size: 10, bold: isBold };
        cellC.numFmt = "#,##0.00";
        cellC.border = thinBorders;

        // Special highlight for Total Row 49
        if (r === 49) {
            cellC.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFEB9C" }
            };
        }
    });

    // Enclosing Red Border around table A14:C49
    const redBorder = { style: "medium" as const, color: { argb: "FFFF0000" } };
    for (let r = 14; r <= 49; r++) {
        for (let c = 1; c <= 3; c++) {
            const cell = sheet.getRow(r).getCell(c);
            const currentBorder = cell.border || thinBorders;
            cell.border = {
                ...currentBorder,
                top: r === 14 ? redBorder : (currentBorder.top || thinBorderItem),
                bottom: r === 49 ? redBorder : (currentBorder.bottom || thinBorderItem),
                left: c === 1 ? redBorder : (currentBorder.left || thinBorderItem),
                right: c === 3 ? redBorder : (currentBorder.right || thinBorderItem)
            };
        }
    }

    workbook.calcProperties.fullCalcOnLoad = true;

    if (outputExcelPath) {
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    return workbook;
}

export async function processBA001Report(
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
            workbook.getWorksheet("BRE_INCO_BA001") ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            throw new Error("Worksheet not found in BA001 template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "BA001.json");
        const data = await readFile(filePath, "utf-8");
        const jsonTemplate = JSON.parse(data);

        const extractedData = processBA001(worksheet, {
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

        await jsonToExcelBA001(mergedJson, outputExcelPath);

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath
        };
    } catch (error: any) {
        console.error("Error processing BA001 report:", error);
        return {
            success: false,
            error: error.message || "Failed to process BA001 report."
        };
    }
}
