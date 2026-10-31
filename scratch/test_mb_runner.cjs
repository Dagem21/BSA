const path = require('path');
const fs = require('fs');

async function main() {
    const { processMB001Report } = await import('../src/utils/services/MB001/MB001.ts');
    let inputExcel = path.resolve('templates/MB001.xlsx');
    const outputExcel = path.resolve('scratch/out_generated_mb.xlsx');
    const outputJson = path.resolve('scratch/out_generated_mb.json');

    const res = await processMB001Report("0000001", inputExcel, "2026-09-01T00:00:00.000Z", "2026-09-30T00:00:00.000Z", outputExcel, outputJson);
    console.log("Processing result:", res);

    if (res.success) {
        const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
        console.log("ReturnKey:", jsonContent.ReturnKey);
        console.log("StartDate:", jsonContent.StartDate);
        console.log("EndDate:", jsonContent.EndDate);
        console.log("Extracted ReturnItemsList count:", jsonContent.ReturnItemsList.length);
        console.log("Sample items:");
        jsonContent.ReturnItemsList.slice(0, 5).forEach(item => {
            console.log(JSON.stringify(item));
        });
    }
}

main().catch(err => console.error(err));
