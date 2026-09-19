export const SR002_REGIONS = [
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

// 6 sub-rows per region
export const getSR002SubRows = (regIndex1Based: number, regName: string) => [
    "",
    "Term loan_",
    "Overdraft_",
    regName === "Addis Ababa" ? "Merch. Loan*_" : "Merch. loan_",
    "Urban_",
    "Rural_"
];

// 18 metric descriptions per row (Columns C through T)
export const SR002_METRIC_SUFFIXES = [
    "Public Enterprise_Amount",
    " Public Enterprise_ # of Borrowers",
    "Public Enterprise_ # of Accounts  ",
    "Private & Coop._Amount",
    " Private & Coop._ # of Borrowers",
    " Private & Coop._# of Accounts  ",
    "Regional Gov't_Amount",
    " Regional Gov't_ # of Borrowers",
    " Regional Gov't_# of Accounts  ",
    "Banks_Amount",
    " Banks_ # of Borrowers",
    " # of Accounts  ",
    "Amount",
    "  # of Borrowers",
    "Banks_ # of Accounts  ",
    "Total_Amount",
    "Total_  # of Borrowers",
    " Total_# of Accounts  "
];

export const SR002Format = (
    returnKey: string = "INT_LON_S&R_SR002",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string = "2026-04-01T00:00:00",
    endDate: string = "2026-06-30T00:00:00",
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) => {
        if (val === undefined || val === null) return "0";
        const s = String(val).trim();
        return (s === "" || s === "[object Object]") ? "0" : s;
    };

    const returnItemsList: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    let codeCounter = 42662;

    // 14 regions x 6 sub-rows = 84 rows
    SR002_REGIONS.forEach((regName, regIdx) => {
        const subRows = getSR002SubRows(regIdx + 1, regName);
        subRows.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            SR002_METRIC_SUFFIXES.forEach((suffix) => {
                const codeStr = `SR002_${codeCounter}`;
                codeCounter++;

                const desc = `${rowPrefix}${suffix}`;

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

    // 1 Total Amount row = 18 metrics
    SR002_METRIC_SUFFIXES.forEach((suffix) => {
        const codeStr = `SR002_${codeCounter}`;
        codeCounter++;

        const desc = `Total Amount_${suffix}`;

        returnItemsList.push({
            Code: codeStr,
            Value: fmt(valuesMap[codeStr]),
            _description: desc,
            _dataType: "NUMERIC",
            _required: false
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
