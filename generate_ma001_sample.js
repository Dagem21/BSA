const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { processMA001Report } = require('./src/utils/services/MA001/MA001');
const { MA001Format } = require('./src/utils/services/MA001/jsonFormat');

async function main() {
    const rootDir = process.cwd();
    const excelDir = path.join(rootDir, 'reports', 'excel');
    const jsonDir = path.join(rootDir, 'reports', 'json');
    const templateJsonDir = path.join(rootDir, 'templates', 'json');

    if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
    if (!fs.existsSync(templateJsonDir)) fs.mkdirSync(templateJsonDir, { recursive: true });

    // Save default empty template JSON to templates/json/MA001.json
    const emptyTemplate = MA001Format(
        "NBE_MAT_ANL_MA001",
        "0000001",
        2026,
        "2026-04-01T00:00:00",
        "2026-06-30T00:00:00",
        {}
    );
    fs.writeFileSync(
        path.join(templateJsonDir, 'MA001.json'),
        JSON.stringify(emptyTemplate, null, 4)
    );
    console.log('Created templates/json/MA001.json');

    const sampleExcelPath = path.join(excelDir, 'MA001_sample.xlsx');
    const sampleJsonPath = path.join(jsonDir, 'MA001_sample.json');

    // Copy template excel or build sample excel
    const masterTemplatePath = path.join(rootDir, 'templates', 'MA001.xlsx');
    if (fs.existsSync(masterTemplatePath)) {
        fs.copyFileSync(masterTemplatePath, sampleExcelPath);
        console.log('Copied master Excel template to:', sampleExcelPath);
    } else {
        console.error('Master Excel template not found at:', masterTemplatePath);
        return;
    }

    // Fill some sample data into sample excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sampleExcelPath);
    const worksheet = workbook.worksheets[0];

    // Set metadata cells if needed
    worksheet.getCell('C8').value = '0000001';
    worksheet.getCell('C9').value = 2026;
    worksheet.getCell('C10').value = '2026-04-01T00:00:00';
    worksheet.getCell('C11').value = '2026-06-30T00:00:00';

    // Put some values in Row 18 (Cash and balances due from NBE)
    // cols 3 (C) to 13 (M)
    for (let col = 3; col <= 13; col++) {
        worksheet.getRow(18).getCell(col).value = col * 1000.5;
    }

    // Put some values in Row 32 (Deposits demand, savings & time)
    for (let col = 3; col <= 13; col++) {
        worksheet.getRow(32).getCell(col).value = col * 500.25;
    }

    await workbook.xlsx.writeFile(sampleExcelPath);
    console.log('Updated sample Excel with test values');

    const result = await processMA001Report(
        '0000001',
        sampleExcelPath,
        '2026-04-01T00:00:00',
        '2026-06-30T00:00:00',
        sampleExcelPath,
        sampleJsonPath
    );

    console.log('Process Result:', result);

    if (fs.existsSync(sampleJsonPath)) {
        const generatedJson = JSON.parse(fs.readFileSync(sampleJsonPath, 'utf8'));
        console.log('Generated JSON Summary:');
        console.log('ReturnKey:', generatedJson.ReturnKey);
        console.log('InstCode:', generatedJson.InstCode);
        console.log('FinYear:', generatedJson.FinYear);
        console.log('StartDate:', generatedJson.StartDate);
        console.log('EndDate:', generatedJson.EndDate);
        console.log('ReturnItemsList count:', generatedJson.ReturnItemsList.length);
        console.log('First Item (20_00001):', generatedJson.ReturnItemsList[0]);
        console.log('Item 25 (20_00025):', generatedJson.ReturnItemsList[24]);
        console.log('Item 193 (20_00193):', generatedJson.ReturnItemsList[192]);
    }
}

main().catch(console.error);
