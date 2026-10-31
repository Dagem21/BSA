const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function run() {
  const wb = new ExcelJS.Workbook();
  const filePath = path.resolve('templates/FB001 (1).xlsx');
  console.log('File path:', filePath);
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  console.log('Worksheet name:', ws.name);
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const colA = row.getCell(1).value;
    const colB = row.getCell(2).value;
    const colC = row.getCell(3).value;
    if (colA || colB || colC) {
      console.log(`Row ${r}: A=${JSON.stringify(colA)}, B=${JSON.stringify(colB)}, C=${JSON.stringify(colC)}`);
    }
  }
}
run().catch(console.error);
