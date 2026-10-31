import { processQI001Report } from '../src/utils/services/QI001/QI001.ts';
import path from 'path';
import fs from 'fs';

async function test() {
    const inputExcel = path.resolve('templates/QI001.xlsx');
    const outputExcel = path.resolve('scratch/out_generated_qi.xlsx');
    const outputJson = path.resolve('scratch/out_generated_qi.json');

    const res = await processQI001Report("0000001", inputExcel, "2026-07-01T00:00:00", "2026-09-30T00:00:00", outputExcel, outputJson);
    console.log("Processing result:", res);

    if (res.success) {
        const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
        console.log("Extracted ReturnItemsList count:", jsonContent.ReturnItemsList.length);
        console.log("Sample items:");
        jsonContent.ReturnItemsList.slice(0, 15).forEach(item => {
            console.log(`Code: ${item.Code}, Value: "${item.Value}", Desc: "${item._description}"`);
        });
        const emptyValuesCount = jsonContent.ReturnItemsList.filter(i => i.Value === "").length;
        console.log("Total items with empty string Value:", emptyValuesCount);
    }
}

test().catch(console.error);
