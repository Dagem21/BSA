const fs = require('fs');
const path = require('path');
const { processQO001Report } = require('../src/utils/services/QO001/QO001');

async function main() {
    const inputExcel = path.join(process.cwd(), 'templates', 'QO001.xlsx');
    const outJson = path.join(process.cwd(), 'scratch', 'final_out_qo001.json');
    const outExcel = path.join(process.cwd(), 'scratch', 'final_out_qo001.xlsx');

    const res = await processQO001Report(
        '0000001',
        inputExcel,
        '2026-07-01T00:00:00',
        '2026-09-30T00:00:00',
        outExcel,
        outJson
    );

    console.log('Report result:', res);
    const generatedJson = JSON.parse(fs.readFileSync(outJson, 'utf8'));

    console.log('\n--- Final Generated JSON summary ---');
    console.log('ReturnKey:', generatedJson.ReturnKey);
    console.log('InstCode:', generatedJson.InstCode);
    console.log('FinYear:', generatedJson.FinYear);
    console.log('StartDate:', generatedJson.StartDate);
    console.log('EndDate:', generatedJson.EndDate);
    console.log('Total ReturnItems:', generatedJson.ReturnItemsList.length);

    console.log('\nActive items (non-empty Value):');
    generatedJson.ReturnItemsList.filter(i => i.Value !== "").forEach(item => {
        console.log(`Code: ${item.Code}, Value: ${item.Value}, Desc: ${item._description}`);
    });

    console.log('\nRow 35 items (codes 12_00076 to 12_00080):');
    for (let c = 76; c <= 80; c++) {
        const code = `12_${String(c).padStart(5, '0')}`;
        const item = generatedJson.ReturnItemsList.find(i => i.Code === code);
        console.log(`Code: ${code}, Value: '${item.Value}'`);
    }
}

main().catch(console.error);
