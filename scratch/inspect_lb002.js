const ExcelJS = require('exceljs');
const path = require('path');

async function run() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, '..', 'templates', 'LB002 (5).xlsx');
    await wb.xlsx.readFile(filePath);
    wb.worksheets.forEach(ws => {
        console.log('Sheet name:', ws.name);
        for (let r = 1; r <= 35; r++) {
            const rowVals = [];
            for (let c = 1; c <= 15; c++) {
                const val = ws.getRow(r).getCell(c).value;
                rowVals.push(val === null ? "" : String(val));
            }
            if (rowVals.some(v => v !== "")) {
                console.log(`Row ${r}:`, rowVals.filter(v => v !== "").join(" | "));
            }
        }
    });
}
run().catch(console.error);
