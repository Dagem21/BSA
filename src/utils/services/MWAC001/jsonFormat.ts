export interface MWAC001RowData {
    sector: string;
    loanCategory: string;
    outstandingLoan: string | number;
    noOfLoanAccounts: string | number;
    minimumRate: string | number;
    maximumRate: string | number;
    weightedAverageLoanCategory: string | number;
    weightedAverageSector: string | number;
}

export const MWAC001Format = (
    returnKey: string = "LCMWAC001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: MWAC001RowData[] = []
) => {
    const fmt = (val: string | number | undefined | null) => {
        if (val !== undefined && val !== null) {
            const str = val.toString().trim();
            if (
                str !== "" &&
                str !== "-" &&
                str !== "—" &&
                str !== "–" &&
                str !== "--" &&
                str.toLowerCase() !== "n/a" &&
                str.toLowerCase() !== "nil"
            ) {
                return str;
            }
        }
        return "";
    };

    const dynamicItems = rowsData.map((row, index) => {
        const rowNum = index + 1;
        return [
            {
                Code: `${rowNum}.1`,
                Value: fmt(row.sector),
                _description: "Sector",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.2`,
                Value: fmt(row.loanCategory),
                _description: "Loan Category ",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.3`,
                Value: fmt(row.outstandingLoan),
                _description: "Outstanding Loan & Advance ( in Mn Birr)",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.4`,
                Value: fmt(row.noOfLoanAccounts),
                _description: "No. of Loan Accounts by Loan Category",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.5`,
                Value: fmt(row.minimumRate),
                _description: "Lending Interest Rates (% per annum) _Minimum Rate \nby loan \ncategory",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.6`,
                Value: fmt(row.maximumRate),
                _description: "Lending Interest Rates (% per annum)_ Maximum Rate \nby loan \ncategory",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.7`,
                Value: fmt(row.weightedAverageLoanCategory),
                _description: "Lending Interest Rates (% per annum)_ Weighted \nAverage Rate \nby loan \ncategory ",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.8`,
                Value: fmt(row.weightedAverageSector),
                _description: "Lending Interest Rates (% per annum)_ Weighted Average Rate by Sector",
                _dataType: "NUMERIC",
                _required: true
            }
        ];
    });

    const dynamicItemsList = [
        {
            Area: 213,
            _areaName: "Monthly Weighted Average Lending Interest Rates (Conventional Banks)",
            DynamicItems: dynamicItems.flat()
        }
    ];

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
