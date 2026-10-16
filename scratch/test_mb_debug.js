const ExcelJS = require('exceljs');
const fs = require('fs');

async function debug() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile('./templates/MB001.xlsx');
    const ws = wb.getWorksheet("NBE") || wb.getWorksheet("BSD Monthly  Balance Sheet") || wb.worksheets[0];
    console.log("Worksheet name:", ws.name);
    console.log("Total rows:", ws.rowCount);
}

debug().catch(console.error);
