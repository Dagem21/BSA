export interface MK001SummaryTotals {
    totalAssets: number | string;
    totalLoansBonds: number | string;
    ofWhichBonds: number | string;
    demandDeposits: number | string;
    savingDeposits: number | string;
    timeDeposits: number | string;
    totalCapitalReserves: number | string;
    totalDeposits: number | string;
}

export const MK001Format = (
    returnKey: string = "Key Balance SheetMK001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    totals?: MK001SummaryTotals
) => {
    const fmt = (val: number | string | undefined | null) =>
        val !== undefined && val !== null && val !== "" ? val.toString() : "";

    const returnItems = [
        {
            Code: "107_00001",
            Value: fmt(totals?.totalAssets),
            _description: "Total assets",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00002",
            Value: fmt(totals?.totalLoansBonds),
            _description: "Total loans and bonds",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00003",
            Value: fmt(totals?.ofWhichBonds),
            _description: "Of which bonds",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00004",
            Value: fmt(totals?.demandDeposits),
            _description: "Demand/Current deposits",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00005",
            Value: fmt(totals?.savingDeposits),
            _description: "Saving deposits",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00006",
            Value: fmt(totals?.timeDeposits),
            _description: "Time/Fixed deposits",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00007",
            Value: fmt(totals?.totalCapitalReserves),
            _description: "Total capital & reserves",
            _dataType: "NUMERIC",
            _required: false
        },
        {
            Code: "107_00008",
            Value: fmt(totals?.totalDeposits),
            _description: "Total deposits",
            _dataType: "NUMERIC",
            _required: false
        }
    ];

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
};
