export const ID002_REGIONS = [
    "Addis Ababa",
    "Afar",
    "Amhara",
    "Benishangul",
    "Dire Dawa",
    "Gambela",
    "Harari",
    "Oromia",
    "Somalia",
    "Tigray",
    "Sidama",
    "SWERS",
    "CERS",
    "SERS"
];

// 8 sub-rows per region
export const getID002SubRows = (regIndex1Based: number) => [
    "",
    "Demand_",
    "Saving_",
    `Time (${regIndex1Based}.3.1+${regIndex1Based}.3.2)_`,
    "Restricted Investment Deposit_",
    "Unrestricted Investment Deposit_",
    "Urban_",
    "Rural_"
];

// 12 metric descriptions per sub-row
export const ID002_METRIC_DESCRIPTIONS = [
    "  <= Birr 100,000 _Amount ",
    " <= Birr 100,000 _ # of Depositors ",
    " <= Birr 100,000 _ # of Accounts  ",
    ">Birr 100,000-1million _ >Birr 100,000-1million _Amount ",
    ">Birr 100,000-1million _ # of Depositors ",
    " >Birr 100,000-1million _# of Accounts  ",
    " > Birr 1 million_ Amount ",
    " > Birr 1 million_ # of Depositors ",
    " > Birr 1 million_ # of Accounts  ",
    "  Total  _Amount ",
    " Total  _ # of Depositors ",
    " Total  _ # of Accounts  "
];

export const ID002Format = (
    returnKey: string = "INT_FRE_RANID002",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string = "2026-04-01T00:00:00",
    endDate: string = "2026-06-30T00:00:00",
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) =>
        val !== undefined && val !== null ? val.toString() : "";

    const returnItemsList: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    let codeCounter = 37736;

    ID002_REGIONS.forEach((regName, regIdx) => {
        const subRows = getID002SubRows(regIdx + 1);
        subRows.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            ID002_METRIC_DESCRIPTIONS.forEach((metricDesc) => {
                const codeStr = `ID002_${codeCounter}`;
                codeCounter++;

                const desc = `${rowPrefix}${metricDesc}`;

                returnItemsList.push({
                    Code: codeStr,
                    Value: fmt(valuesMap[codeStr]),
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
};
