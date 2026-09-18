const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const ID002_REGIONS = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
    "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
];

const getID002SubRows = (regIndex1Based) => [
    "",
    "Demand_",
    "Saving_",
    `Time (${regIndex1Based}.3.1+${regIndex1Based}.3.2)_`,
    "Restricted Investment Deposit_",
    "Unrestricted Investment Deposit_",
    "Urban_",
    "Rural_"
];

const ID002_METRIC_DESCRIPTIONS = [
    "  <= Birr 100,000 _Amount ",
    " <= Birr 100,000 _ # of Depositors ",
    " <= Birr 100,000 _ # of Accounts  ",
    ">Birr 100,000-1million _ >Birr 100,000-1million _Amount ",
    ">Birr 100,000-1million _ # of Depositors ",
    " >Birr 100,000-1million _# of Accounts  ",
    " > Birr 1 million_ Amount ",
    " > Birr 1 million_ # of Depositors ",
    " > Birr 1 million_ # of Accounts  ",
    "  Total  _Amount ",
    " Total  _ # of Depositors ",
    " Total  _ # of Accounts  "
];

function ID002Format(returnKey = "INT_FRE_RANID002", instCode = "0000001", finYear = 2026, startDate = "2026-04-01T00:00:00", endDate = "2026-06-30T00:00:00", valuesMap = {}) {
    const returnItemsList = [];
    let codeCounter = 37736;

    ID002_REGIONS.forEach((regName, regIdx) => {
        const subRows = getID002SubRows(regIdx + 1);
        subRows.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            ID002_METRIC_DESCRIPTIONS.forEach((metricDesc) => {
                const codeStr = `ID002_${codeCounter}`;
                codeCounter++;

                const desc = `${rowPrefix}${metricDesc}`;

                returnItemsList.push({
                    Code: codeStr,
                    Value: valuesMap[codeStr] !== undefined && valuesMap[codeStr] !== null ? String(valuesMap[codeStr]) : "",
                    _description: desc,
                    _dataType: "NUMERIC",
                    _required: false
                });
            });
        });
    });

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

async function main() {
    const rootDir = process.cwd();
    const excelDir = path.join(rootDir, 'reports', 'excel');
    const jsonDir = path.join(rootDir, 'reports', 'json');

    if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

    const sampleExcelPath = path.join(excelDir, 'ID002_sample.xlsx');
    const sampleJsonPath = path.join(jsonDir, 'ID002_sample.json');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ID002');

    // Title
    worksheet.getCell('A1').value = 'NATIONAL BANK OF ETHIOPIA - INT_FRE_RANID002';

    // Metadata
    worksheet.getCell('B8').value = 'Institution Code';
    worksheet.getCell('C8').value = '0000001';
    worksheet.getCell('B9').value = 'Financial Year';
    worksheet.getCell('C9').value = 2026;
    worksheet.getCell('B10').value = 'Start Date';
    worksheet.getCell('C10').value = '2026-04-01T00:00:00';
    worksheet.getCell('B11').value = 'End Date';
    worksheet.getCell('C11').value = '2026-06-30T00:00:00';

    // Header Rows (13 & 14)
    worksheet.getCell('B13').value = 'Region / Deposit Breakdown';
    const ranges = ['<= Birr 100,000', '> Birr 100,000 - 1 Million', '> Birr 1 Million', 'Total'];
    ranges.forEach((rng, i) => {
        const startCol = 3 + i * 3;
        worksheet.mergeCells(13, startCol, 13, startCol + 2);
        worksheet.getRow(13).getCell(startCol).value = rng;
    });

    for (let i = 0; i < 12; i++) {
        const c = i + 3;
        worksheet.getRow(14).getCell(c).value = i % 3 === 0 ? 'Amount' : (i % 3 === 1 ? '# of Depositors' : '# of Accounts');
    }

    const valuesMap = {};
    let codeCounter = 37736;
    let rowIdx = 15;

    ID002_REGIONS.forEach((reg, regIdx) => {
        const regIdx1Based = regIdx + 1;
        const subRows = getID002SubRows(regIdx1Based);

        subRows.forEach((sub, subIdx) => {
            const row = worksheet.getRow(rowIdx);
            row.getCell(2).value = sub === "" ? reg : `${reg} (${sub})`;

            for (let c = 0; c < 12; c++) {
                const col = 3 + c;
                const codeStr = `ID002_${codeCounter}`;
                codeCounter++;

                const isAmt = c % 3 === 0;
                const baseVal = (regIdx + 1) * 10000 + (subIdx + 1) * 500 + c * 10;
                const valStr = isAmt ? String(baseVal * 100) : String(baseVal);
                row.getCell(col).value = valStr;
                valuesMap[codeStr] = valStr;
            }
            rowIdx++;
        });
    });

    await workbook.xlsx.writeFile(sampleExcelPath);
    console.log('Sample ID002 Excel created at:', sampleExcelPath);

    const jsonData = ID002Format("INT_FRE_RANID002", "0000001", 2026, "2026-04-01T00:00:00", "2026-06-30T00:00:00", valuesMap);
    fs.writeFileSync(sampleJsonPath, JSON.stringify(jsonData, null, 4), 'utf-8');
    console.log('Sample ID002 JSON created at:', sampleJsonPath);

    console.log('\nGenerated ID002 JSON Summary:');
    console.log('ReturnKey:', jsonData.ReturnKey);
    console.log('InstCode:', jsonData.InstCode);
    console.log('FinYear:', jsonData.FinYear);
    console.log('StartDate:', jsonData.StartDate);
    console.log('EndDate:', jsonData.EndDate);
    console.log('ReturnItemsList count:', jsonData.ReturnItemsList.length);
    console.log('First Item (ID002_37736):', jsonData.ReturnItemsList[0]);
    console.log('Last Item (ID002_39079):', jsonData.ReturnItemsList[jsonData.ReturnItemsList.length - 1]);
}

main().catch(console.error);
