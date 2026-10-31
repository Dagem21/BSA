const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

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

    console.log('Result:', res);
    const jsonOutput = JSON.parse(fs.readFileSync(outJson, 'utf8'));
    console.log('Item 76 (Bank domestic/foreign C):', jsonOutput.ReturnItemsList[75]);
    console.log('Item 77 (Bank domestic/foreign D):', jsonOutput.ReturnItemsList[76]);
    console.log('Item 78 (Bank domestic/foreign E):', jsonOutput.ReturnItemsList[77]);
    console.log('Item 79 (Bank domestic/foreign F):', jsonOutput.ReturnItemsList[78]);
    console.log('Item 80 (Bank domestic/foreign G):', jsonOutput.ReturnItemsList[79]);
    console.log('Item 81 (All others C):', jsonOutput.ReturnItemsList[80]);
    console.log('Item 82 (All others D):', jsonOutput.ReturnItemsList[81]);
    console.log('Item 83 (All others E):', jsonOutput.ReturnItemsList[82]);
    console.log('Item 84 (All others F):', jsonOutput.ReturnItemsList[83]);
    console.log('Item 85 (All others G):', jsonOutput.ReturnItemsList[84]);
    console.log('Item 91 (Total Face Value):', jsonOutput.ReturnItemsList[90]);
    console.log('Item 93 (Total Amount):', jsonOutput.ReturnItemsList[92]);
    console.log('Item 95 (Total Credit Equ):', jsonOutput.ReturnItemsList[94]);
}

testService().catch(console.error);
