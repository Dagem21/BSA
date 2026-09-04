const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

function formatIsoString(dateVal) {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) {
        const datePart = str.split("T")[0];
        return `${datePart}T00:00:00`;
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    return str;
}

function getCellValue(cell) {
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
            if (typeof val.result === "object") {
                if ("error" in val.result) return "";
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
        if (typeof cell.result === "object") return "";
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

async function runTest() {
    const inputFilePath = './reports/excel/ZS001_20260828_14.xlsx';
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);

    const worksheet = workbook.getWorksheet("NBE") || workbook.getWorksheet("ZS001") || workbook.worksheets[0];

    const rowMatchers = [
        (c, d) => c === "1.1" || (d.includes("net current liabilities") && !d.includes("15%")),
        (c, d) => c === "2.1" || d.includes("cash - local"),
        (c, d) => c === "2.2" || d.includes("deposits with nbe"),
        (c, d) => c === "2.3" || d.includes("deposits with other"),
        (c, d) => c === "2.4" || d.includes("treasury bills"),
        (c, d) => c === "2.5" || d.includes("net due from domestic"),
        (c, d) => c === "2.6" || d.includes("net due from foreign"),
        (c, d) => c === "2.7" || d.includes("total liquid assets"),
        (c, d) => c === "3" || d.includes("excess/deficit")
    ];

    const categoryRows = new Array(9).fill(null);
    const fallbackRows = [17, 20, 21, 22, 23, 24, 25, 26, 27];

    for (let r = 1; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const code = getCellValue(row.getCell(2));
        const desc = getCellValue(row.getCell(3)).toLowerCase();

        rowMatchers.forEach((matcher, catIdx) => {
            if (categoryRows[catIdx] === null && matcher(code, desc)) {
                categoryRows[catIdx] = r;
            }
        });
    }

    const finalCategoryRows = categoryRows.map((r, i) => r ?? fallbackRows[i]);

    let startCol = 4;
    for (let r = 1; r <= 20; r++) {
        const row = worksheet.getRow(r);
        for (let c = 1; c <= 15; c++) {
            const val = getCellValue(row.getCell(c)).toLowerCase();
            if (val === "thu" || val === "thursday") {
                startCol = c;
                break;
            }
        }
    }

    const ZS001_ROW_DESCRIPTIONS = [
        "Net current liabilities",
        "Cash - local and foreign currency",
        "Deposits with NBE",
        "Deposits with other local & foreign banks",
        "Treasury bills",
        "Net due from Domestic banks*",
        "Net due from Foreign banks*",
        "Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6)",
        "Excess/deficit (2.7-1.2)"
    ];

    const ZS001_COL_SUFFIXES = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Weekly Average"];

    const returnItems = [];
    let codeCounter = 1;

    finalCategoryRows.forEach((excelRow, rowIdx) => {
        const rowDesc = ZS001_ROW_DESCRIPTIONS[rowIdx];
        const isNetDueRow = rowDesc.includes("Net due from Domestic") || rowDesc.includes("Net due from Foreign");
        ZS001_COL_SUFFIXES.forEach((colSuffix, colIdx) => {
            const excelCol = startCol + colIdx;
            const cell = worksheet.getRow(excelRow).getCell(excelCol);
            let valStr = getCellValue(cell);

            if (isNetDueRow && (!valStr || valStr === "")) {
                valStr = "0";
            }

            const codeStr = `109_${codeCounter.toString().padStart(5, "0")}`;
            codeCounter++;

            returnItems.push({
                Code: codeStr,
                Value: valStr,
                _description: `${rowDesc}_${colSuffix}`,
                _dataType: "NUMERIC",
                _required: false
            });
        });
    });

    const jsonOutput = {
        ReturnKey: "LSR-Statutory ZS001",
        InstCode: "0000001",
        FinYear: 2026,
        StartDate: "2026-08-27T00:00:00",
        EndDate: "2026-09-02T00:00:00",
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };

    console.log("Extracted ReturnItemsList count:", jsonOutput.ReturnItemsList.length);
    console.log("Item 41 (Net due Domestic_Thu):", JSON.stringify(jsonOutput.ReturnItemsList[40], null, 2));
    console.log("Item 49 (Net due Foreign_Thu):", JSON.stringify(jsonOutput.ReturnItemsList[48], null, 2));
}

runTest();
