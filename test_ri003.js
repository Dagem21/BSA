const RI003_REGIONS = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
    "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
];

const getRI003SubRows = (regIndex1Based) => [
    "",
    "Demand_",
    "Saving_",
    `Time (${regIndex1Based}.3.1+${regIndex1Based}.3.2)_`,
    "Restricted Investment Deposit_",
    "Unrestricted Investment Deposit_",
    "Urban_",
    "Rural_"
];

const RI003_METRIC_DESCRIPTIONS = [
    "Pub.  Enterprise_Amount",
    "Pub.  Enterprise_ # of Depositors ",
    "Pub.  Enterprise_# of Accounts ",
    "Private & Coop._Amount",
    " Private & Coop._# of Depositors ",
    "Private & Coop._# of Accounts ",
    "Regional Gov._Amount",
    " Regional Gov._# of Depositors ",
    "Regional Gov._# of Accounts ",
    "Banks_Amount",
    "Banks_ # of Depositors ",
    "Banks_# of Accounts ",
    "Others_Amount",
    "Others_ # of Depositors ",
    "Others_# of Accounts ",
    "Total _Amount",
    "Total _ # of Depositors ",
    " Total _# of Accounts  "
];

function RI003Format(returnKey = "INT_FRE_SECRI003", instCode = "0000001", finYear = 2026, startDate = "2026-04-01T00:00:00", endDate = "2026-06-30T00:00:00", valuesMap = {}) {
    const returnItemsList = [];
    let codeCounter = 35702;

    RI003_REGIONS.forEach((regName, regIdx) => {
        const subRows = getRI003SubRows(regIdx + 1);
        subRows.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            RI003_METRIC_DESCRIPTIONS.forEach((metricDesc) => {
                const codeStr = `RI003_${codeCounter}`;
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
        "RI003_35702": "1500000",
        "RI003_35703": "50",
        "RI003_35704": "40",
        "RI003_35756": "8000000",
        "RI003_35846": "2200000",
        "RI003_35900": "4500000"
    };

    const output = RI003Format("INT_FRE_SECRI003", "0000001", 2026, "2026-04-01T00:00:00", "2026-06-30T00:00:00", valuesMap);

    console.log("RI003 Generated JSON Summary:");
    console.log("ReturnKey:", output.ReturnKey);
    console.log("InstCode:", output.InstCode);
    console.log("FinYear:", output.FinYear);
    console.log("StartDate:", output.StartDate);
    console.log("EndDate:", output.EndDate);
    console.log("Total ReturnItemsList count:", output.ReturnItemsList.length);
    console.log("First Item (RI003_35702):", JSON.stringify(output.ReturnItemsList[0], null, 2));
    console.log("Item 55 (RI003_35756 - Addis Ababa Time 1.3.1+1.3.2 Pub Ent Amt):", JSON.stringify(output.ReturnItemsList[54], null, 2));
    console.log("Item 145 (RI003_35846 - Afar Total Pub Ent Amt):", JSON.stringify(output.ReturnItemsList[144], null, 2));
    console.log("Item 199 (RI003_35900 - Afar Time 2.3.1+2.3.2 Pub Ent Amt):", JSON.stringify(output.ReturnItemsList[198], null, 2));
    console.log("Last Item (RI003_37717):", JSON.stringify(output.ReturnItemsList[output.ReturnItemsList.length - 1], null, 2));

    if (output.ReturnItemsList.length === 2016) {
        console.log("\nSUCCESS: Total items equals 2,016 exactly as expected!");
    } else {
        console.error(`\nFAILURE: Expected 2,016 items, but got ${output.ReturnItemsList.length}`);
    }
}

runTest();
