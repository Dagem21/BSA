const ExcelJS = require('exceljs');
const path = require('path');

async function createExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('MWAL001');

    // Header metadata
    worksheet.getCell('A4').value = "NATIONAL BANK OF ETHIOPIA";
    worksheet.getCell('A5').value = "Institution Code";
    worksheet.getCell('B5').value = "0000001";
    worksheet.getCell('A6').value = "Financial Year";
    worksheet.getCell('B6').value = 2026;
    worksheet.getCell('A7').value = "Start Date";
    worksheet.getCell('B7').value = "2026-08-01";
    worksheet.getCell('A8').value = "End Date";
    worksheet.getCell('B8').value = "2026-08-31";

    // Table Headers (Row 13)
    const headers = [
        "Sector",
        "Loan Category",
        "Outstanding Loan & Advance (in Mn Birr)",
        "No. of Loan Accounts by Loan Category",
        "Lending Interest Rates (% per annum)",
        "Lending Interest Rates (% per annum) _Maximum Rate",
        "Lending Interest Rates (% per annum)_ Weighted",
        "Lending Interest Rates (% per annum)_Weighted Average Rate"
    ];

    for (let i = 0; i < headers.length; i++) {
        worksheet.getCell(13, i + 1).value = headers[i];
    }

    // Sample Data starting at Row 14
    const sampleRows = [
        ["Agriculture", "Short Term", 150.50, 245, 8.50, 14.00, 11.25, 11.50],
        ["Manufacturing", "Long Term", 820.10, 110, 7.50, 15.00, 12.00, 12.25],
        ["Construction", "Medium Term", 430.75, 315, 9.00, 16.50, 13.10, 13.20],
        ["Trade", "Overdraft", 950.00, 540, 10.00, 18.00, 14.50, 14.75],
        ["Hotels and Tourism", "Long Term", 210.30, 85, 8.00, 14.50, 11.80, 11.90]
    ];

    for (let r = 0; r < sampleRows.length; r++) {
        for (let c = 0; c < sampleRows[r].length; c++) {
            worksheet.getCell(14 + r, c + 1).value = sampleRows[r][c];
        }
    }

    // Generate remaining 40 rows programmatically
    const sectors = ["Financial Institutions", "Real Estate", "Personal Loans", "Mining and Quarrying", "Health and Education", "Others"];
    const cats = ["Short Term", "Medium Term", "Long Term", "Overdraft"];
    for(let r = 5; r < 45; r++) {
        worksheet.getCell(14 + r, 1).value = sectors[Math.floor(Math.random() * sectors.length)];
        worksheet.getCell(14 + r, 2).value = cats[Math.floor(Math.random() * cats.length)];
        worksheet.getCell(14 + r, 3).value = +(Math.random() * 1000 + 50).toFixed(2);
        worksheet.getCell(14 + r, 4).value = Math.floor(Math.random() * 500) + 10;
        worksheet.getCell(14 + r, 5).value = +(Math.random() * 5 + 7).toFixed(2);
        worksheet.getCell(14 + r, 6).value = +(Math.random() * 5 + 13).toFixed(2);
        worksheet.getCell(14 + r, 7).value = +(Math.random() * 3 + 10).toFixed(2);
        worksheet.getCell(14 + r, 8).value = +(Math.random() * 2 + 11).toFixed(2);
    }

    const outputPath = path.join(__dirname, "MWAL001_45_Rows_Template.xlsx");
    await workbook.xlsx.writeFile(outputPath);
    console.log("Excel file generated successfully");
}

createExcel().catch(err => console.error(err));
