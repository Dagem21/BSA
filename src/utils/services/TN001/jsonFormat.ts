export interface TN001RowData {
    sNo: string | number;
    nameOfBorrower: string;
    loansApproved: string | number;
    loansOutstanding: string | number;
    collateralValue: string | number;
    provisionHeld: string | number;
    loanStatus: string;
}

export const TN001Format = (
    returnKey: string = "TOP_20_NPLs_TN001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string = "2026-04-01T00:00:00",
    endDate: string = "2026-06-30T00:00:00",
    returnItemsMap: Record<string, string> = {},
    dynamicRows: TN001RowData[] = []
) => {
    const fmtText = (val: any) => (val !== undefined && val !== null ? String(val).trim() : "");
    const fmtNum = (val: any) => {
        if (val === undefined || val === null) return "0";
        const s = String(val).trim();
        return (s === "" || s === "[object Object]") ? "0" : s;
    };

    const returnItemsOrder = [
        { code: "10_00001", desc: "Sub total top ten (10) NPLs_Loans Outstanding" },
        { code: "10_00002", desc: "Sub total top ten (10) NPLs_Provision Held" },
        { code: "10_00003", desc: "Grand total top twenty (20) NPLs_Loans Approved" },
        { code: "10_00004", desc: "Sub total top ten (10) NPLs_Collateral value" },
        { code: "10_00005", desc: "Sub total top ten (10) NPLs_Loans Approved" },
        { code: "10_00006", desc: "Grand total top twenty (20) NPLs_Loans Outstanding" },
        { code: "10_00007", desc: "Grand total top twenty (20) NPLs_Collateral value" },
        { code: "10_00008", desc: "Grand total top twenty (20) NPLs_Provision held" }
    ];

    const returnItemsList = returnItemsOrder.map((it) => ({
        Code: it.code,
        Value: fmtNum(returnItemsMap[it.code]),
        _description: it.desc,
        _dataType: "NUMERIC",
        _required: false
    }));

    const dynamicItemsList: any[] = [];
    for (let i = 1; i <= 20; i++) {
        const row = dynamicRows[i - 1] || ({} as TN001RowData);
        dynamicItemsList.push({
            Area: 171,
            _areaName: "",
            DynamicItems: [
                {
                    Code: `${i}.1`,
                    Value: fmtText(row.sNo || i),
                    _description: "S.No.",
                    _dataType: "TEXT",
                    _required: true
                },
                {
                    Code: `${i}.2`,
                    Value: fmtText(row.nameOfBorrower),
                    _description: "Name of Borrower",
                    _dataType: "TEXT",
                    _required: false
                },
                {
                    Code: `${i}.3`,
                    Value: fmtNum(row.loansApproved),
                    _description: "Loans Approved",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.4`,
                    Value: fmtNum(row.loansOutstanding),
                    _description: "Loans Outstanding",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.5`,
                    Value: fmtNum(row.collateralValue),
                    _description: "Collateral Value ",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.6`,
                    Value: fmtNum(row.provisionHeld),
                    _description: "Provision held",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.7`,
                    Value: fmtText(row.loanStatus),
                    _description: "Loan Status",
                    _dataType: "TEXT",
                    _required: false
                }
            ]
        });
    }

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
