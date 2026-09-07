const path = require('path');
const fs = require('fs');

async function testMWAC001() {
    const inputExcel = path.join(__dirname, '../templates/MWAC001.xlsx');
    const outputJson = path.join(__dirname, 'test_mwac001_output.json');
    const outputExcel = path.join(__dirname, 'test_mwac001_output.xlsx');

    console.log('Testing processMWAC001Report...');
    const { processMWAC001Report } = require('../src/utils/services/MWAC001/MWAC001');

    const result = await processMWAC001Report(
        "0000001",
        inputExcel,
        "2026-08-01T00:00:00",
        "2026-08-31T00:00:00",
        outputExcel,
        outputJson
    );

    console.log('Result success:', result.success);

    const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
    console.log('ReturnKey:', jsonContent.ReturnKey);
    console.log('InstCode:', jsonContent.InstCode);
    console.log('FinYear:', jsonContent.FinYear);
    console.log('StartDate:', jsonContent.StartDate);
    console.log('EndDate:', jsonContent.EndDate);
    console.log('DynamicItemsList Areas:', jsonContent.DynamicItemsList.length);

    const area = jsonContent.DynamicItemsList[0];
    console.log('Area code:', area.Area);
    console.log('Area name:', area._areaName);
    console.log('Total DynamicItems count:', area.DynamicItems.length);
    console.log('Total rows scanned:', area.DynamicItems.length / 8);

    console.log('\nFirst Row Items (8 items):');
    const firstRow = area.DynamicItems.slice(0, 8);
    firstRow.forEach(item => {
        console.log(`- Code: ${item.Code} | Value: "${item.Value}" | _dataType: ${item._dataType} | _required: ${item._required} | _description: "${item._description.replace(/\n/g, ' ')}"`);
    });

    console.log('\nVerification checks:');
    console.assert(jsonContent.ReturnKey === "LCMWAC001", "ReturnKey must be LCMWAC001");
    console.assert(area.Area === 213, "Area must be 213");
    console.assert(area.DynamicItems.length % 8 === 0, "DynamicItems count must be multiple of 8");
    console.assert(firstRow[0]._description === "Sector", "Item 1 description must be Sector");
    console.assert(firstRow[0]._dataType === "TEXT", "Item 1 dataType must be TEXT");
    console.assert(firstRow[2]._dataType === "NUMERIC", "Item 3 dataType must be NUMERIC");
    console.assert(firstRow[0]._required === true, "Item 1 required must be true");

    console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

testMWAC001().catch(err => console.error('Error running test:', err));
