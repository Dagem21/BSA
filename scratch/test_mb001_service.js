import { processMB001Report } from '../src/utils/services/MB001/MB001.ts';
import path from 'path';
import fs from 'fs';

async function test() {
    let inputExcel = path.resolve('templates/MB001.xlsx');
    if (!fs.existsSync(inputExcel)) {
        console.log("templates/MB001.xlsx not found, searching for MB001 files...");
        const files = fs.readdirSync('templates');
        console.log("Template files:", files);
        return;
    }
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
        const hasRequiredProp = jsonContent.ReturnItemsList.some(i => i._required !== undefined);
        console.log("Any item has _required property:", hasRequiredProp);
        const emptyValuesCount = jsonContent.ReturnItemsList.filter(i => i.Value === "").length;
        console.log("Total items with empty string Value:", emptyValuesCount);
    }
}

test().catch(console.error);
