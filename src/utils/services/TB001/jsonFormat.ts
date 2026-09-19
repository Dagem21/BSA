export interface TB001RowData {
    sNo: string | number;
    nameOfBorrower: string;
    collateralValue: string | number;
    banksCapital: string | number;
    approvedLoan: string | number;
    outstandingBalance: string | number;
    offBalanceSheet: string | number;
    totalOutstandingExposure: string | number;
    pctCapital: string | number;
    status: string;
}

export const TB001Format = (
    returnKey: string = "TOP_20_BOR_TB001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string = "2026-04-01T00:00:00",
    endDate: string = "2026-06-30T00:00:00",
    returnItemsMap: Record<string, string> = {},
    dynamicRows: TB001RowData[] = []
) => {
    const fmtText = (val: any) => (val !== undefined && val !== null ? String(val).trim() : "");
    const fmtNum = (val: any) => {
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

    // 14_00001: Name of Borrower_1
    returnItemsList.push({
        Code: "14_00001",
        Value: fmtText(returnItemsMap["14_00001"]),
        _description: "Name of Borrower_1",
        _dataType: "TEXT",
        _required: false
    });

    // 14_00002 to 14_00019: Name of Borrower_3 to Name of Borrower_20
    for (let i = 3; i <= 20; i++) {
        const codeStr = `14_${(i - 1).toString().padStart(5, "0")}`;
        returnItemsList.push({
            Code: codeStr,
            Value: fmtText(returnItemsMap[codeStr]),
            _description: `Name of Borrower_${i}`,
            _dataType: "TEXT",
            _required: false
        });
    }

    // Sub total items (14_00020 to 14_00023)
    const subTotalDesc = [
        "Sub total top ten(10) borrowers_Approved loan",
        "Sub total top ten(10) borrowers_Outstanding balance",
        "Sub total top ten(10) borrowers_Off balance sheet",
        "Sub total top ten(10) borrowers_Total outstanding exposure"
    ];
    for (let i = 0; i < 4; i++) {
        const codeStr = `14_${(20 + i).toString().padStart(5, "0")}`;
        returnItemsList.push({
            Code: codeStr,
            Value: fmtNum(returnItemsMap[codeStr]),
            _description: subTotalDesc[i],
            _dataType: "NUMERIC",
            _required: false
        });
    }

    // Grand total items (14_00024 to 14_00027)
    const grandTotalDesc = [
        "Grand total top twenty (20) borrowers_Approved loan",
        "Grand total top twenty (20) borrowers_Outstanding balance",
        "Grand total top twenty (20) borrowers_Off balance sheet",
        "Grand total top twenty (20) borrowers_Total outstanding exposure"
    ];
    for (let i = 0; i < 4; i++) {
        const codeStr = `14_${(24 + i).toString().padStart(5, "0")}`;
        returnItemsList.push({
            Code: codeStr,
            Value: fmtNum(returnItemsMap[codeStr]),
            _description: grandTotalDesc[i],
            _dataType: "NUMERIC",
            _required: false
        });
    }

    // Outstanding balance_1 to Outstanding balance_20 (14_00028 to 14_00047)
    for (let i = 1; i <= 20; i++) {
        const codeStr = `14_${(27 + i).toString().padStart(5, "0")}`;
        returnItemsList.push({
            Code: codeStr,
            Value: fmtNum(returnItemsMap[codeStr]),
            _description: `Outstanding balance_${i}`,
            _dataType: "NUMERIC",
            _required: false
        });
    }

    // Off balance sheet_1 to Off balance sheet_20 (14_00048 to 14_00067)
    for (let i = 1; i <= 20; i++) {
        const codeStr = `14_${(47 + i).toString().padStart(5, "0")}`;
        returnItemsList.push({
            Code: codeStr,
            Value: fmtNum(returnItemsMap[codeStr]),
            _description: `Off balance sheet_${i}`,
            _dataType: "NUMERIC",
            _required: false
        });
    }

    // Total outstanding exposure_1 to Total outstanding exposure_20 (14_00068 to 14_00087)
    for (let i = 1; i <= 20; i++) {
        const codeStr = `14_${(67 + i).toString().padStart(5, "0")}`;
        returnItemsList.push({
            Code: codeStr,
            Value: fmtNum(returnItemsMap[codeStr]),
            _description: `Total outstanding exposure_${i}`,
            _dataType: "NUMERIC",
            _required: false
        });
    }

    // 14_00088: Name of Borrower_2
    returnItemsList.push({
        Code: "14_00088",
        Value: fmtText(returnItemsMap["14_00088"]),
        _description: "Name of Borrower_2",
        _dataType: "TEXT",
        _required: false
    });

    // DynamicItemsList (20 rows)
    const dynamicItemsList: any[] = [];
    for (let i = 1; i <= 20; i++) {
        const row = dynamicRows[i - 1] || ({} as TB001RowData);
        dynamicItemsList.push({
            Area: 188,
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
                    Value: fmtNum(row.collateralValue),
                    _description: "Collateral Value ",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.4`,
                    Value: fmtNum(row.banksCapital),
                    _description: "Bank's Capital  (excluding retained earnings & Provisional profit/loss)",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.5`,
                    Value: fmtNum(row.approvedLoan),
                    _description: "Outstanding Exposure_On balance sheet_Approved loan",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.6`,
                    Value: fmtNum(row.outstandingBalance),
                    _description: "Outstanding Exposure_On balance sheet_Outstanding balance  ",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.7`,
                    Value: fmtNum(row.offBalanceSheet),
                    _description: "Outstanding Exposure_Off balance sheet",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.8`,
                    Value: fmtNum(row.totalOutstandingExposure),
                    _description: "Total outstanding exposure",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.9`,
                    Value: fmtNum(row.pctCapital),
                    _description: "% of Capital ",
                    _dataType: "NUMERIC",
                    _required: false
                },
                {
                    Code: `${i}.10`,
                    Value: fmtText(row.status),
                    _description: "Status ",
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
