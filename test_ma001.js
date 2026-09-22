const fs = require('fs');
const path = require('path');
const { MA001Format, MA001_ROW_DESCRIPTIONS, MA001_COL_SUFFIXES } = require('./src/utils/services/MA001/jsonFormat');

async function runTest() {
    console.log("=== Running MA001 Test ===");
    
    // Sample values map
    const valuesMap = {
        "20_00001": "100.50",
        "20_00025": "3001.50",
        "20_00193": "1500.75"
    };

    const output = MA001Format(
        "NBE_MAT_ANL_MA001",
        "0000001",
        2026,
        "2026-04-01T00:00:00",
        "2026-06-30T00:00:00",
        valuesMap
    );

    console.log("ReturnKey:", output.ReturnKey);
    console.log("InstCode:", output.InstCode);
    console.log("FinYear:", output.FinYear);
    console.log("StartDate:", output.StartDate);
    console.log("EndDate:", output.EndDate);
    console.log("Total items generated:", output.ReturnItemsList.length);

    console.log("\nSample Item 1 (20_00001):", JSON.stringify(output.ReturnItemsList[0], null, 4));
    console.log("Sample Item 25 (20_00025):", JSON.stringify(output.ReturnItemsList[24], null, 4));
    console.log("Sample Item 193 (20_00193):", JSON.stringify(output.ReturnItemsList[192], null, 4));
    console.log("Sample Last Item (20_00336):", JSON.stringify(output.ReturnItemsList[335], null, 4));

    if (output.ReturnItemsList.length === 336) {
        console.log("\nSUCCESS: MA001 JSON format generated all 336 expected return items!");
    } else {
        console.error(`\nFAILURE: Expected 336 items, got ${output.ReturnItemsList.length}`);
    }
}

runTest().catch(console.error);
