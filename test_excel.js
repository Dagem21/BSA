const ExcelJS = require("exceljs");
const path = require("path");

async function run() {
    console.log("Starting...");
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("TestSheet");
        worksheet.getCell("A1").value = "Hello World";
        const out = path.join(__dirname, "test_excel.xlsx");
        await workbook.xlsx.writeFile(out);
        console.log("Wrote to", out);
    } catch(e) {
        console.error("Error:", e);
    }
}
run();
