const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function run() {
  const wb = new ExcelJS.Workbook();
  const filePath = path.resolve('templates/QI001.xlsx');
  console.log('File path:', filePath);
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  console.log('Worksheet name:', ws.name);
  for (let r = 16; r <= 39; r++) {
    const row = ws.getRow(r);
    const c = row.getCell('C').value;
    const d = row.getCell('D').value;
    const e = row.getCell('E').value;
    console.log(`Row ${r}: C=${JSON.stringify(c)}, D=${JSON.stringify(d)}, E=${JSON.stringify(e)}`);
  }
}
run().catch(console.error);
