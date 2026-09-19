export const EE002_REGIONS = [
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
export const getEE002SubRows = (regIndex1Based: number, regName: string) => [
    "",
    "Term loan_",
    "Overdraft_",
    regName === "Addis Ababa" ? "Merch. Loan*_" : "Merch. loan_",
    "Urban_",
    "Rural_"
];

// 24 metric descriptions per row (Columns C through Z)
export const EE002_METRIC_SUFFIXES = [
    "<= 100,000_Amount",
    "  <= 100,000_# of Borrowers",
    " <= 100,000_# of Accounts  ",
    ">100,000 - 1million_Amount",
    ">100,000 - 1million_  # of Borrowers",
    ">100,000 - 1million_ # of Accounts  ",
    ">1 million - 5 million_Amount",
    " >1 million - 5 million_ # of Borrowers",
    ">1 million - 5 million_ # of Accounts  ",
    ">5million - 10 million_Amount",
    " >5million - 10 million_. # of Borrowers",
    " >5million - 10 million_# of Accounts  ",
    ">10million - 50 million_Amount",
    " >10million - 50 million_ # of Borrowers",
    ">10million - 50 million_ # of Accounts  ",
    ">50million -100million_Amount",
    " >50million -100million_ # of Borrowers",
    ">50million -100million_ # of Accounts  ",
    ">100 million_Amount",
    ">100 million_  # of Borrowers",
    ">100 million_ # of Accounts  ",
    "Total_Amount",
    "  Total_# of Borrowers",
    " Total_# of Accounts  "
];

export const EE002Format = (
    returnKey: string = "INT_LON_R&R_EE002",
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

    let codeCounter = 44192;

    // 14 regions x 6 sub-rows = 84 rows
    EE002_REGIONS.forEach((regName, regIdx) => {
        const subRows = getEE002SubRows(regIdx + 1, regName);
        subRows.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : `${regName}_`;

            EE002_METRIC_SUFFIXES.forEach((suffix) => {
                const codeStr = `EE002_${codeCounter}`;
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

    // 1 Total Amount row = 24 metrics
    EE002_METRIC_SUFFIXES.forEach((suffix) => {
        const codeStr = `EE002_${codeCounter}`;
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
