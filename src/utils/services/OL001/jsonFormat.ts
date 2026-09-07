export interface OL001RowData {
    borrowerName: string;
    principal: number | string;
    interest: number | string;
    collateralType: string;
    askedReservePrice: number | string;
    highestOfferedBid: number | string;
    averageMarketValue: number | string;
    dateAcquired: string;
    dateReevaluated: string;
    expensesAcquisition: number | string;
    netMarketValue: number | string;
}

export interface OL001SummaryTotals {
    principalTotal: number | string;
    interestTotal: number | string;
    askedReservePriceTotal: number | string;
    highestOfferedBidTotal: number | string;
    averageMarketValueTotal: number | string;
    expensesAcquisitionTotal: number | string;
    netMarketValueTotal: number | string;
}

export const OL001Format = (
    returnKey: string = "COL_ACQ_18M_OL001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    totals: OL001SummaryTotals,
    borrowerRows: OL001RowData[]
) => {
    const fmt = (val: number | string | undefined | null) =>
        val !== undefined && val !== null && val !== "" ? val.toString() : "";

    const returnItems = [
        {
            Code: "95_00001",
            Value: fmt(totals.principalTotal),
            _description: "Total Outstanding acquired balance_Principal",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "95_00002",
            Value: fmt(totals.interestTotal),
            _description: "Total Outstanding balance_Interest",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "95_00003",
            Value: fmt(totals.askedReservePriceTotal),
            _description: "Asked /reserve Price",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "95_00004",
            Value: fmt(totals.highestOfferedBidTotal),
            _description: "Highest offered bid amount ",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "95_00005",
            Value: fmt(totals.averageMarketValueTotal),
            _description: "Average Market Value",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "95_00006",
            Value: fmt(totals.expensesAcquisitionTotal),
            _description: "Expenses related to the acquisition",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "95_00007",
            Value: fmt(totals.netMarketValueTotal),
            _description: "Net Market Value",
            _dataType: "NUMERIC",
            _required: false
        }
    ];

    const dynamicItemsList = borrowerRows.map((row) => ({
        Area: 172,
        _areaName: "Acquired Properties",
        DynamicItems: [
            {
                Code: "1.1",
                Value: fmt(row.borrowerName),
                _description: "Name of Borrower",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: "1.2",
                Value: fmt(row.principal),
                _description: "Outstanding Balance[A] Principal",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.3",
                Value: fmt(row.interest),
                _description: "Outstanding Balance[A] Interest",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.4",
                Value: fmt(row.collateralType),
                _description: "Type of Collateral",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.5",
                Value: fmt(row.askedReservePrice),
                _description: "Asked /reserve Price[B]",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.6",
                Value: fmt(row.highestOfferedBid),
                _description: "Highest offered bid amount[C]",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.7",
                Value: fmt(row.averageMarketValue),
                _description: "Average Market Value (D=B+C/2)",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.8",
                Value: fmt(row.dateAcquired),
                _description: "date acquired",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.9",
                Value: fmt(row.dateReevaluated),
                _description: "Date re-evaluated",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.10",
                Value: fmt(row.expensesAcquisition),
                _description: "Expenses related to the acquisition [E]",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.11",
                Value: fmt(row.netMarketValue),
                _description: "Net Market Value(F=D-E)",
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
