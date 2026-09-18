// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

const STANDARD_SECTORS = [
    { name: "Agriculture", key: "agriculture" },
    { name: "Manufacturing", key: "manufacturing" },
    { name: "Domestic Trade", key: "domestic_trade" },
    { name: "International trade  Export", key: "export" },
    { name: "International trade  Import", key: "import" },
    { name: "Hotel and Tourism", key: "hotel" },
    { name: "Buliding  and Construction", key: "construction" },
    { name: "Mining and Quarring", key: "mining" },
    { name: "Financial Institutions", key: "financial" },
    { name: "Transport and Communication", key: "transport" },
    { name: "Health and Education", key: "health" },
    { name: "Consumer  loans", key: "consumer" },
    { name: "Staff loans", key: "staff" },
    { name: "Other loans (not included elesewhere)", key: "other" }
];

const STANDARD_CATEGORIES = [
    "Over- draft",
    "Up to 12 months",
    "1-5 years",
    "Over 5 years"
];

function normalizeKey(str) {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .replace(/building/g, "buliding")
        .replace(/over[-\s]*draft/g, "overdraft")
        .replace(/\s+/g, " ")
        .trim();
}

export function processLCMWAC001(worksheet, instCode, startDate, endDate) {
    const formatCellVal = (cellVal) => {
        if (cellVal === null || cellVal === undefined) return "";
        if (cellVal instanceof Date) {
            if (isNaN(cellVal.getTime())) return "";
            const pad = (n) => n.toString().padStart(2, "0");
            const yyyy = cellVal.getFullYear();
            const mm = pad(cellVal.getMonth() + 1);
            const dd = pad(cellVal.getDate());
            return `${yyyy}-${mm}-${dd}`;
        }
        if (typeof cellVal === "number") return cellVal.toString();
        if (typeof cellVal === "string") {
            const trimmed = cellVal.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                }
            }
            return trimmed;
        }
        if (typeof cellVal === "object") {
            if ("result" in cellVal && cellVal.result !== null && cellVal.result !== undefined) {
                return formatCellVal(cellVal.result);
            }
            if ("text" in cellVal && cellVal.text) {
                return formatCellVal(cellVal.text);
            }
        }
        return cellVal.toString().trim();
    };

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

    const isDateLike = (val) => {
        if (!val) return false;
        if (val instanceof Date && !isNaN(val.getTime())) return true;
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed)) return true;
            if (!isNaN(Date.parse(trimmed)) && !/^\d+$/.test(trimmed)) return true;
        }
        return false;
    };

    let parsedInst = "";
    let parsedYear = "";
    let parsedStart = "";
    let parsedEnd = "";

    // Dynamic metadata discovery scanning top 15 rows
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

    const parsedInstCode = parsedInst || instCode || "0000001";
    const finYear = parsedYear ? parseInt(parsedYear, 10) : 2026;
    const formattedStartDate = formatDateNoShift(startDate || parsedStart, "2026-08-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || parsedEnd, "2026-08-31T00:00:00");

    const dynamicItemsList = [];

    let currentSector = "";
    let currentSectorRate = "";

    // Helper: format numeric value with "0" as fallback for unpopulated fields
    const toZeroIfEmpty = (v) => {
        if (v === null || v === undefined) return "0";
        const s = v.toString().trim();
        return s === "" ? "0" : s;
    };

    // Data rows run from row 11 to row 66 (14 sectors * 4 categories)
    for (let r = 11; r <= 75; r++) {
        const row = worksheet.getRow(r);
        let sector = formatCellVal(row.getCell(1).value);
        const category = formatCellVal(row.getCell(2).value);

        if (sector) {
            currentSector = sector;
        } else if (category && currentSector) {
            sector = currentSector;
        }

        if (!sector && !category) continue;
        if (sector.toLowerCase() === "total" || category.toLowerCase() === "total") break;

        const colC = formatCellVal(row.getCell(3).value);
        const colD = formatCellVal(row.getCell(4).value);
        const colE = formatCellVal(row.getCell(5).value);
        const colF = formatCellVal(row.getCell(6).value);
        const colG = formatCellVal(row.getCell(7).value);
        let colH = formatCellVal(row.getCell(8).value);

        if (colH) {
            currentSectorRate = colH;
        } else if (currentSectorRate) {
            colH = currentSectorRate;
        }

        dynamicItemsList.push({
            Area: 213,
            _areaName: "Monthly Weighted Average Lending Interest Rates (Conventional Banks)",
            DynamicItems: [
                { Code: "1.1", Value: sector, _description: "Sector", _dataType: "TEXT", _required: true },
                { Code: "1.2", Value: category, _description: "Loan Category ", _dataType: "TEXT", _required: true },
                { Code: "1.3", Value: toZeroIfEmpty(colC), _description: "Outstanding Loan & Advance ( in Mn Birr)", _dataType: "NUMERIC", _required: true },
                { Code: "1.4", Value: toZeroIfEmpty(colD), _description: "No. of Loan Accounts by Loan Category", _dataType: "NUMERIC", _required: true },
                { Code: "1.5", Value: toZeroIfEmpty(colE), _description: "Lending Interest Rates (% per annum) _Minimum Rate \nby loan \ncategory", _dataType: "NUMERIC", _required: true },
                { Code: "1.6", Value: toZeroIfEmpty(colF), _description: "Lending Interest Rates (% per annum)_ Maximum Rate \nby loan \ncategory", _dataType: "NUMERIC", _required: true },
                { Code: "1.7", Value: toZeroIfEmpty(colG), _description: "Lending Interest Rates (% per annum)_ Weighted \nAverage Rate \nby loan \ncategory ", _dataType: "NUMERIC", _required: true },
                { Code: "1.8", Value: toZeroIfEmpty(colH), _description: "Lending Interest Rates (% per annum)_ Weighted Average Rate by Sector", _dataType: "NUMERIC", _required: true }
            ]
        });
    }

    return {
        ReturnKey: "LCMWAC001",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: [],
        DynamicItemsList: dynamicItemsList
    };
}

