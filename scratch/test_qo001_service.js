const path = require('path');
const { processQO001Report } = require('../src/utils/services/QO001/QO001');

async function testService() {
    const inputExcel = path.join(process.cwd(), 'templates', 'QO001.xlsx');
    const outJson = path.join(process.cwd(), 'scratch', 'test_out_qo001.json');
    const outExcel = path.join(process.cwd(), 'scratch', 'test_out_qo001.xlsx');

    const res = await processQO001Report(
        '0000001',
        inputExcel,
        '2026-07-01T00:00:00',
        '2026-09-30T00:00:00',
        outExcel,
        outJson
    );

    console.log('Report processing result:', res);

    const generatedJson = require(outJson);
    console.log('ReturnKey:', generatedJson.ReturnKey);
    console.log('InstCode:', generatedJson.InstCode);
    console.log('FinYear:', generatedJson.FinYear);
    console.log('StartDate:', generatedJson.StartDate);
    console.log('EndDate:', generatedJson.EndDate);
    console.log('Items count:', generatedJson.ReturnItemsList.length);
    console.log('Sample Item 0:', generatedJson.ReturnItemsList[0]);
    console.log('Sample Item 1:', generatedJson.ReturnItemsList[1]);
    console.log('Sample Item 25:', generatedJson.ReturnItemsList[25]);
    console.log('Sample Item 94:', generatedJson.ReturnItemsList[94]);
    console.log('Any item with _required?', generatedJson.ReturnItemsList.some(i => '_required' in i));
    console.log('Any item with non-empty value?', generatedJson.ReturnItemsList.some(i => i.Value !== ""));
}

testService().catch(console.error);
