const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

function getDirectCellValue(cell) {
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
            return val.richText.map((t) => (t && t.text ? t.text : "")).join("").trim();
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

const QO001_ROWS_CONFIG = [
    { row: 16, defaultFactor: "1", defaultWeight: "1" },
    { row: 18, defaultFactor: "1", defaultWeight: "0" },
    { row: 19, defaultFactor: "1", defaultWeight: "0.2" },
    { row: 20, defaultFactor: "1", defaultWeight: "0.2" },
    { row: 21, defaultFactor: "1", defaultWeight: "1" },
    { row: 23, defaultFactor: "0.5", defaultWeight: "0" },
    { row: 24, defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 25, defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 26, defaultFactor: "0.5", defaultWeight: "1" },
    { row: 28, defaultFactor: "0.5", defaultWeight: "0" },
    { row: 29, defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 30, defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 31, defaultFactor: "0.5", defaultWeight: "1" },
    { row: 33, defaultFactor: "0.2", defaultWeight: "0" },
    { row: 34, defaultFactor: "0.2", defaultWeight: "0.2" },
    { row: 35, defaultFactor: "0.2", defaultWeight: "0.2" },
    { row: 36, defaultFactor: "0.2", defaultWeight: "1" },
    { row: 37, defaultFactor: "", defaultWeight: "" },
    { row: 38, defaultFactor: "", defaultWeight: "" }
];

async function testExtraction() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.resolve('templates/QO001.xlsx');
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];

    const valuesByCode = {};
    let itemCounter = 1;

    let totalFaceVal = 0;
    let totalAmount = 0;
    let totalCreditEqu = 0;
    let hasAnyInput = false;

    QO001_ROWS_CONFIG.forEach(r => {
        if (r.row === 38) return;

        const rawC = getDirectCellValue(ws.getRow(r.row).getCell("C")).trim().replace(/,/g, "");
        const rawD = getDirectCellValue(ws.getRow(r.row).getCell("D")).trim().replace(/,/g, "");
        const rawE = getDirectCellValue(ws.getRow(r.row).getCell("E")).trim().replace(/,/g, "");
        const rawF = getDirectCellValue(ws.getRow(r.row).getCell("F")).trim().replace(/,/g, "");
        const rawG = getDirectCellValue(ws.getRow(r.row).getCell("G")).trim().replace(/,/g, "");

        // Determine value for C (Face Value)
        const valC = rawC;
        const numC = valC !== "" ? parseFloat(valC) : NaN;
        if (!isNaN(numC)) {
            totalFaceVal += numC;
            hasAnyInput = true;
        }

        // Determine value for D (CCF)
        let valD = rawD !== "" ? rawD : (r.defaultFactor !== "" ? r.defaultFactor : "");
        let factorNum = valD !== "" ? parseFloat(valD.replace("%", "")) : NaN;
        if (!isNaN(factorNum) && factorNum > 1) factorNum /= 100;

        // Determine value for E (Amount)
        let valE = rawE;
        if (valE === "" && !isNaN(numC) && !isNaN(factorNum)) {
            const amountNum = numC * factorNum;
            valE = String(amountNum);
        }
        const numE = valE !== "" ? parseFloat(valE) : NaN;
        if (!isNaN(numE)) {
            totalAmount += numE;
        }

        // Determine value for F (Weight)
        let valF = rawF !== "" ? rawF : (r.defaultWeight !== "" ? r.defaultWeight : "");
        let weightNum = valF !== "" ? parseFloat(valF.replace("%", "")) : NaN;
        if (!isNaN(weightNum) && weightNum > 1) weightNum /= 100;

        // Determine value for G (Credit Equ)
        let valG = rawG;
        if (valG === "" && !isNaN(numE) && !isNaN(weightNum)) {
            const creditEquNum = numE * weightNum;
            valG = String(creditEquNum);
        }
        const numG = valG !== "" ? parseFloat(valG) : NaN;
        if (!isNaN(numG)) {
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

    // Row 38 Total Row
    const rawC38 = getDirectCellValue(ws.getRow(38).getCell("C")).trim().replace(/,/g, "");
    const rawE38 = getDirectCellValue(ws.getRow(38).getCell("E")).trim().replace(/,/g, "");
    const rawG38 = getDirectCellValue(ws.getRow(38).getCell("G")).trim().replace(/,/g, "");

    valuesByCode["12_00091"] = rawC38 !== "" ? rawC38 : (totalFaceVal > 0 ? String(totalFaceVal) : "");
    valuesByCode["12_00092"] = "";
    valuesByCode["12_00093"] = rawE38 !== "" ? rawE38 : (totalAmount > 0 ? String(totalAmount) : "");
    valuesByCode["12_00094"] = "";
    valuesByCode["12_00095"] = rawG38 !== "" ? rawG38 : (totalCreditEqu > 0 ? String(totalCreditEqu) : "");

    console.log(JSON.stringify(valuesByCode, null, 2));
}

testExtraction().catch(console.error);
