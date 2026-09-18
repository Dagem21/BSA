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

const STANDARD_ROWS = [
    { depType: "Saving Deposit ", depCat: "1.1 Government" },
    { depType: "Saving Deposit ", depCat: "1.2 Public Agencies & Enterprises" },
    { depType: "Saving Deposit ", depCat: "1.3 Private Sector" },
    { depType: "Saving Deposit ", depCat: "1.3.1 o/w Households" },
    { depType: "Saving Deposit ", depCat: "1.4 FCY Linked Deposit (can be withdrawn in FCY)" },
    { depType: "Saving Deposit ", depCat: "1.5 FCY Linked Deposit (can be withdrawn in LCY)" },
    { depType: "Saving Deposit ", depCat: "1.6 Others (not included elsewhere)" },
    { depType: "Demand Deposit ", depCat: "1.1 Government" },
    { depType: "Demand Deposit ", depCat: "1.2 Public Agencies & Enterprises" },
    { depType: "Demand Deposit ", depCat: "1.3 Private Sector" },
    { depType: "Demand Deposit ", depCat: "1.3.1 o/w Households" },
    { depType: "Demand Deposit ", depCat: "1.4 FCY Linked Deposit (can be withdrawn in FCY)" },
    { depType: "Demand Deposit ", depCat: "1.5 FCY Linked Deposit (can be withdrawn in LCY)" },
    { depType: "Demand Deposit ", depCat: "1.6 Others (not included elsewhere)" },
    { depType: "Time Deposit ", depCat: "3.1 Government" },
    { depType: "Time Deposit ", depCat: "Up to 1 Year" },
    { depType: "Time Deposit ", depCat: "1-2 Years" },
    { depType: "Time Deposit ", depCat: "Above 2 Years" },
    { depType: "Time Deposit ", depCat: "3.3.1 o/w Households" },
    { depType: "Time Deposit ", depCat: "Up to 1 Year" },
    { depType: "Time Deposit ", depCat: "1-2 Years" },
    { depType: "Time Deposit ", depCat: "Above 2 Years" },
    { depType: "Time Deposit ", depCat: "3.4 FCY Linked Deposit (can be withdrawn in FCY)" },
    { depType: "Time Deposit ", depCat: "3.5 FCY Linked Deposit (can be withdrawn in LCY)" },
    { depType: "Time Deposit ", depCat: "3.6 Others (not included elsewhere)" },
    { depType: "Time Deposit ", depCat: "Up to 1 Year" },
    { depType: "Time Deposit ", depCat: "Up to 1 Year" },
    { depType: "Time Deposit ", depCat: "1-2 Years" },
    { depType: "Time Deposit ", depCat: "Above 2 Years" },
    { depType: "Time Deposit ", depCat: "1-2 Years" },
    { depType: "Time Deposit ", depCat: "Above 2 Years" },
    { depType: "Time Deposit ", depCat: "3.2 Public Agencies & Enterprises" },
    { depType: "Time Deposit ", depCat: "Up to 1 Year" },
    { depType: "Time Deposit ", depCat: "1-2 Years" },
    { depType: "Time Deposit ", depCat: "Above 2 Years" },
    { depType: "Time Deposit ", depCat: "3.3 Private Sector" }
];

function isDateLike(val) {
    if (!val) return false;
    if (val instanceof Date && !isNaN(val.getTime())) return true;
    if (typeof val === "string") {
        const trimmed = val.trim();
        if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed)) return true;
        if (!isNaN(Date.parse(trimmed)) && !/^\d+$/.test(trimmed)) return true;
    }
    return false;
}

