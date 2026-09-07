const path = require('path');
const fs = require('fs');

async function testBP001() {
    const inputExcel = path.join(__dirname, '../templates/BP001.xlsx');
    const outputJson = path.join(__dirname, 'test_bp001_output.json');
    const outputExcel = path.join(__dirname, 'test_bp001_output.xlsx');

    console.log('Testing processBP001Report...');
    const { processBP001Report } = require('../src/utils/services/BP001/BP001');

    const result = await processBP001Report(
        "0000001",
        inputExcel,
        "2026-04-01T00:00:00",
        "2026-06-30T00:00:00",
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
    console.log('ReturnItemsList count:', jsonContent.ReturnItemsList.length);

    console.log('\nAll ReturnItemsList items:');
    jsonContent.ReturnItemsList.forEach((item, index) => {
        console.log(`${index + 1}. Code: ${item.Code} | Value: "${item.Value}" | _dataType: ${item._dataType} | _required: ${item._required} | _description: "${item._description}"`);
    });

    console.log('\nVerification checks:');
    console.assert(jsonContent.ReturnKey === "INT_FRE_SP_BP001", "ReturnKey must be INT_FRE_SP_BP001");
    console.assert(jsonContent.ReturnItemsList.length === 23, "ReturnItemsList count must be 23");
    console.assert(jsonContent.ReturnItemsList[0].Code === "29_00001", "Item 1 code must be 29_00001");
    console.assert(jsonContent.ReturnItemsList[0]._description === "Income_Amount", "Item 1 desc must be Income_Amount");
    console.assert(jsonContent.ReturnItemsList[22].Code === "29_00023", "Item 23 code must be 29_00023");
    console.assert(jsonContent.ReturnItemsList[22]._description === "Net income after tax & provisions (2.7-2.9)_Amount", "Item 23 desc must match");
    console.assert(jsonContent.ReturnItemsList.every(i => i._required === false), "All _required should be false");
    console.assert(jsonContent.ReturnItemsList.every(i => i._dataType === "NUMERIC"), "All _dataType should be NUMERIC");

    console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

testBP001().catch(err => console.error('Error running test:', err));
