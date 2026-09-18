const DS003_REGIONS = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
    "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
];

const DS003_SUB_ROWS = [
    "", "Demand_", "Saving_", "Time_", "Urban_", "Rural_"
];

const DS003_METRIC_DESCRIPTIONS = [
    "Pub.  Enterprise_Amount",
    "Pub.  Enterprise_ # of Depositors ",
    "Pub.  Enterprise_ # of Accounts ",
    "Private & Coop._Amount",
    " Private & Coop._# of Depositors ",
    " Private & Coop._# of Accounts ",
    "Regional Gov._Amount",
    " Regional Gov._# of Depositors ",
    " Regional Gov._# of Accounts ",
    "Banks_Amount",
    " Banks_# of Depositors ",
    " Banks_# of Accounts ",
    "Others_Amount",
    "Others_ # of Depositors ",
    "Others_ # of Accounts ",
    "Total _Amount",
    "Total _ # of Depositors ",
    "Total _ # of Accounts "
];

function DS003Format(returnKey = "DEP_SEC&REG_DS003", instCode = "0000001", finYear = 2026, startDate = "2026-04-01T00:00:00", endDate = "2026-06-30T00:00:00", valuesMap = {}) {
    const returnItemsList = [];
    let codeCounter = 33152;

    DS003_REGIONS.forEach((regName) => {
        DS003_SUB_ROWS.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            DS003_METRIC_DESCRIPTIONS.forEach((metricDesc) => {
                const codeStr = `DS003_${codeCounter}`;
                codeCounter++;

                const desc = `${rowPrefix}${metricDesc}`;

                returnItemsList.push({
                    Code: codeStr,
                    Value: valuesMap[codeStr] !== undefined && valuesMap[codeStr] !== null ? String(valuesMap[codeStr]) : "",
                    _description: desc,
                    _dataType: "NUMERIC",
                    _required: false
                });
            });
        });
    });

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

async function runTest() {
    const valuesMap = {
        "DS003_33152": "1000000",
        "DS003_33153": "500",
        "DS003_33154": "450",
        "DS003_33155": "5000000",
        "DS003_33156": "1200",
        "DS003_33157": "1100",
        "DS003_33167": "15000000",
        "DS003_33168": "2500",
        "DS003_33169": "2200"
    };

    const output = DS003Format("DEP_SEC&REG_DS003", "0000001", 2026, "2026-04-01T00:00:00", "2026-06-30T00:00:00", valuesMap);

    console.log("DS003 Generated JSON Summary:");
    console.log("ReturnKey:", output.ReturnKey);
    console.log("InstCode:", output.InstCode);
    console.log("FinYear:", output.FinYear);
    console.log("StartDate:", output.StartDate);
    console.log("EndDate:", output.EndDate);
    console.log("Total ReturnItemsList count:", output.ReturnItemsList.length);
    console.log("Item 1 (DS003_33152):", JSON.stringify(output.ReturnItemsList[0], null, 2));
    console.log("Item 2 (DS003_33153):", JSON.stringify(output.ReturnItemsList[1], null, 2));
    console.log("Item 3 (DS003_33154):", JSON.stringify(output.ReturnItemsList[2], null, 2));
    console.log("Item 16 (DS003_33167 Total Amt):", JSON.stringify(output.ReturnItemsList[15], null, 2));
    console.log("Item 19 (DS003_33170 Demand Pub):", JSON.stringify(output.ReturnItemsList[18], null, 2));
    console.log("Item 109 (DS003_33260 Afar):", JSON.stringify(output.ReturnItemsList[108], null, 2));
}

runTest();
