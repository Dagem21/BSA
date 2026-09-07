export interface NN001RowData {
    counterpartyName: string;
    loanType: string;
    sector: string;
    loanAmount: number | string;
    recategorizationDate: string;
    status: string;
    collateralType: string;
    collateralValue: number | string;
    pctCapital: number | string;
}

export interface NN001SummaryTotals {
    loansAdvanceAmount: number | string;
    collateralValue: number | string;
    pctCapital: number | string;
}

export const NN001Format = (
    returnKey: string = "NACNN001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    totals: NN001SummaryTotals,
    borrowerRows: NN001RowData[]
) => {
    const fmt = (val: number | string | undefined | null) =>
        val !== undefined && val !== null && val !== "" ? val.toString() : "";

    const returnItems = [
        {
            Code: "151_00001",
            Value: fmt(totals.loansAdvanceAmount),
            _description: "Amount of Loans and Advance",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "151_00002",
            Value: fmt(totals.collateralValue),
            _description: "Collateral_Value",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "151_00003",
            Value: fmt(totals.pctCapital),
            _description: "Loan and Advance as a percentage of Bank's Total Capital",
            _dataType: "NUMERIC",
            _required: false
        }
    ];

    const dynamicItemsList = borrowerRows.map((row) => ({
        Area: 194,
        _areaName: "Non-Accrual to Accrual",
        DynamicItems: [
            {
                Code: "1.1",
                Value: fmt(row.counterpartyName),
                _description: "Name of the Counterparty/Borrower*",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: "1.2",
                Value: fmt(row.loanType),
                _description: "Type of Loan and Advance",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.3",
                Value: fmt(row.sector),
                _description: "Sector to which the Loan and Advance is provided",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.4",
                Value: fmt(row.loanAmount),
                _description: "Amount of Loans and Advance",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.5",
                Value: fmt(row.recategorizationDate),
                _description: "Date of Re-categorization",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.6",
                Value: fmt(row.status),
                _description: "Classification/Status of Loans and Advance",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.7",
                Value: fmt(row.collateralType),
                _description: "Collateral_Type",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.8",
                Value: fmt(row.collateralValue),
                _description: "Collateral_Value",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.9",
                Value: fmt(row.pctCapital),
                _description: "Loan and Advance as a percentage of Bank's Total Capital",
                _dataType: "NUMERIC",
                _required: false
            }
        ]
    }));

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: dynamicItemsList
    };
};
