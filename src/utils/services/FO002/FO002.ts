import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import {
    FO002_RETURN_ITEMS_DEF,
    FO002_DYNAMIC_ITEMS_DEF,
    FO002JsonData,
    FO002ReturnItem,
    FO002DynamicEntry,
    buildFO002EmptyDynamicRow
} from "./jsonFormat";

export function getDirectCellValue(cell: any): string {
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

function parseNum(val: any): number {
    if (val === null || val === undefined) return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    const str = getDirectCellValue(val).replace(/,/g, "").trim();
    if (!str || str === "-" || str === "[object Object]") return 0;
    const n = parseFloat(str);
    return isNaN(n) ? 0 : n;
}

function formatDateISO(val: any, fallback: string): string {
    if (!val) return fallback;
    if (val instanceof Date) {
        if (isNaN(val.getTime())) return fallback;
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T00:00:00`;
    }
    if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
            const d = new Date(trimmed);
            if (!isNaN(d.getTime())) {
                const pad = (n: number) => n.toString().padStart(2, "0");
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
            }
        }
        if (trimmed.includes("T")) return trimmed.split(".")[0];
        if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
            return `${trimmed.substring(0, 10)}T00:00:00`;
        }
        return fallback;
    }
    return fallback;
}

export function processFO002(
    worksheet: ExcelJS.Worksheet,
    instCode?: string,
    startDate?: string,
    endDate?: string
): FO002JsonData {
    // 1. Metadata extraction from B8:C11 or fallback
    const cellC8 = getDirectCellValue(worksheet.getCell("C8"));
    const cellB8 = getDirectCellValue(worksheet.getCell("B8"));
    const parsedInstCode = (cellC8 && cellC8 !== "Institution Code" && cellC8 !== "Instiution Code")
        ? cellC8
        : (instCode || "0000001");

    const cellC9 = getDirectCellValue(worksheet.getCell("C9"));
    const finYear = cellC9 ? parseInt(cellC9, 10) || 2026 : 2026;

    const sDateRaw = worksheet.getCell("C10").value;
    const eDateRaw = worksheet.getCell("C11").value;

    const formattedStartDate = formatDateISO(startDate || sDateRaw, "2026-07-01T00:00:00");
    const formattedEndDate = formatDateISO(endDate || eDateRaw, "2026-09-30T00:00:00");

    // 2. Parse Dynamic Items (Area 193: fraud_outstanding) starting at Row 17
    const dynamicEntries: FO002DynamicEntry[] = [];

    let sumPrevNum = 0;
    let sumPrevAmt = 0;
    let sumNewNum = 0;
    let sumNewAmt = 0;
    let sumRecNum = 0;
    let sumRecAmt = 0;
    let sumOutNum = 0;
    let sumOutAmt = 0;
    let sumWrittenOff = 0;
    let sumProvisionHeld = 0;

    const maxScanRow = Math.min(worksheet.rowCount || 66, 317);

    for (let r = 17; r <= maxScanRow; r++) {
        const row = worksheet.getRow(r);
        const col1Val = getDirectCellValue(row.getCell(1)).trim();
        const col2Val = getDirectCellValue(row.getCell(2)).trim();

        // Stop if notes section reached
        if (col1Val.toLowerCase().startsWith("note") || col2Val.toLowerCase().startsWith("note")) {
            break;
        }

        const category = col2Val;
        const typeOfFraud = getDirectCellValue(row.getCell(3)).trim();

        const prevNumRaw = getDirectCellValue(row.getCell(4)).replace(/,/g, "").trim();
        const prevAmtRaw = getDirectCellValue(row.getCell(5)).replace(/,/g, "").trim();
        const newNumRaw = getDirectCellValue(row.getCell(6)).replace(/,/g, "").trim();
        const newAmtRaw = getDirectCellValue(row.getCell(7)).replace(/,/g, "").trim();
        const recNumRaw = getDirectCellValue(row.getCell(8)).replace(/,/g, "").trim();
        const recAmtRaw = getDirectCellValue(row.getCell(9)).replace(/,/g, "").trim();
        const outNumRaw = getDirectCellValue(row.getCell(10)).replace(/,/g, "").trim();
        const outAmtRaw = getDirectCellValue(row.getCell(11)).replace(/,/g, "").trim();
        const writtenOffRaw = getDirectCellValue(row.getCell(12)).replace(/,/g, "").trim();
        const provisionHeldRaw = getDirectCellValue(row.getCell(13)).replace(/,/g, "").trim();

        const nPrevNum = parseNum(row.getCell(4).value);
        const nPrevAmt = parseNum(row.getCell(5).value);
        const nNewNum = parseNum(row.getCell(6).value);
        const nNewAmt = parseNum(row.getCell(7).value);
        const nRecNum = parseNum(row.getCell(8).value);
        const nRecAmt = parseNum(row.getCell(9).value);
        const nWrittenOff = parseNum(row.getCell(12).value);
        const nProvisionHeld = parseNum(row.getCell(13).value);

        // Check if row has any entered fraud data
        const hasData = Boolean(
            category ||
            typeOfFraud ||
            (prevNumRaw && prevNumRaw !== "0") ||
            (prevAmtRaw && prevAmtRaw !== "0") ||
            (newNumRaw && newNumRaw !== "0") ||
            (newAmtRaw && newAmtRaw !== "0") ||
            (recNumRaw && recNumRaw !== "0") ||
            (recAmtRaw && recAmtRaw !== "0") ||
            (writtenOffRaw && writtenOffRaw !== "0") ||
            (provisionHeldRaw && provisionHeldRaw !== "0")
        );

        if (!hasData) {
            // Skip empty template row
            continue;
        }

        const codeVal = col1Val || String(dynamicEntries.length + 1);

        // Calculated fields for J (Number: A+C-E) and K (Amount: B+D-F)
        let finalOutNumStr = outNumRaw;
        if (!finalOutNumStr || finalOutNumStr === "0" || finalOutNumStr === "-") {
            const computedNum = nPrevNum + nNewNum - nRecNum;
            finalOutNumStr = String(computedNum);
        }
        const nOutNum = parseNum(finalOutNumStr);

        let finalOutAmtStr = outAmtRaw;
        if (!finalOutAmtStr || finalOutAmtStr === "0" || finalOutAmtStr === "-") {
            const computedAmt = nPrevAmt + nNewAmt - nRecAmt;
            finalOutAmtStr = computedAmt.toFixed(2);
        }
        const nOutAmt = parseNum(finalOutAmtStr);

        // Accumulate sums
        sumPrevNum += nPrevNum;
        sumPrevAmt += nPrevAmt;
        sumNewNum += nNewNum;
        sumNewAmt += nNewAmt;
        sumRecNum += nRecNum;
        sumRecAmt += nRecAmt;
        sumOutNum += nOutNum;
        sumOutAmt += nOutAmt;
        sumWrittenOff += nWrittenOff;
        sumProvisionHeld += nProvisionHeld;

        // Zero-pad numeric values
        const fmtNum = (valStr: string) => {
            if (!valStr || valStr === "-" || valStr === "[object Object]") return "0";
            return valStr;
        };

        const dynamicEntry: FO002DynamicEntry = {
            Area: 193,
            _areaName: "fraud_outstanding",
            DynamicItems: [
                { Code: "1.1", Value: codeVal, _description: "Code", _dataType: "NUMERIC", _required: true },
                { Code: "1.2", Value: category, _description: "Category", _dataType: "TEXT", _required: false },
                { Code: "1.3", Value: typeOfFraud, _description: "Type of Fraud", _dataType: "TEXT", _required: false },
                { Code: "1.4", Value: fmtNum(prevNumRaw), _description: "Fraud cases outstanding as of  the end of the previous quarter_Number( A", _dataType: "NUMERIC", _required: false },
                { Code: "1.5", Value: fmtNum(prevAmtRaw), _description: "Fraud cases outstanding as of  the end of the previous quarter_Amount (B)", _dataType: "NUMERIC", _required: false },
                { Code: "1.6", Value: fmtNum(newNumRaw), _description: "New fraud cases reported during the current quarter_Number  (C)", _dataType: "NUMERIC", _required: false },
                { Code: "1.7", Value: fmtNum(newAmtRaw), _description: "New fraud cases reported during the current quarter_Amount (D", _dataType: "NUMERIC", _required: false },
                { Code: "1.8", Value: fmtNum(recNumRaw), _description: "Fraud amount recovered during the current quarter_Number (E", _dataType: "NUMERIC", _required: false },
                { Code: "1.9", Value: fmtNum(recAmtRaw), _description: "Fraud amount recovered during the current quarter_Amount (F) ", _dataType: "NUMERIC", _required: false },
                { Code: "1.10", Value: fmtNum(finalOutNumStr), _description: "Fraud  outstanding at the end of the current quarter_Number  (G=A+C-E)", _dataType: "NUMERIC", _required: false },
                { Code: "1.11", Value: fmtNum(finalOutAmtStr), _description: "Fraud  outstanding at the end of the current quarter_Amount (H=B+D-F)", _dataType: "NUMERIC", _required: false },
                { Code: "1.12", Value: fmtNum(writtenOffRaw), _description: "Fraud amount written off during the current quarter (I)", _dataType: "NUMERIC", _required: false },
                { Code: "1.13", Value: fmtNum(provisionHeldRaw), _description: "Provision held for  fraud  outstanding as of end of current quaterer (J)", _dataType: "NUMERIC", _required: false }
            ]
        };

        dynamicEntries.push(dynamicEntry);
    }

    // Fallback: If no dynamic rows had data, return 1 empty row matching template
    if (dynamicEntries.length === 0) {
        dynamicEntries.push(buildFO002EmptyDynamicRow("1"));
    }

    // 3. Row 16 Total row mapping for ReturnItemsList
    const totalRow = worksheet.getRow(16);

    const getRow16Val = (colIdx: number, calculatedFallback: number): string => {
        const cell = totalRow.getCell(colIdx);
        const cellStr = getDirectCellValue(cell).replace(/,/g, "").trim();
        if (cellStr && cellStr !== "-" && cellStr !== "[object Object]" && cellStr !== "0") {
            return cellStr;
        }
        if (calculatedFallback !== 0) {
            return Number.isInteger(calculatedFallback) ? String(calculatedFallback) : calculatedFallback.toFixed(2);
        }
        return cellStr || "0";
    };

    const calculatedTotals: Record<string, number> = {
        "117_00001": sumPrevNum,
        "117_00002": sumPrevAmt,
        "117_00003": sumNewNum,
        "117_00004": sumNewAmt,
        "117_00005": sumRecNum,
        "117_00006": sumRecAmt,
        "117_00007": sumOutNum || (sumPrevNum + sumNewNum - sumRecNum),
        "117_00008": sumWrittenOff,
        "117_00009": sumProvisionHeld,
        "117_00010": sumOutAmt || (sumPrevAmt + sumNewAmt - sumRecAmt)
    };

    const returnItems: FO002ReturnItem[] = FO002_RETURN_ITEMS_DEF.map((def) => {
        const fallback = calculatedTotals[def.code] || 0;
        const val = getRow16Val(def.colIndex, fallback);
        return {
            Code: def.code,
            Value: val === "" ? "0" : val,
            _description: def.desc,
            _dataType: def.dataType,
            _required: false
        };
    });

    return {
        ReturnKey: "FRA_OUT_FO002",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: dynamicEntries
    };
}

export async function jsonToExcelFO002(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("FRA_OUT_FO002");

    sheet.views = [{ showGridLines: true }];

    // Column widths
    sheet.getColumn(1).width = 8;   // A: Code
    sheet.getColumn(2).width = 16;  // B: Category
    sheet.getColumn(3).width = 22;  // C: Type of Fraud
    sheet.getColumn(4).width = 14;  // D: Number (A)
    sheet.getColumn(5).width = 22;  // E: Amount (B)
    sheet.getColumn(6).width = 14;  // F: Number (C)
    sheet.getColumn(7).width = 22;  // G: Amount (D)
    sheet.getColumn(8).width = 14;  // H: Number (E)
    sheet.getColumn(9).width = 22;  // I: Amount (F)
    sheet.getColumn(10).width = 16; // J: Number (G=A+C-E)
    sheet.getColumn(11).width = 22; // K: Amount (H=B+D-F)
    sheet.getColumn(12).width = 18; // L: Written off (I)
    sheet.getColumn(13).width = 24; // M: Provision held (J)

    // Row 1: ReturnKey
    sheet.getCell("A1").value = jsonPayload.ReturnKey || "FRA_OUT_FO002";
    sheet.getCell("A1").font = { name: "Arial", size: 9 };

    // Rows 4-7: Merged Banner B4:K7
    sheet.mergeCells("B4:K7");
    const banner = sheet.getCell("B4");
    banner.value = "Quarterly Summary Report on Fraud Outstanding";
    banner.font = { name: "Arial", size: 16, bold: true, color: { argb: "FFFF0000" } };
    banner.alignment = { horizontal: "center", vertical: "middle" };

    const peachFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFCE4D6" }
    };

    for (let r = 4; r <= 7; r++) {
        for (let c = 2; c <= 11; c++) {
            sheet.getCell(r, c).fill = peachFill;
        }
    }

    // Purple outline around B4:K7
    const purpleBorder: Partial<ExcelJS.Border> = {
        style: "medium",
        color: { argb: "FF7030A0" }
    };

    for (let c = 2; c <= 11; c++) {
        sheet.getCell(4, c).border = { ...sheet.getCell(4, c).border, top: purpleBorder };
        sheet.getCell(7, c).border = { ...sheet.getCell(7, c).border, bottom: purpleBorder };
    }
    for (let r = 4; r <= 7; r++) {
        sheet.getCell(r, 2).border = { ...sheet.getCell(r, 2).border, left: purpleBorder };
        sheet.getCell(r, 11).border = { ...sheet.getCell(r, 11).border, right: purpleBorder };
    }

    // Metadata Rows 8 to 11
    const metaFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE2EFDA" }
    };
    const metaBorder: Partial<ExcelJS.Borders> = {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
    };

    const cleanDate = (isoStr: string) => isoStr ? isoStr.split("T")[0] : "";

    const metaItems = [
        { label: "Institution Code", val: jsonPayload.InstCode || "0000001", row: 8 },
        { label: "FinYear", val: jsonPayload.FinYear || 2026, row: 9 },
        { label: "StartDate", val: cleanDate(jsonPayload.StartDate) || "2026-07-01", row: 10 },
        { label: "EndDate", val: cleanDate(jsonPayload.EndDate) || "2026-09-30", row: 11 }
    ];

    metaItems.forEach((m) => {
        const cellA = sheet.getCell(`A${m.row}`);
        const cellB = sheet.getCell(`B${m.row}`);
        const cellC = sheet.getCell(`C${m.row}`);

        cellA.value = m.label;
        cellA.font = { name: "Arial", size: 10, bold: true };
        cellA.fill = metaFill;
        cellA.border = metaBorder;

        cellB.value = m.label;
        cellB.font = { name: "Arial", size: 10, bold: true };
        cellB.fill = metaFill;
        cellB.border = metaBorder;

        cellC.value = m.val;
        cellC.font = { name: "Arial", size: 10, bold: true };
        cellC.alignment = { horizontal: "center" };
        cellC.fill = metaFill;
        cellC.border = metaBorder;
    });

    // Row 13: Yellow unit / empty highlight block at L13:M13
    sheet.mergeCells("L13:M13");
    const cellL13 = sheet.getCell("L13");
    cellL13.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" }
    };
    sheet.getCell("M13").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" }
    };

    // Table Header Rows 14 & 15 (Blue fill #BDD7EE)
    const headerFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFBDD7EE" }
    };
    const headerFont: Partial<ExcelJS.Font> = {
        name: "Arial",
        size: 9.5,
        bold: true,
        color: { argb: "FF000000" }
    };
    const thinBorder: Partial<ExcelJS.Borders> = {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
    };

    // Set row heights
    sheet.getRow(14).height = 36;
    sheet.getRow(15).height = 28;

    // Apply fill and borders to all header cells
    for (let r = 14; r <= 15; r++) {
        for (let c = 1; c <= 13; c++) {
            const cell = sheet.getCell(r, c);
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.border = thinBorder;
        }
    }

    // Merge and set text for header cells
    sheet.mergeCells("A14:A15");
    sheet.getCell("A14").value = "Code";

    sheet.mergeCells("B14:B15");
    sheet.getCell("B14").value = "Category";

    sheet.mergeCells("C14:C15");
    sheet.getCell("C14").value = "Type of Fraud";

    sheet.mergeCells("D14:E14");
    sheet.getCell("D14").value = "Fraud cases outstanding as of the end of the previous quarter";
    sheet.getCell("D15").value = "Number\n(A)";
    sheet.getCell("E15").value = "Amount\n(B)";

    sheet.mergeCells("F14:G14");
    sheet.getCell("F14").value = "New fraud cases reported during the current quarter";
    sheet.getCell("F15").value = "Number\n(C)";
    sheet.getCell("G15").value = "Amount\n(D)";

    sheet.mergeCells("H14:I14");
    sheet.getCell("H14").value = "Fraud amount recovered during the current quarter";
    sheet.getCell("H15").value = "Number\n(E)";
    sheet.getCell("I15").value = "Amount\n(F)";

    sheet.mergeCells("J14:K14");
    sheet.getCell("J14").value = "Fraud outstanding at the end of the current quarter";
    sheet.getCell("J15").value = "Number\n(G=A+C-E)";
    sheet.getCell("K15").value = "Amount (H=B+D-F)";

    sheet.mergeCells("L14:L15");
    sheet.getCell("L14").value = "Fraud amount written off during the current quarter (I)";

    sheet.mergeCells("M14:M15");
    sheet.getCell("M14").value = "Provision held for fraud outstanding as of end of current quaterer (J)";

    // Prepare dynamic items data
    const dynamicList = Array.isArray(jsonPayload.DynamicItemsList) ? jsonPayload.DynamicItemsList : [];
    const numRows = Math.max(50, dynamicList.length);
    const startDataRow = 17;
    const endDataRow = startDataRow + numRows - 1;

    // Row 16: Total Row
    sheet.getRow(16).height = 22;
    for (let c = 1; c <= 13; c++) {
        const cell = sheet.getCell(16, c);
        cell.font = { name: "Arial", size: 10, bold: true };
        cell.border = thinBorder;
    }

    sheet.getCell("C16").value = "Total";
    sheet.getCell("C16").alignment = { horizontal: "right", vertical: "middle" };

    // Return items values map if available
    const returnItemsMap: Record<string, string> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach((it: any) => {
            if (it && it.Code) returnItemsMap[it.Code] = it.Value;
        });
    }

    const setTotalFormula = (colLetter: string, isInt: boolean, code?: string) => {
        const cell = sheet.getCell(`${colLetter}16`);
        const formula = `SUM(${colLetter}${startDataRow}:${colLetter}${endDataRow})`;
        const cachedVal = code && returnItemsMap[code] ? parseNum(returnItemsMap[code]) : undefined;
        cell.value = cachedVal !== undefined ? { formula, result: cachedVal } : { formula };
        cell.numFmt = isInt ? "#,##0" : "#,##0.00";
        cell.alignment = { horizontal: "right", vertical: "middle" };
    };

    setTotalFormula("D", true, "117_00001");
    setTotalFormula("E", false, "117_00002");
    setTotalFormula("F", true, "117_00003");
    setTotalFormula("G", false, "117_00004");
    setTotalFormula("H", true, "117_00005");
    setTotalFormula("I", false, "117_00006");

    // Total J: D16+F16-H16 (Number G=A+C-E)
    const cachedJ = returnItemsMap["117_00007"] ? parseNum(returnItemsMap["117_00007"]) : undefined;
    const cellJ16 = sheet.getCell("J16");
    cellJ16.value = cachedJ !== undefined ? { formula: "D16+F16-H16", result: cachedJ } : { formula: "D16+F16-H16" };
    cellJ16.numFmt = "#,##0";
    cellJ16.alignment = { horizontal: "right", vertical: "middle" };

    // Total K: E16+G16-I16 (Amount H=B+D-F)
    const cachedK = returnItemsMap["117_00010"] ? parseNum(returnItemsMap["117_00010"]) : undefined;
    const cellK16 = sheet.getCell("K16");
    cellK16.value = cachedK !== undefined ? { formula: "E16+G16-I16", result: cachedK } : { formula: "E16+G16-I16" };
    cellK16.numFmt = "#,##0.00";
    cellK16.alignment = { horizontal: "right", vertical: "middle" };

    setTotalFormula("L", false, "117_00008");
    setTotalFormula("M", false, "117_00009");

    // Rows 17 to endDataRow: Data rows
    for (let i = 0; i < numRows; i++) {
        const rowNum = startDataRow + i;
        const row = sheet.getRow(rowNum);
        row.height = 19;

        const dynItem = dynamicList[i];
        const valuesByCode: Record<string, string> = {};

        if (dynItem && Array.isArray(dynItem.DynamicItems)) {
            dynItem.DynamicItems.forEach((sub: any) => {
                if (sub && sub.Code) valuesByCode[sub.Code] = sub.Value;
            });
        }

        const getVal = (code: string) => valuesByCode[code] || "";

        // Col A: Code
        const cellA = row.getCell(1);
        cellA.value = i + 1;
        cellA.alignment = { horizontal: "center", vertical: "middle" };

        // Col B: Category
        const cellB = row.getCell(2);
        cellB.value = getVal("1.2");
        cellB.alignment = { horizontal: "left", vertical: "middle" };

        // Col C: Type of Fraud
        const cellC = row.getCell(3);
        cellC.value = getVal("1.3");
        cellC.alignment = { horizontal: "left", vertical: "middle" };

        // Helper for numeric cells
        const setNumCell = (colIdx: number, code: string, isInt: boolean) => {
            const cell = row.getCell(colIdx);
            const rawVal = getVal(code);
            if (rawVal && rawVal !== "0" && rawVal !== "-") {
                const n = parseNum(rawVal);
                cell.value = n;
            } else {
                cell.value = null;
            }
            cell.numFmt = isInt ? "#,##0;-#,##0;\"-\"" : "#,##0.00;-#,##0.00;\"-\"";
            cell.alignment = { horizontal: "right", vertical: "middle" };
        };

        setNumCell(4, "1.4", true);   // D
        setNumCell(5, "1.5", false);  // E
        setNumCell(6, "1.6", true);   // F
        setNumCell(7, "1.7", false);  // G
        setNumCell(8, "1.8", true);   // H
        setNumCell(9, "1.9", false);  // I

        // Col J: Formula = D{row} + F{row} - H{row}
        const cellJ = row.getCell(10);
        const cachedJVal = getVal("1.10") ? parseNum(getVal("1.10")) : undefined;
        const jFormula = `D${rowNum}+F${rowNum}-H${rowNum}`;
        cellJ.value = cachedJVal !== undefined ? { formula: jFormula, result: cachedJVal } : { formula: jFormula };
        cellJ.numFmt = "#,##0;-#,##0;\"-\"";
        cellJ.alignment = { horizontal: "right", vertical: "middle" };

        // Col K: Formula = E{row} + G{row} - I{row}
        const cellK = row.getCell(11);
        const cachedKVal = getVal("1.11") ? parseNum(getVal("1.11")) : undefined;
        const kFormula = `E${rowNum}+G${rowNum}-I${rowNum}`;
        cellK.value = cachedKVal !== undefined ? { formula: kFormula, result: cachedKVal } : { formula: kFormula };
        cellK.numFmt = "#,##0.00;-#,##0.00;\"-\"";
        cellK.alignment = { horizontal: "right", vertical: "middle" };

        setNumCell(12, "1.12", false); // L: Written Off
        setNumCell(13, "1.13", false); // M: Provision Held

        // Borders
        for (let c = 1; c <= 13; c++) {
            row.getCell(c).border = thinBorder;
            row.getCell(c).font = { name: "Arial", size: 9.5 };
        }
    }

    // Outer Red Outline Border around A14:M{endDataRow}
    const redBorderMedium: Partial<ExcelJS.Border> = {
        style: "medium",
        color: { argb: "FFFF0000" }
    };

    // Top border of Row 14
    for (let c = 1; c <= 13; c++) {
        sheet.getCell(14, c).border = { ...sheet.getCell(14, c).border, top: redBorderMedium };
    }
    // Bottom border of endDataRow
    for (let c = 1; c <= 13; c++) {
        sheet.getCell(endDataRow, c).border = { ...sheet.getCell(endDataRow, c).border, bottom: redBorderMedium };
    }
    // Left border of Column A
    for (let r = 14; r <= endDataRow; r++) {
        sheet.getCell(r, 1).border = { ...sheet.getCell(r, 1).border, left: redBorderMedium };
    }
    // Right border of Column M
    for (let r = 14; r <= endDataRow; r++) {
        sheet.getCell(r, 13).border = { ...sheet.getCell(r, 13).border, right: redBorderMedium };
    }

    // Footnotes / Notes at row 318 to 321
    const noteFont: Partial<ExcelJS.Font> = { name: "Arial", size: 9 };
    const noteBoldFont: Partial<ExcelJS.Font> = { name: "Arial", size: 9, bold: true };

    sheet.getCell("A318").value = "Note:";
    sheet.getCell("A318").font = noteBoldFont;

    sheet.getCell("A319").value = "-For consistent reporting, category includes cash, deposit, loan, forex, interbank accounts, clearing, off-balance sheet, check/DDs, and others.";
    sheet.getCell("A319").font = noteFont;

    sheet.getCell("A320").value = "-For consistent reporting, type of fraud may include embezzlement, cheating, forgery/using fake instruments, and other.";
    sheet.getCell("A320").font = noteFont;

    sheet.getCell("A321").value = "-The provision held shall be calculated using the classification and minimum provisioning requirement specified under sub-article 10.5 of NBE Directive No.SBB/69/2018 (Commercial Banks) and sub-article of NBE Directive No.SBB/52/2012.";
    sheet.getCell("A321").font = noteFont;

    if (outputExcelPath) {
        const dir = path.dirname(outputExcelPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    return workbook;
}

export async function processFO002Report(
    instCode: string,
    inputFile: string,
    startDateStr: string,
    endDateStr: string,
    filePath: string,
    jsonFilePath: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFile);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            return { success: false, error: "No worksheet found in uploaded file." };
        }

        const jsonOutput = processFO002(
            worksheet,
            instCode,
            startDateStr,
            endDateStr
        );

        const dir = path.dirname(jsonFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonOutput, null, 2), "utf8");

        return { success: true };
    } catch (err: any) {
        console.error("Error in processFO002Report:", err);
        return { success: false, error: err.message || "Failed to process FO002 report" };
    }
}
