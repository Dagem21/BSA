const fs = require('fs');
const path = require('path');

// Register ts-node
require('ts-node').register({ transpileOnly: true });

const { processMB001Report } = require('../src/utils/services/MB001/MB001.ts');

async function test() {
    let inputExcel = path.resolve('templates/MB001.xlsx');
    if (!fs.existsSync(inputExcel)) {
        console.log("templates/MB001.xlsx not found, checking templates directory:");
        const files = fs.readdirSync('templates');
        console.log(files);
        return;
    }
    const outputExcel = path.resolve('scratch/out_generated_mb.xlsx');
    const outputJson = path.resolve('scratch/out_generated_mb.json');

    const res = await processMB001Report("0000001", inputExcel, "2026-09-01T00:00:00", "2026-09-30T00:00:00", outputExcel, outputJson);
    console.log("Processing result:", res);

    if (res.success) {
        const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
        console.log("ReturnKey:", jsonContent.ReturnKey);
        console.log("StartDate:", jsonContent.StartDate);
        console.log("EndDate:", jsonContent.EndDate);
        console.log("Total items:", jsonContent.ReturnItemsList.length);
        console.log("First 3 items:", jsonContent.ReturnItemsList.slice(0, 3));
        console.log("Item 1 (110_00001):", jsonContent.ReturnItemsList[0]);
        const emptyCount = jsonContent.ReturnItemsList.filter(i => i.Value === "").length;
        const zeroCount = jsonContent.ReturnItemsList.filter(i => i.Value === "0").length;
        console.log("Empty count:", emptyCount, "Zero count:", zeroCount);
        const hasRequired = jsonContent.ReturnItemsList.some(i => i._required !== undefined);
        console.log("Has _required property:", hasRequired);
    }
}

test().catch(console.error);
