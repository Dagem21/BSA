const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function createDataExcel() {
    try {
        console.log("Creating new workbook...");
        const workbook = new ExcelJS.Workbook();
        
        // Start from the empty template we copied earlier
        const templatePath = path.join(__dirname, "MWAL001_Sample.xlsx");
        if (fs.existsSync(templatePath)) {
            await workbook.xlsx.readFile(templatePath);
            console.log("Loaded template.");
        } else {
            console.log("Template not found, creating from scratch.");
            workbook.addWorksheet("MWAL001");
        }

        const worksheet = workbook.getWorksheet(1); // Get first sheet

        // Populate Headers if they don't exist
        worksheet.getCell('A4').value = "NATIONAL BANK OF ETHIOPIA";
        worksheet.getCell('A5').value = "Institution Code";
        worksheet.getCell('B5').value = "0000001";
        worksheet.getCell('A6').value = "Financial Year";
        worksheet.getCell('B6').value = 2026;
        worksheet.getCell('A7').value = "Start Date";
        worksheet.getCell('B7').value = "2026-08-01";
        worksheet.getCell('A8').value = "End Date";
        worksheet.getCell('B8').value = "2026-08-31";

        const sectors = ["Agriculture", "Manufacturing", "Construction", "Trade", "Hotels and Tourism", "Transport and Communication", "Financial Institutions", "Real Estate", "Personal Loans", "Mining and Quarrying", "Health and Education", "Others"];
        const cats = ["Short Term", "Medium Term", "Long Term", "Overdraft", "Pre-shipment", "Post-shipment"];

        console.log("Generating 50 rows of data...");
        for (let r = 0; r < 50; r++) {
            worksheet.getCell(14 + r, 1).value = sectors[Math.floor(Math.random() * sectors.length)];
            worksheet.getCell(14 + r, 2).value = cats[Math.floor(Math.random() * cats.length)];
            worksheet.getCell(14 + r, 3).value = +(Math.random() * 1000 + 50).toFixed(2);
            worksheet.getCell(14 + r, 4).value = Math.floor(Math.random() * 500) + 10;
            worksheet.getCell(14 + r, 5).value = +(Math.random() * 5 + 7).toFixed(2);
            worksheet.getCell(14 + r, 6).value = +(Math.random() * 5 + 13).toFixed(2);
            worksheet.getCell(14 + r, 7).value = +(Math.random() * 3 + 10).toFixed(2);
            worksheet.getCell(14 + r, 8).value = +(Math.random() * 2 + 11).toFixed(2);
        }

        const outputPath = path.join(__dirname, "MWAL001_Data_More_Than_45_Rows.xlsx");
        await workbook.xlsx.writeFile(outputPath);
        console.log("Excel file generated successfully at " + outputPath);
    } catch (e) {
        console.error("Error creating excel:", e);
    }
}

createDataExcel().then(() => console.log("Done."));
