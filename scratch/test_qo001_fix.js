const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const ROWS_CONFIG = [
    { row: 16, section: "10", category: "Commitments to purchase  and/or sell FCY", defaultFactor: "1", defaultWeight: "1" },
    { row: 18, section: "11.1", category: "Federal government", defaultFactor: "1", defaultWeight: "0" },
    { row: 19, section: "11.2", category: "Regional government", defaultFactor: "1", defaultWeight: "0.2" },
    { row: 20, section: "11.3", category: "Bank (domestic/foreign)", defaultFactor: "1", defaultWeight: "0.2" },
    { row: 21, section: "11.4", category: "All others", defaultFactor: "1", defaultWeight: "1" },
    { row: 23, section: "12.1", category: "Federal government", defaultFactor: "0.5", defaultWeight: "0" },
    { row: 24, section: "12.2", category: "Regional government", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 25, section: "12.3", category: "Bank (domestic/foreign)", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 26, section: "12.4", category: "All other", defaultFactor: "0.5", defaultWeight: "1" },
    { row: 28, section: "13.1", category: "Federal government", defaultFactor: "0.5", defaultWeight: "0" },
    { row: 29, section: "13.2", category: "Regional government", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 30, section: "13.3", category: "Bank (domestic/foreign)", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 31, section: "13.4", category: "All others", defaultFactor: "0.5", defaultWeight: "1" },
    { row: 33, section: "14.1", category: "Federal government", defaultFactor: "0.2", defaultWeight: "0" },
    { row: 34, section: "14.2", category: "Regional government", defaultFactor: "0.2", defaultWeight: "0.2" },
    { row: 35, section: "14.3", category: "Bank (domestic/foreign)", defaultFactor: "0.2", defaultWeight: "0.2" },
    { row: 36, section: "14.4", category: "All others", defaultFactor: "0.2", defaultWeight: "1" },
    { row: 37, section: "15", category: "Others**", defaultFactor: "", defaultWeight: "" },
    { row: 38, section: "16", category: "Total Risk weighted Off - BSA", defaultFactor: "", defaultWeight: "" }
];

const COLS_CONFIG = [
    { col: "C", suffix: "Face Value" },
    { col: "D", suffix: "Credit Conv. Factor (%)" },
    { col: "E", suffix: "Amount" },
    { col: "F", suffix: "Weight (%)" },
    { col: "G", suffix: "Credit Equ" }
];

function getDirectCellValue(cell) {
    if (!cell || cell.value === null || cell.value === undefined) return "";
    let val = cell.value;
    if (typeof val === "object" && val !== null) {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && "error" in val.result) return "";
            return String(val.result).trim();
        }
        if ("text" in val && val.text) return String(val.text).trim();
        return "";
    }
    const str = String(val).trim();
    return str === "[object Object]" ? "" : str;
}

async function testExtraction() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(process.cwd(), 'templates', 'QO001.xlsx'));
    const ws = wb.getWorksheet("CAP_ADQ_OFB_QO001") || wb.worksheets[0];

    const valuesByCode = {};
    let totalFaceVal = 0;
    let totalAmount = 0;
    let totalCreditEqu = 0;
    let hasAnyInput = false;

    let itemCounter = 1;

    ROWS_CONFIG.forEach(r => {
        if (r.row === 38) {
            // Total row handled after loop
            return;
        }

        const cellC = getDirectCellValue(ws.getRow(r.row).getCell("C"));
        const cellD = getDirectCellValue(ws.getRow(r.row).getCell("D"));
        const cellE = getDirectCellValue(ws.getRow(r.row).getCell("E"));
        const cellF = getDirectCellValue(ws.getRow(r.row).getCell("F"));
        const cellG = getDirectCellValue(ws.getRow(r.row).getCell("G"));

        // If Face Value cell is empty/blank
        if (!cellC || cellC === "") {
            for (let cIdx = 0; cIdx < 5; cIdx++) {
                const codeNum = String(itemCounter++).padStart(5, "0");
                valuesByCode[`12_${codeNum}`] = "";
            }
        } else {
            hasAnyInput = true;
            const faceValNum = parseFloat(cellC) || 0;
            totalFaceVal += faceValNum;

            const factorStr = cellD || r.defaultFactor || "";
            const factorNum = parseFloat(factorStr) || 0;

            let amountNum = parseFloat(cellE);
            if (isNaN(amountNum)) {
                amountNum = faceValNum * factorNum;
            }
            totalAmount += amountNum;

            const weightStr = cellF || r.defaultWeight || "";
            const weightNum = parseFloat(weightStr) || 0;

            let creditEquNum = parseFloat(cellG);
            if (isNaN(creditEquNum)) {
                creditEquNum = amountNum * weightNum;
            }
            totalCreditEqu += creditEquNum;

            // 5 items for this row
            const codeC = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeD = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeE = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeF = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeG = `12_${String(itemCounter++).padStart(5, "0")}`;

            valuesByCode[codeC] = String(cellC);
            valuesByCode[codeD] = factorStr;
            valuesByCode[codeE] = String(amountNum);
            valuesByCode[codeF] = weightStr;
            valuesByCode[codeG] = String(creditEquNum);
        }
    });

    // Row 38 Total Row (items 12_00091 to 12_00095)
    const code91 = `12_00091`;
    const code92 = `12_00092`;
    const code93 = `12_00093`;
    const code94 = `12_00094`;
    const code95 = `12_00095`;

    valuesByCode[code91] = hasAnyInput ? String(totalFaceVal) : "";
    valuesByCode[code92] = "";
    valuesByCode[code93] = hasAnyInput ? String(totalAmount) : "";
    valuesByCode[code94] = "";
    valuesByCode[code95] = hasAnyInput ? String(totalCreditEqu) : "";

    console.log("Extraction results on blank QO001.xlsx template:");
    console.log("hasAnyInput:", hasAnyInput);
    console.log("Non-empty values count:", Object.values(valuesByCode).filter(v => v !== "").length);
}

testExtraction().catch(console.error);
