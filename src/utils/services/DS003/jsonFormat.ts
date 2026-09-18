export const DS003_REGIONS = [
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

export const DS003_SUB_ROWS = [
    "",
    "Demand_",
    "Saving_",
    "Time_",
    "Urban_",
    "Rural_"
];

// 18 metric description suffixes per sub-row
export const DS003_METRIC_DESCRIPTIONS = [
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

export const DS003Format = (
    returnKey: string = "DEP_SEC&REG_DS003",
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
