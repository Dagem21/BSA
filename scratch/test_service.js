import { processQO001Report } from '../src/utils/services/QO001/QO001.ts';
import path from 'path';
import fs from 'fs';

async function test() {
    const inputExcel = path.resolve('templates/QO001.xlsx');
    const outputExcel = path.resolve('scratch/out_generated.xlsx');
    const outputJson = path.resolve('scratch/out_generated.json');

    const res = await processQO001Report("0000001", inputExcel, "2026-07-01T00:00:00", "2026-09-30T00:00:00", outputExcel, outputJson);
    console.log("Processing result:", res);

    if (res.success) {
        const jsonContent = JSON.parse(fs.readFileSync(outputJson, 'utf-8'));
        console.log("Extracted ReturnItemsList count:", jsonContent.ReturnItemsList.length);
        console.log("Item 12_00002 (CCF row 16):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00002"));
        console.log("Item 12_00004 (Weight row 16):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00004"));
        console.log("Item 12_00026 (Face Val row 23):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00026"));
        console.log("Item 12_00027 (CCF row 23):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00027"));
        console.log("Item 12_00028 (Amount row 23):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00028"));
        console.log("Item 12_00029 (Weight row 23):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00029"));
        console.log("Item 12_00030 (Credit Equ row 23):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00030"));
        console.log("Item 12_00091 (Total Face Val):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00091"));
        console.log("Item 12_00093 (Total Amount):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00093"));
        console.log("Item 12_00095 (Total Credit Equ):", jsonContent.ReturnItemsList.find(i => i.Code === "12_00095"));
    }
}

test().catch(console.error);
