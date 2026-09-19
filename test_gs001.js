const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const GS001_ITEM_DEFINITIONS = [
    { code: "163_00001", description: "Demand_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00002", description: "Demand_ # of depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00003", description: "Demand_ # of depositors", dataType: "NUMERIC", required: false },
    { code: "163_00004", description: "Saving_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00005", description: "Saving_ # of Depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00006", description: "Saving_ # of Depositors", dataType: "NUMERIC", required: false },
    { code: "163_00007", description: "Time_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00008", description: "Time_ # of Depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00009", description: "Time_ # of Depositors", dataType: "NUMERIC", required: false },
    { code: "163_00010", description: "Total_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00011", description: "Total_ # of Depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00012", description: "Total_ # of Depositors", dataType: "NUMERIC", required: false }
];

function GS001Format(returnKey = "Digital SavingGS001", instCode = "0000001", finYear = 2026, startDate = "2026-04-01T00:00:00", endDate = "2026-06-30T00:00:00", valuesMap = {}) {
    const returnItems = GS001_ITEM_DEFINITIONS.map((def) => ({
        Code: def.code,
        Value: valuesMap[def.code] !== undefined && valuesMap[def.code] !== null ? String(valuesMap[def.code]) : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
}

async function runTest() {
    const valuesMap = {
        "163_00001": "500000",
        "163_00002": "1500",
        "163_00003": "1200",
        "163_00004": "1200000",
        "163_00005": "3500",
        "163_00006": "3000",
        "163_00007": "800000",
        "163_00008": "400",
        "163_00009": "350",
        "163_00010": "2500000",
        "163_00011": "5400",
        "163_00012": "4550"
    };

    const output = GS001Format("Digital SavingGS001", "0000001", 2026, "2026-04-01T00:00:00", "2026-06-30T00:00:00", valuesMap);

    console.log("GS001 Generated JSON Output:");
    console.log(JSON.stringify(output, null, 4));
}

runTest();
