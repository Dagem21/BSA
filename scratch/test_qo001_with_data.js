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

async function testWithData() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(process.cwd(), 'templates', 'QO001.xlsx'));
    const ws = wb.getWorksheet("CAP_ADQ_OFB_QO001") || wb.worksheets[0];

    // Put values in row 23 (Loan commitments - Federal government) and row 26 (Loan commitments - All other)
    ws.getCell("C23").value = 7065.27383917;
    ws.getCell("C26").value = 108526.8295061;

    const valuesByCode = {};
    let totalFaceVal = 0;
    let totalAmount = 0;
    let totalCreditEqu = 0;
    let hasAnyInput = false;

    let itemCounter = 1;

    ROWS_CONFIG.forEach(r => {
        if (r.row === 38) {
            return;
        }

        const cellC = getDirectCellValue(ws.getRow(r.row).getCell("C"));
        const cellD = getDirectCellValue(ws.getRow(r.row).getCell("D"));
        const cellE = getDirectCellValue(ws.getRow(r.row).getCell("E"));
        const cellF = getDirectCellValue(ws.getRow(r.row).getCell("F"));
        const cellG = getDirectCellValue(ws.getRow(r.row).getCell("G"));

        const faceValNum = cellC ? parseFloat(cellC) : NaN;

        if (isNaN(faceValNum) || cellC === "") {
            for (let cIdx = 0; cIdx < 5; cIdx++) {
                const codeNum = String(itemCounter++).padStart(5, "0");
                valuesByCode[`12_${codeNum}`] = "";
            }
        } else {
            hasAnyInput = true;
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

    const code91 = `12_00091`;
    const code92 = `12_00092`;
    const code93 = `12_00093`;
    const code94 = `12_00094`;
    const code95 = `12_00095`;

    valuesByCode[code91] = hasAnyInput && totalFaceVal !== 0 ? String(totalFaceVal) : "";
    valuesByCode[code92] = "";
    valuesByCode[code93] = hasAnyInput && totalAmount !== 0 ? String(totalAmount) : "";
    valuesByCode[code94] = "";
    valuesByCode[code95] = hasAnyInput && totalCreditEqu !== 0 ? String(totalCreditEqu) : "";

    console.log("Values for row 23 (12_00026..12_00030):", {
        "12_00026": valuesByCode["12_00026"],
        "12_00027": valuesByCode["12_00027"],
        "12_00028": valuesByCode["12_00028"],
        "12_00029": valuesByCode["12_00029"],
        "12_00030": valuesByCode["12_00030"],
    });

    console.log("Values for row 16 (12_00001..12_00005) [blank row]:", {
        "12_00001": valuesByCode["12_00001"],
        "12_00002": valuesByCode["12_00002"],
        "12_00003": valuesByCode["12_00003"],
        "12_00004": valuesByCode["12_00004"],
        "12_00005": valuesByCode["12_00005"],
    });

    console.log("Total Credit Equ (12_00095):", valuesByCode["12_00095"]);
}

testWithData().catch(console.error);
