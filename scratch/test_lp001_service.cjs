const path = require('path');
const fs = require('fs');

async function test() {
    const { processLP001Report } = await import('../src/utils/services/LP001/LP001.ts');
    let inputExcel = path.resolve('templates/LP001.xlsx');
    if (!fs.existsSync(inputExcel)) {
        inputExcel = path.resolve('templates/LP001_sample.xlsx');
    }
    console.log("Using Excel file:", inputExcel);
    const outputExcel = path.resolve('scratch/out_generated_lp.xlsx');
    const outputJson = path.resolve('scratch/out_generated_lp.json');

    const res = await processLP001Report("0000001", inputExcel, "2026-07-01T00:00:00", "2026-09-30T00:00:00", outputExcel, outputJson);
    console.log("Processing result:", res);

    if (res.success) {
        const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
        console.log("ReturnKey:", jsonContent.ReturnKey);
        console.log("InstCode:", jsonContent.InstCode);
        console.log("FinYear:", jsonContent.FinYear);
        console.log("StartDate:", jsonContent.StartDate);
        console.log("EndDate:", jsonContent.EndDate);
        console.log("ReturnItemsList count:", jsonContent.ReturnItemsList.length);
        console.log("Sample first 3 items:", JSON.stringify(jsonContent.ReturnItemsList.slice(0, 3), null, 2));
    }
}

test().catch(console.error);