function cleanDateStr(val, fallback) {
    if (!val) return fallback;
    if (val instanceof Date) {
        if (isNaN(val.getTime())) return fallback;
        const pad = (n) => n.toString().padStart(2, "0");
        return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`;
    }
    if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed.includes("T")) return trimmed.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.substring(0, 10);
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) {
            const pad = (n) => n.toString().padStart(2, "0");
            return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
        }
    }
    return fallback;
}

export function processWAADIR001(worksheet, instCode, startDate, endDate) {
    const formatCellVal = (cellVal: any): string => getDirectCellValue(cellVal);

    let parsedInst = "";
    let parsedYear = "";
    let parsedStart = "";
    let parsedEnd = "";

    // Robust metadata discovery across top 15 rows
    for (let r = 1; r <= 15; r++) {
        const row = worksheet.getRow(r);
        const label = formatCellVal(row.getCell(1).value).toLowerCase();
        const c2 = row.getCell(2).value;
        const c3 = row.getCell(3).value;
        const rawVal = (c2 !== null && c2 !== undefined && c2 !== "") ? c2 : c3;

        if (label.includes("inst") && (label.includes("code") || label.includes("tion"))) {
            const sVal = formatCellVal(rawVal);
            if (!isDateLike(rawVal) && sVal) parsedInst = sVal;
        } else if (label.includes("year") || label.includes("financial")) {
            const sVal = formatCellVal(rawVal);
            if (/^\d{4}$/.test(sVal)) parsedYear = sVal;
        } else if (label.includes("start") && label.includes("date")) {
            if (isDateLike(rawVal)) parsedStart = rawVal;
        } else if (label.includes("end") && label.includes("date")) {
            if (isDateLike(rawVal)) parsedEnd = rawVal;
        }
    }

    const finalInstCode = parsedInst || instCode || "0000001";
    const finalFinYear = parsedYear ? parseInt(parsedYear, 10) : 2026;
    const finalStartDate = cleanDateStr(parsedStart || startDate, "2026-08-01") + "T00:00:00";
    const finalEndDate = cleanDateStr(parsedEnd || endDate, "2026-08-31") + "T00:00:00";

    // Detect starting row for data (default 11)
    let startRow = 11;
    for (let r = 1; r <= 15; r++) {
        const c1 = formatCellVal(worksheet.getRow(r).getCell(1).value).toLowerCase();
        const c2 = formatCellVal(worksheet.getRow(r).getCell(2).value).toLowerCase();
        if (c1.includes("saving") || c2.includes("1.1")) {
            startRow = r;
            break;
        }
    }

    const dynamicItemsList = [];

    // Fields without values are filled with "0" as explicitly requested
    const toZeroOrVal = (cellVal) => {
        const v = formatCellVal(cellVal);
        return (v === "" || v === null || v === undefined) ? "0" : v;
    };

    for (let r = startRow; r <= startRow + 35; r++) {
        const row = worksheet.getRow(r);
        const depType = formatCellVal(row.getCell(1).value);
        const depCat = formatCellVal(row.getCell(2).value);

        if (!depType && !depCat) continue;
        if (depType.toLowerCase() === "total" || depCat.toLowerCase() === "total") break;

        const colC = toZeroOrVal(row.getCell(3).value);
        const colD = toZeroOrVal(row.getCell(4).value);
        const colE = toZeroOrVal(row.getCell(5).value);
        const colF = toZeroOrVal(row.getCell(6).value);
        const colG = toZeroOrVal(row.getCell(7).value);
        const colH = toZeroOrVal(row.getCell(8).value);

        dynamicItemsList.push({
            Area: 215,
            _areaName: "Monthly Weighted Average Deposit Interest Rates (Conventional Banks)",
            DynamicItems: [
                { Code: "1.1", Value: depType, _description: "Deposit Type ", _dataType: "TEXT", _required: true },
                { Code: "1.2", Value: depCat, _description: "Deposit Category ", _dataType: "TEXT", _required: true },
                { Code: "1.3", Value: colC, _description: "Total Deposit Amount  ( in\nMn Birr)", _dataType: "NUMERIC", _required: true },
                { Code: "1.4", Value: colD, _description: "No. of Deposit \nAccounts by \nCategory ", _dataType: "NUMERIC", _required: true },
                { Code: "1.5", Value: colE, _description: "Lending Interest Rates (% per annum)_ Minimum Rate \nby Deposit \ncategory", _dataType: "NUMERIC", _required: true },
                { Code: "1.6", Value: colF, _description: "Lending Interest Rates (% per annum)_ Maximum Rate \nby Deposit \ncategory", _dataType: "NUMERIC", _required: true },
                { Code: "1.7", Value: colG, _description: "Lending Interest Rates (% per annum)_ Weighted \nAverage Rate \nby Deposit \ncategory ", _dataType: "NUMERIC", _required: true },
                { Code: "1.8", Value: colH, _description: "Lending Interest Rates (% per annum) _Weighted Average Rate \nby Deposit Type", _dataType: "NUMERIC", _required: true }
            ]
        });
    }

    return {
        ReturnKey: "WAADIR001",
        InstCode: finalInstCode,
        FinYear: finalFinYear,
        StartDate: finalStartDate,
        EndDate: finalEndDate,
        ReturnItemsList: [],
        DynamicItemsList: dynamicItemsList
    };
}

export async function jsonToExcelWAADIR001(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("WADIR");

    sheet.views = [{ showGridLines: true }];

    sheet.columns = [
        { key: "colA", width: 18.86 },
        { key: "colB", width: 45.14 },
        { key: "colC", width: 18.86 },
        { key: "colD", width: 12.57 },
        { key: "colE", width: 15.57 },
        { key: "colF", width: 16.00 },
        { key: "colG", width: 14.71 },
        { key: "colH", width: 13.29 }
    ];

    sheet.getRow(1).height = 15.75;
    sheet.getRow(2).height = 15.75;
    sheet.getRow(3).height = 15.75;

    sheet.getCell("A1").value = "WAADIR001";
    sheet.getCell("A1").font = { name: "Calibri", size: 11 };

    const redColor = { argb: "FFFF0000" };
    const pinkFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2DCDB" } };
    const lavenderFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D2E9" } };
    const peachFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDE9D9" } };
    
    const thinBlack = { style: "thin", color: { argb: "FF000000" } };
    const mediumBlack = { style: "medium", color: { argb: "FF000000" } };
    const thickRed = { style: "thick", color: redColor };
    const mediumRed = { style: "medium", color: redColor };

    // Row 4: Title Banner
    sheet.mergeCells("A4:H4");
    const titleCell = sheet.getCell("A4");
    titleCell.value = " Monthly Weighted Average Deposit Interest Rates (Conventional Banks)";
    titleCell.font = { name: "Calibri", size: 18, bold: true, color: redColor };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = pinkFill;
    sheet.getRow(4).height = 38.45;

    for (let c = 1; c <= 8; c++) {
        sheet.getCell(4, c).border = {
            top: thickRed,
            bottom: thickRed,
            left: c === 1 ? thickRed : undefined,
            right: c === 8 ? thickRed : undefined
        };
    }

    // Rows 5-8: Metadata Block
    const sDate = cleanDateStr(jsonPayload.StartDate, "2026-08-01");
    const eDate = cleanDateStr(jsonPayload.EndDate, "2026-08-31");

    const metaEntries = [
        { label: "Instiution Code ", val: jsonPayload.InstCode || "0000001", numFmt: undefined },
        { label: "Financial Year", val: jsonPayload.FinYear || 2026, numFmt: undefined },
        { label: "Start Date", val: sDate, numFmt: "yyyy-mm-dd" },
        { label: "End Date", val: eDate, numFmt: "yyyy-mm-dd" }
    ];

    metaEntries.forEach((entry, idx) => {
        const r = 5 + idx;
        const row = sheet.getRow(r);
        row.height = 15.75;

        const cellA = sheet.getCell(r, 1);
        cellA.value = entry.label;
        cellA.font = { name: "Calibri", size: 11 };
        cellA.alignment = { vertical: "middle", horizontal: "left" };
        cellA.fill = lavenderFill;
        cellA.border = { top: thinBlack, bottom: thinBlack, left: thinBlack, right: thinBlack };

        const cellB = sheet.getCell(r, 2);
        cellB.value = entry.val;
        cellB.font = { name: "Times New Roman", size: 11 };
        cellB.alignment = { vertical: "middle", horizontal: "left" };
        cellB.fill = peachFill;
        if (entry.numFmt) cellB.numFmt = entry.numFmt;
        cellB.border = { top: thinBlack, bottom: thinBlack, left: thinBlack, right: thinBlack };
    });

    // Rows 9 & 10: Table Headers
    sheet.getRow(9).height = 16.5;
    sheet.getRow(10).height = 60.75;

    sheet.mergeCells("A9:A10");
    const cellType = sheet.getCell("A9");
    cellType.value = "Deposit Type ";
    cellType.font = { name: "Calibri", size: 11, bold: true };
    cellType.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("B9:B10");
    const cellCat = sheet.getCell("B9");
    cellCat.value = "Deposit Category ";
    cellCat.font = { name: "Calibri", size: 11, bold: true };
    cellCat.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("C9:C10");
    const cellAmt = sheet.getCell("C9");
    cellAmt.value = "Total Deposit Amount  ( in\nMn Birr)";
    cellAmt.font = { name: "Calibri", size: 11, bold: true };
    cellAmt.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("D9:D10");
    const cellAcc = sheet.getCell("D9");
    cellAcc.value = "No. of Deposit \nAccounts by \nCategory ";
    cellAcc.font = { name: "Calibri", size: 11, bold: true };
    cellAcc.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("E9:H9");
    const cellRateBanner = sheet.getCell("E9");
    cellRateBanner.value = "Lending Interest Rates (% per annum) ";
    cellRateBanner.font = { name: "Calibri", size: 11, bold: true };
    cellRateBanner.alignment = { vertical: "middle", horizontal: "center" };

    const subHeaders = [
        { col: 5, label: "Minimum Rate \nby Deposit \ncategory" },
        { col: 6, label: "Maximum Rate \nby Deposit \ncategory" },
        { col: 7, label: "Weighted \nAverage Rate \nby Deposit \ncategory " },
        { col: 8, label: "Weighted Average Rate \nby Deposit Type" }
    ];

    subHeaders.forEach(sub => {
        const c = sheet.getCell(10, sub.col);
        c.value = sub.label;
        c.font = { name: "Calibri", size: 11, bold: true };
        c.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    });

    for (let c = 1; c <= 8; c++) {
        sheet.getCell(9, c).border = {
            top: thickRed,
            left: c === 1 ? thickRed : thinBlack,
            right: c === 8 ? thickRed : thinBlack,
            bottom: (c >= 5 && c <= 8) ? mediumBlack : undefined
        };
        sheet.getCell(10, c).border = {
            bottom: undefined,
            left: c === 1 ? thickRed : thinBlack,
            right: c === 8 ? thickRed : thinBlack,
            top: (c >= 5 && c <= 8) ? mediumBlack : undefined
        };
    }

    const parseNum = (v) => {
        if (v === "" || v === undefined || v === null) return null;
        const n = parseFloat(v);
        return isNaN(n) ? null : n;
    };

    // Prepare data list from DynamicItemsList
    const dataList = [];
    if (jsonPayload.DynamicItemsList && Array.isArray(jsonPayload.DynamicItemsList)) {
        jsonPayload.DynamicItemsList.forEach((group) => {
            const itemObj = {};
            if (group.DynamicItems && Array.isArray(group.DynamicItems)) {
                group.DynamicItems.forEach(item => {
                    itemObj[item.Code] = item.Value;
                });
            }
            dataList.push({
                depType: itemObj["1.1"] || "",
                depCat: itemObj["1.2"] || "",
                colC: parseNum(itemObj["1.3"]),
                colD: parseNum(itemObj["1.4"]),
                colE: parseNum(itemObj["1.5"]),
                colF: parseNum(itemObj["1.6"]),
                colG: parseNum(itemObj["1.7"]),
                colH: parseNum(itemObj["1.8"])
            });
        });
    }

    const totalRowsCount = Math.max(STANDARD_ROWS.length, dataList.length);

    // Render data rows starting at row 11
    for (let idx = 0; idx < totalRowsCount; idx++) {
        const rNum = 11 + idx;
        const row = sheet.getRow(rNum);
        row.height = 15.75;

        const stdRow = STANDARD_ROWS[idx] || {};
        const dataItem = dataList[idx] || {};

        // Column A: Deposit Type
        const cellA = row.getCell(1);
        cellA.value = dataItem.depType || stdRow.depType || "";
        cellA.font = { name: "Times New Roman", size: 10 };
        cellA.alignment = { vertical: "middle", horizontal: "left" };

        // Column B: Deposit Category
        const cellB = row.getCell(2);
        cellB.value = dataItem.depCat || stdRow.depCat || "";
        cellB.font = { name: "Calibri", size: 11 };
        cellB.alignment = { vertical: "middle", horizontal: "left" };

        // Determine if row has active data (deposit amount or accounts > 0)
        const cVal = dataItem.colC;
        const dVal = dataItem.colD;
        const isActive = (cVal !== null && cVal !== undefined && cVal > 0) ||
                         (dVal !== null && dVal !== undefined && dVal > 0);

        if (isActive) {
            row.getCell(3).value = (cVal !== null && cVal > 0) ? cVal : null;
            row.getCell(4).value = (dVal !== null && dVal > 0) ? dVal : null;
            row.getCell(5).value = dataItem.colE !== null ? dataItem.colE : 0;
            row.getCell(6).value = dataItem.colF !== null ? dataItem.colF : 0;
            row.getCell(7).value = dataItem.colG !== null ? dataItem.colG : 0;
            row.getCell(8).value = dataItem.colH !== null ? dataItem.colH : 0;
        } else {
            row.getCell(3).value = null;
            row.getCell(4).value = null;
            row.getCell(5).value = null;
            row.getCell(6).value = null;
            row.getCell(7).value = null;
            row.getCell(8).value = null;
        }

        row.getCell(3).font = { name: "Times New Roman", size: 10 };
        row.getCell(3).alignment = { vertical: "middle", horizontal: "left" };

        for (let c = 4; c <= 8; c++) {
            row.getCell(c).font = { name: "Calibri", size: 11 };
            row.getCell(c).alignment = { vertical: "middle", horizontal: "left" };
        }

        // Cell borders
        const isFirstDataRow = (idx === 0);
        const isLastDataRow = (idx === totalRowsCount - 1);

        for (let c = 1; c <= 8; c++) {
            const cell = row.getCell(c);
            cell.border = {
                top: isFirstDataRow ? mediumRed : thinBlack,
                bottom: isLastDataRow ? mediumRed : thinBlack,
                left: thinBlack,
                right: c === 8 ? mediumRed : thinBlack
            };
        }
    }

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



export async function processWAADIR001Report(
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

        const rawJson = processWAADIR001(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelWAADIR001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing WAADIR001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process WAADIR001 report."
        };
    }
}

export const processADIR001Report = processWAADIR001Report;
export const processADIR001 = processWAADIR001;
export const jsonToExcelADIR001 = jsonToExcelWAADIR001;


export async function populateWAADIR001Report(
    intCode: string,
    rowsData: any[],
    startDate: Date,
    endDate: Date,
    reportTypeID: string
): Promise<any> {
    try {
        const rootDir = process.cwd();
        const fileName = `WAADIR001_${Date.now()}`;
        const fileNameJson = `${fileName}.json`;
        const outputDirJson = path.join(rootDir, "reports", "json");
        const outputPathJson = path.join(outputDirJson, fileNameJson);
        if (!fs.existsSync(outputDirJson)) fs.mkdirSync(outputDirJson, { recursive: true });
        
        const payload = {
            ReturnKey: "WAADIR001",
            InstCode: intCode,
            FinYear: startDate.getFullYear(),
            StartDate: startDate.toISOString(),
            EndDate: endDate.toISOString(),
            ReturnItemsList: [],
            DynamicItemsList: rowsData || []
        };
        fs.writeFileSync(outputPathJson, JSON.stringify(sanitizeJsonPayload(payload), null, 4), "utf8");
        return { created: true, fileNameJson };
    } catch (e) {
        console.error("populateWAADIR001Report error:", e);
        return { created: false };
    }
}