export async function jsonToExcelLCMWAC001(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Lending Interest Rates");

    sheet.views = [{ showGridLines: true }];

    sheet.columns = [
        { key: "colA", width: 60.29 }, // Sector
        { key: "colB", width: 18.86 }, // Loan Category
        { key: "colC", width: 21.29 }, // Outstanding Loan & Advance
        { key: "colD", width: 13.86 }, // No. of Loan Accounts
        { key: "colE", width: 14.14 }, // Minimum Rate
        { key: "colF", width: 16.57 }, // Maximum Rate
        { key: "colG", width: 16.43 }, // Weighted Avg Rate by Category
        { key: "colH", width: 18.14 }  // Weighted Avg Rate by Sector
    ];

    sheet.getRow(1).height = 15.75;
    sheet.getRow(2).height = 15.75;
    sheet.getRow(3).height = 15.75;

    const redColor = { argb: "FFFF0000" };
    // Exact bank template palette:
    // Title fill: Theme 5 tint 0.6 (#F2DCDB)
    const titleFill = { type: "pattern", pattern: "solid", fgColor: { theme: 5, tint: 0.5999938962981048 } };
    // Metadata label fill: Theme 7 tint 0.6 (#CCC1DA Lavender)
    const lavenderFill = { type: "pattern", pattern: "solid", fgColor: { theme: 7, tint: 0.5999938962981048 } };
    // Metadata value fill: Theme 9 tint 0.6 (#FBD5B5 Peach)
    const peachFill = { type: "pattern", pattern: "solid", fgColor: { theme: 9, tint: 0.5999938962981048 } };
    // Sector column A fill: Theme 0 tint -0.35 (#A6A6A6 Grey)
    const grayFill = { type: "pattern", pattern: "solid", fgColor: { theme: 0, tint: -0.3499862666707358 }, bgColor: { indexed: 64 } };
    
    const thinBlack = { style: "thin", color: { auto: 1 } };
    const mediumBlack = { style: "medium", color: { indexed: 64 } };
    const thickRed = { style: "thick", color: redColor };

    // Row 4: Title Banner
    sheet.mergeCells("A4:H4");
    const titleCell = sheet.getCell("A4");
    titleCell.value = "Monthly Weighted Average Lending Interest Rates (Conventional Banks)";
    titleCell.font = { name: "Calibri", size: 18, color: redColor };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = titleFill;
    sheet.getRow(4).height = 38.45;

    for (let c = 1; c <= 8; c++) {
        sheet.getCell(4, c).border = {
            top: thickRed,
            bottom: thickRed,
            left: c === 1 ? thickRed : undefined,
            right: c === 8 ? thickRed : undefined
        };
    }

    const cleanDate = (isoStr) => isoStr ? isoStr.split("T")[0] : "";

    // Rows 5-8: Metadata Block
    const metaEntries = [
        { label: "Instiution Code ", val: jsonPayload.InstCode || "0000001", numFmt: "@", height: 16.5 },
        { label: "Financial Year", val: jsonPayload.FinYear ? jsonPayload.FinYear.toString() : "2026", numFmt: "@", height: 15.75 },
        { label: "Start Date", val: cleanDate(jsonPayload.StartDate) || "2026-08-01", numFmt: "[$-10452]yyyy-mm-dd;@", height: 15.75 },
        { label: "End Date", val: cleanDate(jsonPayload.EndDate) || "2026-08-31", numFmt: "[$-10452]yyyy-mm-dd;@", height: 16.5 }
    ];

    metaEntries.forEach((entry, idx) => {
        const r = 5 + idx;
        const row = sheet.getRow(r);
        row.height = entry.height;

        const cellA = sheet.getCell(r, 1);
        cellA.value = entry.label;
        cellA.font = { name: "Calibri", size: 11 };
        cellA.alignment = { vertical: "middle", horizontal: "left" };
        cellA.fill = lavenderFill;
        cellA.border = { top: thinBlack, bottom: thinBlack, left: thinBlack, right: thinBlack };

        const cellB = sheet.getCell(r, 2);
        cellB.value = entry.val;
        cellB.font = { name: "Times New Roman", size: 12, bold: true };
        cellB.alignment = { vertical: "middle", horizontal: "left" };
        cellB.fill = peachFill;
        cellB.numFmt = entry.numFmt;
        cellB.border = { top: thinBlack, bottom: thinBlack, left: thinBlack, right: thinBlack };
    });

    // Rows 9 & 10: Table Headers
    sheet.getRow(9).height = 16.5;
    sheet.getRow(10).height = 60.75;

    sheet.mergeCells("A9:A10");
    const cellSector = sheet.getCell("A9");
    cellSector.value = "Sector";
    cellSector.font = { name: "Calibri", size: 11 };
    cellSector.alignment = { vertical: "bottom", horizontal: "center", wrapText: true };

    sheet.mergeCells("B9:B10");
    const cellCat = sheet.getCell("B9");
    cellCat.value = "Loan Category ";
    cellCat.font = { name: "Calibri", size: 11 };
    cellCat.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("C9:C10");
    const cellLoan = sheet.getCell("C9");
    cellLoan.value = "Outstanding Loan & \nAdvance ( in\nMn Birr)";
    cellLoan.font = { name: "Calibri", size: 11 };
    cellLoan.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("D9:D10");
    const cellAcc = sheet.getCell("D9");
    cellAcc.value = "No. of Loan \nAccounts by \nLoan Category ";
    cellAcc.font = { name: "Calibri", size: 11 };
    cellAcc.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

    sheet.mergeCells("E9:H9");
    const cellRateBanner = sheet.getCell("E9");
    cellRateBanner.value = "Lending Interest Rates (% per annum) ";
    cellRateBanner.font = { name: "Calibri", size: 11 };
    cellRateBanner.alignment = { vertical: "middle", horizontal: "center" };

    const subHeaders = [
        { col: 5, label: "Minimum Rate \nby loan \ncategory" },
        { col: 6, label: "Maximum Rate \nby loan \ncategory" },
        { col: 7, label: "Weighted \nAverage Rate \nby loan \ncategory " },
        { col: 8, label: "Weighted Average Rate \nby Sector" }
    ];

    subHeaders.forEach(sub => {
        const c = sheet.getCell(10, sub.col);
        c.value = sub.label;
        c.font = { name: "Calibri", size: 11 };
        c.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    });

    for (let c = 1; c <= 8; c++) {
        sheet.getCell(9, c).border = {
            top: thickRed,
            left: c === 1 ? thickRed : (c === 5 ? mediumBlack : thinBlack),
            right: c === 8 ? thickRed : thinBlack,
            bottom: (c >= 5 && c <= 8) ? mediumBlack : thinBlack
        };
        sheet.getCell(10, c).border = {
            bottom: mediumBlack,
            left: c === 1 ? thickRed : thinBlack,
            right: c === 8 ? thickRed : thinBlack,
            top: (c >= 5 && c <= 8) ? mediumBlack : thinBlack
        };
    }

    const parseNum = (v) => (v !== "" && v !== undefined && v !== null && !isNaN(parseFloat(v))) ? parseFloat(v) : (v || 0);

    const dataMap = {};
    const dataList = [];
    if (jsonPayload.DynamicItemsList && Array.isArray(jsonPayload.DynamicItemsList)) {
        jsonPayload.DynamicItemsList.forEach(group => {
            const itemObj = {};
            if (group.DynamicItems && Array.isArray(group.DynamicItems)) {
                group.DynamicItems.forEach(item => {
                    itemObj[item.Code] = item.Value;
                });
            }
            const sRaw = itemObj["1.1"] || "";
            const cRaw = itemObj["1.2"] || "";
            const entry = {
                sectorRaw: sRaw,
                categoryRaw: cRaw,
                colC: parseNum(itemObj["1.3"]),
                colD: parseNum(itemObj["1.4"]),
                colE: parseNum(itemObj["1.5"]),
                colF: parseNum(itemObj["1.6"]),
                colG: parseNum(itemObj["1.7"]),
                colH: parseNum(itemObj["1.8"])
            };
            const nKey = `${normalizeKey(sRaw)}|${normalizeKey(cRaw)}`;
            if (nKey !== "|") {
                dataMap[nKey] = entry;
            }
            dataList.push(entry);
        });
    }

    const totalCategorySums = {
        "overdraft": { loans: 0, accounts: 0 },
        "up to 12 months": { loans: 0, accounts: 0 },
        "1-5 years": { loans: 0, accounts: 0 },
        "over 5 years": { loans: 0, accounts: 0 }
    };

    let currentRow = 11;

    STANDARD_SECTORS.forEach((sec, sIdx) => {
        const startR = currentRow;
        const endR = startR + 3;

        let sectorWeightedRate = "";

        STANDARD_CATEGORIES.forEach((catName, cIdx) => {
            const rNum = startR + cIdx;
            const row = sheet.getRow(rNum);
            row.height = 15.75;

            row.getCell(2).value = catName;
            row.getCell(2).alignment = { horizontal: "left" };
            row.getCell(2).font = { name: "Times New Roman", size: 10 };

            const nKey = `${normalizeKey(sec.name)}|${normalizeKey(catName)}`;
            let match = dataMap[nKey];
            if (!match && dataList.length === 56) {
                match = dataList[sIdx * 4 + cIdx];
            }
            if (!match) match = {};

            const valC = match.colC !== undefined ? match.colC : 0;
            const valD = match.colD !== undefined ? match.colD : 0;
            const valE = match.colE !== undefined ? match.colE : 0;
            const valF = match.colF !== undefined ? match.colF : 0;
            const valG = match.colG !== undefined ? match.colG : 0;

            if (match.colH !== undefined && match.colH !== "") {
                sectorWeightedRate = match.colH;
            }

            row.getCell(3).value = valC;
            row.getCell(3).alignment = { horizontal: "left" };
            row.getCell(3).font = { name: "Times New Roman", size: 10 };
            if (typeof valC === "number") {
                const normC = normalizeKey(catName);
                if (totalCategorySums[normC]) totalCategorySums[normC].loans += valC;
            }

            row.getCell(4).value = valD;
            row.getCell(4).font = { name: "Calibri", size: 11 };
            if (typeof valD === "number") {
                const normC = normalizeKey(catName);
                if (totalCategorySums[normC]) totalCategorySums[normC].accounts += valD;
            }

            row.getCell(5).value = valE;
            row.getCell(5).font = { name: "Calibri", size: 11 };

            row.getCell(6).value = valF;
            row.getCell(6).font = { name: "Calibri", size: 11 };

            row.getCell(7).value = valG;
            row.getCell(7).font = { name: "Calibri", size: 11 };

            for (let c = 2; c <= 7; c++) {
                row.getCell(c).border = {
                    top: cIdx === 0 ? mediumBlack : thinBlack,
                    bottom: rNum === endR ? mediumBlack : thinBlack,
                    left: thinBlack,
                    right: thinBlack
                };
            }
        });

        // Column A: Merge 4 rows for Sector with Gray Fill
        sheet.mergeCells(startR, 1, endR, 1);
        const cellSec = sheet.getCell(startR, 1);
        cellSec.value = sec.name;
        cellSec.font = { name: "Calibri", size: 11, bold: true };
        cellSec.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cellSec.fill = grayFill;

        for (let rNum = startR; rNum <= endR; rNum++) {
            sheet.getCell(rNum, 1).border = {
                top: rNum === startR ? mediumBlack : undefined,
                bottom: rNum === endR ? mediumBlack : undefined,
                left: thinBlack,
                right: thinBlack
            };
        }

        // Column H: Merge 4 rows for Sector Weighted Average Rate with formula
        sheet.mergeCells(startR, 8, endR, 8);
        const cellSecRate = sheet.getCell(startR, 8);
        const formula = `((C${startR}*G${startR})+(C${startR+1}*G${startR+1})+(C${startR+2}*G${startR+2})+(C${startR+3}*G${startR+3}))/SUM(C${startR}:C${endR})`;
        const numResult = typeof sectorWeightedRate === "number" ? sectorWeightedRate : parseFloat(sectorWeightedRate);
        
        if (!isNaN(numResult) && numResult !== null && numResult !== undefined && numResult !== "") {
            cellSecRate.value = {
                formula: formula,
                result: numResult
            };
        } else {
            cellSecRate.value = {
                formula: formula,
                result: 0
            };
        }
        cellSecRate.font = { name: "Calibri", size: 11 };
        cellSecRate.alignment = { vertical: "middle", horizontal: "center" };
        cellSecRate.numFmt = "_-* #,##0.00_-;-* #,##0.00_-;_-* \"-\"??_-;_-@_-";

        for (let rNum = startR; rNum <= endR; rNum++) {
            sheet.getCell(rNum, 8).border = {
                top: rNum === startR ? mediumBlack : undefined,
                bottom: rNum === endR ? mediumBlack : undefined,
                left: thinBlack,
                right: thinBlack // Regular thin border on sector rows
            };
        }

        currentRow = endR + 1;
    });

    // Rows 67-70: Total Block
    const totalStartR = 67;
    const totalEndR = 70;

    sheet.mergeCells(totalStartR, 1, totalEndR, 1);
    const cellTotalHeader = sheet.getCell(totalStartR, 1);
    cellTotalHeader.value = "Total";
    cellTotalHeader.font = { name: "Calibri", size: 11, bold: true };
    cellTotalHeader.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cellTotalHeader.fill = grayFill;

    for (let rNum = totalStartR; rNum <= totalEndR; rNum++) {
        sheet.getCell(rNum, 1).border = {
            top: rNum === totalStartR ? mediumBlack : undefined,
            bottom: rNum === totalEndR ? mediumBlack : undefined,
            left: thinBlack,
            right: thinBlack
        };
    }

    STANDARD_CATEGORIES.forEach((catName, idx) => {
        const rNum = totalStartR + idx;
        const row = sheet.getRow(rNum);
        row.height = 15.75;

        row.getCell(2).value = catName;
        row.getCell(2).alignment = { horizontal: "left" };
        row.getCell(2).font = { name: "Times New Roman", size: 10 };

        const cKeyNorm = normalizeKey(catName);
        const tot = totalCategorySums[cKeyNorm];

        const loansVal = tot && tot.loans ? tot.loans : 0;
        const accsVal = tot && tot.accounts ? tot.accounts : 0;

        row.getCell(3).value = loansVal;
        row.getCell(3).alignment = { horizontal: "left" };
        row.getCell(3).font = { name: "Times New Roman", size: 10 };

        row.getCell(4).value = accsVal;
        row.getCell(4).font = { name: "Calibri", size: 11 };

        // Columns E to H are blank for Total rows
        for (let c = 5; c <= 8; c++) {
            row.getCell(c).value = null;
        }

        for (let c = 2; c <= 8; c++) {
            row.getCell(c).border = {
                top: idx === 0 ? mediumBlack : thinBlack,
                bottom: rNum === totalEndR ? mediumBlack : thinBlack,
                left: thinBlack,
                // Thick red right border on the Total rows (rows 67-70)
                right: c === 8 ? thickRed : thinBlack
            };
        }
    });

    return workbook;
}




function sanitizeJsonPayload(payload: any): any {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => {
            if (!item) return item;
            const val = item.Value;
            const isZero = val === null || val === undefined || String(val).trim() === "";
            return {
                ...item,
                Value: isZero ? "0" : String(val).trim()
            };
        });
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const val = subItem.Value;
                    const isZero = val === null || val === undefined || String(val).trim() === "";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (val === null || val === undefined ? "" : String(val).trim())
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    const val = entry[k];
                    if (val === null || val === undefined || String(val).trim() === "") {
                        entry[k] = "0";
                    } else {
                        entry[k] = String(val).trim();
                    }
                });
            }
            return entry;
        });
    }
    return payload;
}



export async function processLCMWAC001Report(
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

        const rawJson = processLCMWAC001(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelLCMWAC001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing LCMWAC001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process LCMWAC001 report."
        };
    }
}

export const processMWAC001Report = processLCMWAC001Report;
export const processMWAC001 = processLCMWAC001;
export const jsonToExcelMWAC001 = jsonToExcelLCMWAC001;


