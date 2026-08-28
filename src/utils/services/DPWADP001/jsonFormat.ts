export interface DPWADP001RowData {
    depositType: string;
    depositCategory: string;
    totalDepositAmount: number | string;
    noOfAccounts: number | string;
    minRate: number | string;
    maxRate: number | string;
    weightedAvgRateCategory: number | string;
    weightedAvgRateType: number | string;
}

export const DPWADP001_COLUMNS = [
    {
        Code: "1.1",
        _description: "Deposit Type ",
        _dataType: "DATE",
        _required: true
    },
    {
        Code: "1.2",
        _description: "Deposit Category ",
        _dataType: "TEXT",
        _required: true
    },
    {
        Code: "1.3",
        _description: "Total Deposit Amount  ( in Mn Birr)",
        _dataType: "NUMERIC",
        _required: true
    },
    {
        Code: "1.4",
        _description: "No. of Deposit Accounts by Category",
        _dataType: "NUMERIC",
        _required: true
    },
    {
        Code: "1.5",
        _description: `Lending Interest Rates (% per annum)_ Minimum Rate \nby Deposit \ncategory`,
        _dataType: "NUMERIC",
        _required: true
    },
    {
        Code: "1.6",
        _description: `Lending Interest Rates (% per annum)_ Maximum Rate \nby Deposit \ncategory`,
        _dataType: "NUMERIC",
        _required: true
    },
    {
        Code: "1.7",
        _description: `Lending Interest Rates (% per annum)_ Weighted \nAverage Rate \nby Deposit \ncategory `,
        _dataType: "NUMERIC",
        _required: true
    },
    {
        Code: "1.8",
        _description: `Lending Interest Rates (% per annum)_ Weighted Average Rate \nby Deposit Type`,
        _dataType: "NUMERIC",
        _required: true
    }
];

export const DPWADP001Format = (
    returnKey: string = "DPWADP001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: DPWADP001RowData[] = []
) => {
    const fmt = (val: string | number | undefined | null) =>
        val !== undefined && val !== null ? val.toString() : "";

    const dynamicItems = rowsData.map((row) => [
        {
            Code: "1.1",
            Value: fmt(row.depositType),
            _description: "Deposit Type ",
            _dataType: "DATE",
            _required: true
        },
        {
            Code: "1.2",
            Value: fmt(row.depositCategory),
            _description: "Deposit Category ",
            _dataType: "TEXT",
            _required: true
        },
        {
            Code: "1.3",
            Value: fmt(row.totalDepositAmount),
            _description: "Total Deposit Amount  ( in Mn Birr)",
            _dataType: "NUMERIC",
            _required: true
        },
        {
            Code: "1.4",
            Value: fmt(row.noOfAccounts),
            _description: "No. of Deposit Accounts by Category",
            _dataType: "NUMERIC",
            _required: true
        },
        {
            Code: "1.5",
            Value: fmt(row.minRate),
            _description: `Lending Interest Rates (% per annum)_ Minimum Rate \nby Deposit \ncategory`,
            _dataType: "NUMERIC",
            _required: true
        },
        {
            Code: "1.6",
            Value: fmt(row.maxRate),
            _description: `Lending Interest Rates (% per annum)_ Maximum Rate \nby Deposit \ncategory`,
            _dataType: "NUMERIC",
            _required: true
        },
        {
            Code: "1.7",
            Value: fmt(row.weightedAvgRateCategory),
            _description: `Lending Interest Rates (% per annum)_ Weighted \nAverage Rate \nby Deposit \ncategory `,
            _dataType: "NUMERIC",
            _required: true
        },
        {
            Code: "1.8",
            Value: fmt(row.weightedAvgRateType),
            _description: `Lending Interest Rates (% per annum)_ Weighted Average Rate \nby Deposit Type`,
            _dataType: "NUMERIC",
            _required: true
        }
    ]);

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: [],
        DynamicItemsList: [
            {
                Area: 216,
                _areaName: "Monthly Weighted Average Deposit Profit Rates (Interest-Free Banks)",
                DynamicItems: dynamicItems
            }
        ]
    };
};
