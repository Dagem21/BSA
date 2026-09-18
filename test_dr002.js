const DR002_REGIONS = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
    "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
];

const DR002_SUB_ROWS = [
    "", "Demand_", "Saving_", "Time_", "Urban_", "Rural_"
];

const DR002_METRIC_DESCRIPTIONS = [
    "  <= Birr 100,000 _Amount ",
    "  <= Birr 100,000 _# of Depositors ",
    " <= Birr 100,000 _ # of Accounts  ",
    " >Birr 100,000-1million _Amount ",
    ">Birr 100,000-1million _ # of Depositors ",
    " >Birr 100,000-1million _# of Accounts  ",
    " > Birr 1 million _ Amount ",
    "  > Birr 1 million _# of Depositors ",
    " > Birr 1 million _ # of Accounts  ",
    " Total  _ Amount ",
    " Total  _ # of Depositors ",
    " Total  _ # of Accounts  "
];

function DR002Format(returnKey = "DEP_RAN&REG_DR002", instCode = "0000001", finYear = 2026, startDate = "2026-04-01T00:00:00", endDate = "2026-06-30T00:00:00", valuesMap = {}) {
    const returnItemsList = [];
    let codeCounter = 34682;

    DR002_REGIONS.forEach((regName) => {
        DR002_SUB_ROWS.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            DR002_METRIC_DESCRIPTIONS.forEach((metricDesc) => {
                const codeStr = `DR002_${codeCounter}`;
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
        "DR002_34682": "1000000",
        "DR002_34683": "500",
        "DR002_34684": "450",
        "DR002_34685": "5000000",
        "DR002_34686": "120",
        "DR002_34687": "110",
        "DR002_34688": "20000000",
        "DR002_34689": "25",
        "DR002_34690": "25",
        "DR002_34691": "26000000",
        "DR002_34692": "645",
        "DR002_34693": "585"
    };

    const output = DR002Format("DEP_RAN&REG_DR002", "0000001", 2026, "2026-04-01T00:00:00", "2026-06-30T00:00:00", valuesMap);

    console.log("DR002 Generated JSON Summary:");
    console.log("ReturnKey:", output.ReturnKey);
    console.log("InstCode:", output.InstCode);
    console.log("FinYear:", output.FinYear);
    console.log("StartDate:", output.StartDate);
    console.log("EndDate:", output.EndDate);
    console.log("Total ReturnItemsList count:", output.ReturnItemsList.length);
    console.log("Item 1 (DR002_34682):", JSON.stringify(output.ReturnItemsList[0], null, 2));
    console.log("Item 2 (DR002_34683):", JSON.stringify(output.ReturnItemsList[1], null, 2));
    console.log("Item 3 (DR002_34684):", JSON.stringify(output.ReturnItemsList[2], null, 2));
    console.log("Item 12 (DR002_34693):", JSON.stringify(output.ReturnItemsList[11], null, 2));
    console.log("Item 13 (DR002_34694 Demand):", JSON.stringify(output.ReturnItemsList[12], null, 2));
    console.log("Item 73 (DR002_34754 Afar):", JSON.stringify(output.ReturnItemsList[72], null, 2));
}

runTest();
