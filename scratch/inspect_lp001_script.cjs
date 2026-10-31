const ExcelJS = require('exceljs');
const path = require('path');

async function run() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.resolve('templates/LP001.xlsx');
    console.log('Reading file:', filePath);
    await wb.xlsx.readFile(filePath);
    wb.worksheets.forEach((ws, idx) => {
        console.log(`=== Sheet index ${idx}: "${ws.name}" ===`);
        for (let r = 1; r <= 65; r++) {
            const rowVals = [];
            for (let c = 1; c <= 15; c++) {
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
            if (rowVals.some(v => v !== '')) {
                console.log(`Row ${String(r).padStart(2, ' ')}: ${rowVals.join(' | ')}`);
            }
        }
    });
}
run().catch(console.error);
