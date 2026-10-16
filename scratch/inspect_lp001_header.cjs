const ExcelJS = require('exceljs');
const path = require('path');

async function run() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.resolve('templates/LP001.xlsx');
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    console.log(`=== Rows 1 to 12 of ${ws.name} ===`);
    for (let r = 1; r <= 12; r++) {
        const rowVals = [];
        for (let c = 1; c <= 10; c++) {
            const cell = ws.getCell(r, c);
            let val = cell.value;
            if (val && typeof val === 'object') {
                if (val.result !== undefined) val = val.result;
                else if (val.richText) val = val.richText.map(t => t.text).join('');
                else if (val.text) val = val.text;
                else val = JSON.stringify(val);
            }
            rowVals.push(val !== null && val !== undefined ? String(val).trim() : '');
        }
        console.log(`Row ${String(r).padStart(2, ' ')}: ${rowVals.join(' | ')}`);
    }
}
run().catch(console.error);
