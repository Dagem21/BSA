export interface MA001ItemValue {
    Code: string;
    Value: string;
    _description: string;
    _dataType: string;
    _required: boolean;
}

export const MA001_ROW_DESCRIPTIONS: string[] = [
    "ASSETS",
    "On balance sheet",
    "Cash and balances due from NBE",
    "Balances due from banks and non-bank -local",
    "Balances due from banks -abroad",
    "Net investment",
    " Net loans and advances",
    "Net fixed assets",
    "Others",
    "Off balance sheet ",
    "Guarantee",
    " Letters of credit ",
    "Others",
    "TOTAL",
    "LIABILITIES ",
    "On balance sheet",
    "Deposits (demand, savings & time)",
    "Borrowing from the NBE",
    "Borrowing from other bank -local",
    "Borrowing from other bank-abroad",
    "Other liabilities",
    "Off balance sheet ",
    "Guarantee",
    "Letters of credit ",
    "Others",
    "TOTAL",
    "NET Mismatch (1.3 LESS 2.3)",
    "Cumulative Mismatch"
];

export const MA001_COL_SUFFIXES: string[] = [
    "Amount",
    "1 day",
    "2-7 days",
    "8-14 days",
    "15 days to 1month",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "1-3 years ",
    "Over 3 years",
    "Non-maturity",
    "Total"
];

export const MA001Format = (
    returnKey: string = "NBE_MAT_ANL_MA001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    itemValues: Record<string, string | number> = {}
) => {
    const fmt = (val: number | string | undefined | null) =>
        val !== undefined && val !== null && val !== "" ? val.toString() : "";

    const returnItemsList: MA001ItemValue[] = [];
    let itemCodeNum = 1;

    for (let r = 0; r < MA001_ROW_DESCRIPTIONS.length; r++) {
        const rowDesc = MA001_ROW_DESCRIPTIONS[r];
        for (let c = 0; c < MA001_COL_SUFFIXES.length; c++) {
            const colSuffix = MA001_COL_SUFFIXES[c];
            const codeStr = `20_${itemCodeNum.toString().padStart(5, "0")}`;
            const fullDesc = `${rowDesc}_${colSuffix}`;
            const rawVal = itemValues[codeStr];

            returnItemsList.push({
                Code: codeStr,
                Value: fmt(rawVal),
                _description: fullDesc,
                _dataType: "NUMERIC",
                _required: false
            });

            itemCodeNum++;
        }
    }

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItemsList
    };
};
