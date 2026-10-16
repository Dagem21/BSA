const path = require('path');
const fs = require('fs');

async function testPopulated() {
    const { jsonToExcelLP001, processLP001Report } = await import('../src/utils/services/LP001/LP001.ts');

    const samplePayload = {
        ReturnKey: "LOAN_CLA&PROV_LP001",
        InstCode: "0000001",
        FinYear: 2026,
        StartDate: "2026-07-01T00:00:00",
        EndDate: "2026-09-30T00:00:00",
        ReturnItemsList: [
            { Code: "21_00001", Value: "", _description: "Pass Amount (A)", _dataType: "NUMERIC" },
            { Code: "21_00010", Value: "791005.6588371708", _description: "1.1 Term loan_Amount (A)", _dataType: "NUMERIC" },
            { Code: "21_00011", Value: "", _description: "1.1 Term loan_B", _dataType: "NUMERIC" },
            { Code: "21_00012", Value: "", _description: "1.1 Term loan_C", _dataType: "NUMERIC" },
            { Code: "21_00013", Value: "", _description: "1.1 Term loan_D", _dataType: "NUMERIC" },
            { Code: "21_00014", Value: "791005.6588371708", _description: "1.1 Term loan_E", _dataType: "NUMERIC" },
            { Code: "21_00015", Value: "0.01", _description: "1.1 Term loan_F", _dataType: "NUMERIC" },
            { Code: "21_00016", Value: "7910.056588371708", _description: "1.1 Term loan_G", _dataType: "NUMERIC" },
            { Code: "21_00017", Value: "7801.989753158121", _description: "1.1 Term loan_H", _dataType: "NUMERIC" },
            { Code: "21_00018", Value: "-108.06683521358718", _description: "1.1 Term loan_I", _dataType: "NUMERIC" }
        ]
    };

    const populatedExcel = path.resolve('scratch/test_populated_lp.xlsx');
    const workbook = await jsonToExcelLP001(samplePayload);
    await workbook.xlsx.writeFile(populatedExcel);

    const outExcel = path.resolve('scratch/out_reextracted.xlsx');
    const outJson = path.resolve('scratch/out_reextracted.json');

    const res = await processLP001Report("0000001", populatedExcel, "2026-07-01T00:00:00", "2026-09-30T00:00:00", outExcel, outJson);
    console.log("Extraction success:", res.success);

    const resultJson = JSON.parse(fs.readFileSync(outJson, 'utf8'));
    console.log("ReturnKey:", resultJson.ReturnKey);
    console.log("InstCode:", resultJson.InstCode);
    console.log("FinYear:", resultJson.FinYear);
    console.log("StartDate:", resultJson.StartDate);
    console.log("EndDate:", resultJson.EndDate);
    console.log("Items 21_00010 to 21_00018:");
    resultJson.ReturnItemsList.filter(i => i.Code >= "21_00010" && i.Code <= "21_00018").forEach(item => {
        console.log(`  ${item.Code}: ${JSON.stringify(item.Value)}`);
    });
}

testPopulated().catch(console.error);
