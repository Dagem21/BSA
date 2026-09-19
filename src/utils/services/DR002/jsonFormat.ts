export const DR002_REGIONS = [
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

export const DR002_SUB_ROWS = [
    "",
    "Demand_",
    "Saving_",
    "Time_",
    "Urban_",
    "Rural_"
];

// 12 descriptors template per sub-row
export const DR002_METRIC_DESCRIPTIONS = [
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

export const DR002Format = (
    returnKey: string = "DEP_RAN&REG_DR002",
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
