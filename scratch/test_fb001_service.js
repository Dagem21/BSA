import { processFB001Report } from '../src/utils/services/FB001/FB001.ts';
import path from 'path';
import fs from 'fs';

async function test() {
    const inputExcel = path.resolve('templates/FB001 (1).xlsx');
    const outputExcel = path.resolve('scratch/out_generated_fb.xlsx');
    const outputJson = path.resolve('scratch/out_generated_fb.json');

    const res = await processFB001Report("0000001", inputExcel, "2026-07-01T00:00:00", "2026-09-30T00:00:00", outputExcel, outputJson);
    console.log("Processing result:", res);

    if (res.success) {
        const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
        console.log("ReturnKey:", jsonContent.ReturnKey);
        console.log("StartDate:", jsonContent.StartDate);
        console.log("EndDate:", jsonContent.EndDate);
        console.log("Extracted ReturnItemsList count:", jsonContent.ReturnItemsList.length);
        console.log("Sample non-zero items:");
        const nonZeroItems = jsonContent.ReturnItemsList.filter(i => i.Value !== "0");
        console.log("Total non-zero items:", nonZeroItems.length);
        nonZeroItems.slice(0, 10).forEach(item => {
            console.log(JSON.stringify(item));
        });
        const hasRequiredProp = jsonContent.ReturnItemsList.some(i => i._required !== undefined);
        console.log("Any item has _required property:", hasRequiredProp);
        const emptyValuesCount = jsonContent.ReturnItemsList.filter(i => i.Value === "").length;
        console.log("Total items with empty string Value:", emptyValuesCount);
    }
}

test().catch(console.error);
