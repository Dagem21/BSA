export interface MWAL001RowData {
    sector: string;
    loanCategory: string;
    outstandingLoan: string | number;
    noOfLoanAccounts: string | number;
    lendingInterestRates: string | number;
    maximumRate: string | number;
    weighted: string | number;
    weightedAverageRate: string | number;
}

export const MWAL001Format = (
    returnKey: string = "IFBLCMWAL001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: MWAL001RowData[] = []
) => {
    const fmt = (val: string | number | undefined | null) => {
        if (val !== undefined && val !== null && val !== "") {
            return val.toString();
        }
        return "0";
    };

    const dynamicItems = rowsData.map((row, index) => {
        const rowNum = index + 1;
        return [
            {
                Code: `${rowNum}.1`,
                Value: fmt(row.sector),
                _description: "Sector",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.2`,
                Value: fmt(row.loanCategory),
                _description: "Loan Category ",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.3`,
                Value: fmt(row.outstandingLoan),
                _description: "Outstanding Loan & \nAdvance ( in\nMn Birr)",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.4`,
                Value: fmt(row.noOfLoanAccounts),
                _description: "No. of Loan \nAccounts by \nLoan Category ",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.5`,
                Value: fmt(row.lendingInterestRates),
                _description: "Lending Interest Rates (% per annum) ",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.6`,
                Value: fmt(row.maximumRate),
                _description: "Lending Interest Rates (% per annum) _Maximum Rate ",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.7`,
                Value: fmt(row.weighted),
                _description: "Lending Interest Rates (% per annum)_ Weighted ",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: `${rowNum}.8`,
                Value: fmt(row.weightedAverageRate),
                _description: "Lending Interest Rates (% per annum)_Weighted Average Rate ",
                _dataType: "TEXT",
                _required: false
            }
        ];
    });

    const dynamicItemsList = dynamicItems.length > 0 ? [
        {
            Area: 214,
            _areaName: "Monthly Weighted Average Lending Profit Rates (Interest-Free Banks) ",
            DynamicItems: dynamicItems.flat()
        }
    ] : [];

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: [],
        DynamicItemsList: dynamicItemsList
    };
};
