const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

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

async function testNewRule() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(process.cwd(), 'templates', 'QO001.xlsx'));
    const ws = wb.getWorksheet("CAP_ADQ_OFB_QO001") || wb.worksheets[0];

    const valuesByCode = {};
    let totalFaceVal = 0;
    let totalAmount = 0;
    let totalCreditEqu = 0;
    let hasAnyInput = false;
    let itemCounter = 1;

    QO001_ROWS_CONFIG.forEach((r) => {
        if (r.row === 38) return;

        const rawC = getDirectCellValue(ws.getRow(r.row).getCell("C")).trim();
        const cleanC = rawC.replace(/,/g, "");

        const rawD = getDirectCellValue(ws.getRow(r.row).getCell("D")).trim();
        const cleanD = rawD.replace(/,/g, "");

        const rawE = getDirectCellValue(ws.getRow(r.row).getCell("E")).trim();
        const cleanE = rawE.replace(/,/g, "");

        const rawF = getDirectCellValue(ws.getRow(r.row).getCell("F")).trim();
        const cleanF = rawF.replace(/,/g, "");

        const rawG = getDirectCellValue(ws.getRow(r.row).getCell("G")).trim();
        const cleanG = rawG.replace(/,/g, "");

        const numC = cleanC !== "" ? parseFloat(cleanC) : NaN;

        // Key rule: A row has active Face Value data ONLY IF Face Value cell C is present AND > 0
        const hasFaceVal = !isNaN(numC) && numC > 0;

        if (!hasFaceVal) {
            for (let cIdx = 0; cIdx < 5; cIdx++) {
                const codeNum = String(itemCounter++).padStart(5, "0");
                valuesByCode[`12_${codeNum}`] = "";
            }
        } else {
            hasAnyInput = true;

            const valC = cleanC;
            totalFaceVal += numC;

            const valD = cleanD !== "" ? cleanD : (r.defaultFactor || "");
            let factorNum = parseFloat(valD.replace("%", "")) || 0;
            if (factorNum > 1) factorNum = factorNum / 100;

            const numE = cleanE !== "" ? parseFloat(cleanE) : NaN;
            let amountNum = (!isNaN(numE) && numE !== 0) ? numE : (numC * factorNum);
            const valE = String(amountNum);
            totalAmount += amountNum;

            const valF = cleanF !== "" ? cleanF : (r.defaultWeight || "");
            let weightNum = parseFloat(valF.replace("%", "")) || 0;
            if (weightNum > 1) weightNum = weightNum / 100;

            const numG = cleanG !== "" ? parseFloat(cleanG) : NaN;
            let creditEquNum = (!isNaN(numG) && numG !== 0) ? numG : (amountNum * weightNum);
            const valG = String(creditEquNum);
            totalCreditEqu += creditEquNum;

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
        }
    });

    const rawC38 = getDirectCellValue(ws.getRow(38).getCell("C")).trim().replace(/,/g, "");
    const rawE38 = getDirectCellValue(ws.getRow(38).getCell("E")).trim().replace(/,/g, "");
    const rawG38 = getDirectCellValue(ws.getRow(38).getCell("G")).trim().replace(/,/g, "");

    valuesByCode["12_00091"] = rawC38 !== "" && parseFloat(rawC38) !== 0 ? rawC38 : (hasAnyInput && totalFaceVal !== 0 ? String(totalFaceVal) : "");
    valuesByCode["12_00092"] = "";
    valuesByCode["12_00093"] = rawE38 !== "" && parseFloat(rawE38) !== 0 ? rawE38 : (hasAnyInput && totalAmount !== 0 ? String(totalAmount) : "");
    valuesByCode["12_00094"] = "";
    valuesByCode["12_00095"] = rawG38 !== "" && parseFloat(rawG38) !== 0 ? rawG38 : (hasAnyInput && totalCreditEqu !== 0 ? String(totalCreditEqu) : "");

    console.log("Check row 35 (Bank domestic/foreign commercial LC, items 12_00076..12_00080):");
    console.log({
        "12_00076": valuesByCode["12_00076"],
        "12_00077": valuesByCode["12_00077"],
        "12_00078": valuesByCode["12_00078"],
        "12_00079": valuesByCode["12_00079"],
        "12_00080": valuesByCode["12_00080"],
    });

    console.log("\nCheck row 36 (All others commercial LC, items 12_00081..12_00085):");
    console.log({
        "12_00081": valuesByCode["12_00081"],
        "12_00082": valuesByCode["12_00082"],
        "12_00083": valuesByCode["12_00083"],
        "12_00084": valuesByCode["12_00084"],
        "12_00085": valuesByCode["12_00085"],
    });

    console.log("\nTotals:");
    console.log({
        TotalFaceVal: valuesByCode["12_00091"],
        TotalAmount: valuesByCode["12_00093"],
        TotalCreditEqu: valuesByCode["12_00095"],
    });
}

testNewRule().catch(console.error);
