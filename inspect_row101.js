const ExcelJS = require("exceljs");
const path = require("path");

async function inspectRow101() {
    const wb = new ExcelJS.Workbook();
    const fp = path.join(__dirname, "templates", "LOAN_RAN & REGRL002.xlsx");
    await wb.xlsx.readFile(fp);
    const ws = wb.getWorksheet(1);

    const row101 = ws.getRow(101);
    console.log("Row 101 Col A:", row101.getCell(1).value);
    console.log("Row 101 Col B:", row101.getCell(2).value);

    for (let c = 3; c <= 26; c++) {
        const cell = row101.getCell(c);
        console.log(`Col ${c} (${String.fromCharCode(64 + c)}101): value =`, JSON.stringify(cell.value), "| result =", cell.result, "| text =", cell.text);
    }
}

inspectRow101().catch(err => console.error(err));
