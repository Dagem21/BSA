const ExcelJS = require("exceljs");
const path = require("path");

async function main() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(process.cwd(), "templates", "NN001.xlsx"));
    console.log("Sheet names:", wb.worksheets.map(w => w.name));
    const ws = wb.worksheets[0];
    console.log("A1:", ws.getCell("A1").value);
    console.log("A4:", ws.getCell("A4").value);
    console.log("Row 14 headers:", [1,2,3,4,5,6,7,8,9,10].map(c => ws.getRow(14).getCell(c).value));
    console.log("Row 15 headers:", [1,2,3,4,5,6,7,8,9,10].map(c => ws.getRow(15).getCell(c).value));
    console.log("Row 166 (Totals):", [1,2,3,4,5,6,7,8,9,10].map(c => ws.getRow(166).getCell(c).value));
}

main().catch(err => console.error("Error:", err));
