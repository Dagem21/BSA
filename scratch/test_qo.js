const ExcelJS = require('exceljs');
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
    return "";
}

async function run() {
  const wb = new ExcelJS.Workbook();
  const filePath = path.resolve('templates/QO001.xlsx');
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  console.log('Worksheet name:', ws.name);
  for (let r = 16; r <= 38; r++) {
    const row = ws.getRow(r);
    ['C', 'D', 'E', 'F', 'G'].forEach(col => {
      const cell = row.getCell(col);
      const rawVal = getDirectCellValue(cell);
      console.log(`R${r} C${col}: raw=${JSON.stringify(rawVal)}, cellValue=${JSON.stringify(cell.value)}`);
    });
  }
}
run().catch(console.error);
