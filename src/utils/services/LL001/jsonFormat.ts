export interface LL001RowData {
    borrowerName: string;
    principal: string | number;
    interest: string | number;
    propertyType: string;
    estimatedValue: string | number;
    dateSold: string;
    salesValue: string | number;
    disposalExpenses: string | number;
    netRealizedValue: string | number;
}

export interface LL001SummaryTotals {
    totalInterest: string | number;
    totalSalesValue: string | number;
    totalDisposalExpenses: string | number;
    totalNetRealizedValue: string | number;
    totalPrincipal: string | number;
}

export const LL001Format = (
    returnKey: string = "COL_SOL_18M_LL001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    totals: LL001SummaryTotals,
    borrowerRows: LL001RowData[] = []
) => {
    const fmt = (val: string | number | null | undefined): string => {
        if (val === null || val === undefined) return "0";
        const str = val.toString().trim();
        return str === "" ? "0" : str;
    };

    const returnItemsList = [
        {
            Code: "94_00001",
            Value: fmt(totals.totalInterest),
            _description: "Total Outstanding balance_Interest",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "94_00002",
            Value: fmt(totals.totalSalesValue),
            _description: "Total Collateral_Sales value",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "94_00003",
            Value: fmt(totals.totalDisposalExpenses),
            _description: "Total Collateral_Expenses related to Disposal",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "94_00004",
            Value: fmt(totals.totalNetRealizedValue),
            _description: "Total Collateral_Net realized value",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "94_00005",
            Value: fmt(totals.totalPrincipal),
            _description: "Total Outstanding foreclosed balance_Principal",
            _dataType: "NUMERIC",
            _required: false
        }
    ];

    const dynamicItemsList = borrowerRows.map((row) => ({
        Area: 187,
        _areaName: "Foreclosed Properties",
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
                Value: fmt(row.propertyType),
                _description: "Type of property/collateral [B]",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.5",
                Value: fmt(row.estimatedValue),
                _description: "Estimated Value at the time of loan extension [C]",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.6",
                Value: fmt(row.dateSold),
                _description: "Date of foreclosure & sold[D]",
                _dataType: "TEXT",
                _required: false
            },
            {
                Code: "1.7",
                Value: fmt(row.salesValue),
                _description: "Sales value[E]",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.8",
                Value: fmt(row.disposalExpenses),
                _description: "Expenses related to Disposal*[F]",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "1.9",
                Value: fmt(row.netRealizedValue),
                _description: "Net realized value [G=E-F]",
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
        ReturnItemsList: returnItemsList,
        DynamicItemsList: dynamicItemsList
    };
};
