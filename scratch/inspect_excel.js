const ExcelJS = require('exceljs');
const path = require('path');

async function check() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'test_out.xlsx');
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    console.log('Worksheet name:', ws.name);
    for (let r = 7; r <= 10; r++) {
        const rowVals = [];
        for (let c = 1; c <= 13; c++) {
            const val = ws.getRow(r).getCell(c).value;
            rowVals.push(val === null ? "" : String(val));
        }
        if (rowVals.some(v => v !== "")) {
            console.log(`Row ${r}:`, rowVals.join(' | '));
        }
    }
}
check().catch(console.error);
