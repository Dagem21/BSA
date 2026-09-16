const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function test() {
    const filePath = path.join(__dirname, '../templates/MWAC001.xlsx');
    let out = [];
    out.push('Reading: ' + filePath);
    out.push('Exists: ' + fs.existsSync(filePath));
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    out.push('Worksheets: ' + wb.worksheets.map(w => w.name).join(', '));
    const ws = wb.worksheets[0];
    out.push('Row count: ' + ws.rowCount);
    for (let i = 1; i <= Math.min(100, ws.rowCount); i++) {
        const row = ws.getRow(i);
        const vals = [];
        for (let j = 1; j <= 10; j++) {
            const cell = row.getCell(j);
            let val = cell.value;
            if (val && typeof val === 'object') {
                if (val.result !== undefined) val = val.result;
                else if (val.richText) val = val.richText.map(r => r.text).join('');
                else val = JSON.stringify(val);
            }
            vals.push(val);
        }
        if (vals.some(v => v !== null && v !== undefined && v !== '')) {
            out.push(`Row ${i}: ${vals.map(v => String(v ?? '')).join(' | ')}`);
        }
    }
    fs.writeFileSync(path.join(__dirname, 'mwac_info.txt'), out.join('\n'));
}
test().catch(err => {
    fs.writeFileSync(path.join(__dirname, 'mwac_info.txt'), err.stack || String(err));
});
