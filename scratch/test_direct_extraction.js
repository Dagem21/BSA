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
    { row: 16, category: "Commitments to purchase  and/or sell FCY" },
    { row: 18, category: "Federal government" },
    { row: 19, category: "Regional government" },
    { row: 20, category: "Bank (domestic/foreign)" },
    { row: 21, category: "All others" },
    { row: 23, category: "Federal government" },
    { row: 24, category: "Regional government" },
    { row: 25, category: "Bank (domestic/foreign)" },
    { row: 26, category: "All other" },
    { row: 28, category: "Federal government" },
    { row: 29, category: "Regional government" },
    { row: 30, category: "Bank (domestic/foreign)" },
    { row: 31, category: "All others" },
    { row: 33, category: "Federal government" },
    { row: 34, category: "Regional government" },
    { row: 35, category: "Bank (domestic/foreign)" },
    { row: 36, category: "All others" },
    { row: 37, category: "Others**" },
    { row: 38, category: "Total Risk weighted Off - BSA" }
];

const COLS_CONFIG = [
    { col: "C", suffix: "Face Value" },
    { col: "D", suffix: "Credit Conv. Factor (%)" },
    { col: "E", suffix: "Amount" },
    { col: "F", suffix: "Weight (%)" },
    { col: "G", suffix: "Credit Equ" }
];

const QO001_DESCRIPTIONS = [];
let itemCounter = 1;
QO001_ROWS_CONFIG.forEach((r) => {
    COLS_CONFIG.forEach((c) => {
        const codeNum = String(itemCounter++).padStart(5, "0");
        QO001_DESCRIPTIONS.push({
            code: `12_${codeNum}`,
            desc: `${r.category}_${c.suffix}`,
            excelRow: r.row,
            excelCol: c.col
        });
    });
});

async function main() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(process.cwd(), 'templates', 'QO001.xlsx'));
    const ws = wb.getWorksheet("CAP_ADQ_OFB_QO001") || wb.worksheets[0];

    const jsonTemplate = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'templates', 'json', 'QO001.json'), 'utf8'));

    const returnItems = jsonTemplate.ReturnItemsList.map((itemDef) => {
        const match = QO001_DESCRIPTIONS.find((d) => d.code === itemDef.Code);
        let val = "";
        if (match) {
            const rawVal = getDirectCellValue(ws.getRow(match.excelRow).getCell(match.excelCol));
            val = rawVal.replace(/,/g, "").trim();
        }
        return {
            Code: itemDef.Code,
            Value: val,
            _description: itemDef._description,
            _dataType: itemDef._dataType || "NUMERIC"
        };
    });

    const result = {
        ReturnKey: "CAP_ADQ_OFB_QO001",
        InstCode: "0000001",
        FinYear: 2026,
        StartDate: "2026-07-01T00:00:00",
        EndDate: "2026-09-30T00:00:00",
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };

    console.log("Direct extraction on QO001.xlsx:");
    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
