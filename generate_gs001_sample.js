const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const { processGS001Report } = require('./src/utils/services/GS001/GS001');

async function main() {
    const rootDir = process.cwd();
    const excelDir = path.join(rootDir, 'reports', 'excel');
    const jsonDir = path.join(rootDir, 'reports', 'json');

    if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

    const sampleExcelPath = path.join(excelDir, 'GS001_sample.xlsx');
    const sampleJsonPath = path.join(jsonDir, 'GS001_sample.json');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GS001');

    // Title
    worksheet.getCell('A1').value = 'NATIONAL BANK OF ETHIOPIA - Digital SavingGS001';

    // Metadata
    worksheet.getCell('B9').value = 'Institution Code';
    worksheet.getCell('C9').value = '0000001';
    worksheet.getCell('B10').value = 'Financial Year';
    worksheet.getCell('C10').value = 2026;
    worksheet.getCell('B11').value = 'Start Date';
    worksheet.getCell('C11').value = '2026-04-01T00:00:00';
    worksheet.getCell('B12').value = 'End Date';
    worksheet.getCell('C12').value = '2026-06-30T00:00:00';

    // Table Header Row 14
    worksheet.getCell('B14').value = 'Deposit Type';
    worksheet.getCell('C14').value = 'Deposit Amount';
    worksheet.getCell('D14').value = '# of depositors accounts';
    worksheet.getCell('E14').value = '# of depositors';

    // Table Rows
    // Demand
    worksheet.getCell('B15').value = 'Demand';
    worksheet.getCell('C15').value = 500000.00;
    worksheet.getCell('D15').value = 1500;
    worksheet.getCell('E15').value = 1200;

    // Saving
    worksheet.getCell('B16').value = 'Saving';
    worksheet.getCell('C16').value = 1200000.00;
    worksheet.getCell('D16').value = 3500;
    worksheet.getCell('E16').value = 3000;

    // Time
    worksheet.getCell('B17').value = 'Time';
    worksheet.getCell('C17').value = 800000.00;
    worksheet.getCell('D17').value = 400;
    worksheet.getCell('E17').value = 350;

    // Total
    worksheet.getCell('B18').value = 'Total';
    worksheet.getCell('C18').value = 2500000.00;
    worksheet.getCell('D18').value = 5400;
    worksheet.getCell('E18').value = 4550;

    await workbook.xlsx.writeFile(sampleExcelPath);
    console.log('Sample Excel created at:', sampleExcelPath);

    const result = await processGS001Report(
        '0000001',
        sampleExcelPath,
        '2026-04-01T00:00:00',
        '2026-06-30T00:00:00',
        sampleExcelPath,
        sampleJsonPath
    );

    console.log('Process Result:', result);

    const generatedJson = JSON.parse(fs.readFileSync(sampleJsonPath, 'utf8'));
    console.log('Generated JSON Summary:');
    console.log('ReturnKey:', generatedJson.ReturnKey);
    console.log('InstCode:', generatedJson.InstCode);
    console.log('FinYear:', generatedJson.FinYear);
    console.log('StartDate:', generatedJson.StartDate);
    console.log('EndDate:', generatedJson.EndDate);
    console.log('ReturnItemsList count:', generatedJson.ReturnItemsList.length);
    console.log('Sample Item 1 (163_00001):', generatedJson.ReturnItemsList[0]);
    console.log('Sample Item 10 (163_00010):', generatedJson.ReturnItemsList[9]);
}

main().catch(console.error);
