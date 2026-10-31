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

async function runTest() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.resolve('templates/FB001 (1).xlsx');
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];

    const valuesMap = {};

    for (let i = 1; i <= 109; i++) {
        const code = `28_${String(i).padStart(5, "0")}`;
        const rowNum = 14 + i; // row 15 is index 1 (28_00001), row 16 is index 2 (28_00002)...
        const cellVal = getDirectCellValue(ws.getRow(rowNum).getCell("C")).replace(/,/g, "").trim();
        valuesMap[code] = cellVal !== "" ? cellVal : "0";
    }

    console.log("Sample extracted items:");
    console.log("28_00002 (Financial Assets):", valuesMap["28_00002"]);
    console.log("28_00003 (Cash on hand):", valuesMap["28_00003"]);
    console.log("28_00004 (Foreign currency):", valuesMap["28_00004"]);
    console.log("28_00005 (Local currency):", valuesMap["28_00005"]);
    console.log("28_00030 (Receivables):", valuesMap["28_00030"]);
    console.log("28_00031 (Accounts rec):", valuesMap["28_00031"]);
    console.log("28_00034 (Other rec):", valuesMap["28_00034"]);
    console.log("28_00035 (Net Loans):", valuesMap["28_00035"]);
    console.log("28_00036 (Trade financing):", valuesMap["28_00036"]);
    console.log("28_00037 (Murabaha):", valuesMap["28_00037"]);
    console.log("28_00045 (Less provisions):", valuesMap["28_00045"]);
    console.log("28_00046 (Inventories):", valuesMap["28_00046"]);
    console.log("28_00047 (Inventories trade):", valuesMap["28_00047"]);
    console.log("28_00049 (Supplies stock):", valuesMap["28_00049"]);
    console.log("28_00061 (Suspense inter branch):", valuesMap["28_00061"]);
    console.log("28_00062 (Total Assets):", valuesMap["28_00062"]);
    console.log("28_00065 (Deposits):", valuesMap["28_00065"]);
    console.log("28_00066 (Current acc):", valuesMap["28_00066"]);
    console.log("28_00067 (Private sector):", valuesMap["28_00067"]);
    console.log("28_00068 (Coop):", valuesMap["28_00068"]);
    console.log("28_00069 (Public enterp):", valuesMap["28_00069"]);
    console.log("28_00074 (Saving acc):", valuesMap["28_00074"]);
    console.log("28_00075 (Private sector saving):", valuesMap["28_00075"]);
    console.log("28_00082 (Payable):", valuesMap["28_00082"]);
    console.log("28_00083 (Accounts payable):", valuesMap["28_00083"]);
    console.log("28_00085 (Payable charity):", valuesMap["28_00085"]);
    console.log("28_00091 (Other payables):", valuesMap["28_00091"]);
    console.log("28_00092 (Inv account holders):", valuesMap["28_00092"]);
    console.log("28_00096 (Unrestricted inv):", valuesMap["28_00096"]);
    console.log("28_00097 (Time bounded):", valuesMap["28_00097"]);
    console.log("28_00098 (Non time bounded):", valuesMap["28_00098"]);
    console.log("28_00099 (Reserves):", valuesMap["28_00099"]);
    console.log("28_00101 (Inv risk reserve):", valuesMap["28_00101"]);
    console.log("28_00105 (Total liabilities):", valuesMap["28_00105"]);
    console.log("28_00109 (Liabilities & equity):", valuesMap["28_00109"]);
}

runTest().catch(console.error);
