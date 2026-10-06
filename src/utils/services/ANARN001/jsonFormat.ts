export const ANARN001_DESCRIPTIONS: Array<{
    code: string;
    desc: string;
    excelRow: number;
    excelCol: string;
}> = [
    {
        code: "149_00001",
        desc: "Loans and Advance Re-Categorized from Non-Accrual To Accrual Status at the end of the previous quarter_Number* of  Loans and Advances Re-Categorized from Non-Accrual To Accrual Status",
        excelRow: 16,
        excelCol: "C"
    },
    {
        code: "149_00002",
        desc: "Loans and Advance Re-Categorized from Non-Accrual To Accrual Status at the end of the previous quarter_Amount of  Loans and Advance Re-Categorized from Non-Accrual To Accrual Status",
        excelRow: 16,
        excelCol: "D"
    },
    {
        code: "149_00003",
        desc: "Loans and Advance Re-Categorized from Non-Accrual To Accrual Status during the quarter_Number* of  Loans and Advances Re-Categorized from Non-Accrual To Accrual Status",
        excelRow: 17,
        excelCol: "C"
    },
    {
        code: "149_00004",
        desc: "Loans and Advance Re-Categorized from Non-Accrual To Accrual Status during the quarter_Amount of  Loans and Advance Re-Categorized from Non-Accrual To Accrual Status",
        excelRow: 17,
        excelCol: "D"
    },
    {
        code: "149_00005",
        desc: "Total  Loans and Advances Re-Categorized from Non-Accrual To Accrual Status_Number* of  Loans and Advances Re-Categorized from Non-Accrual To Accrual Status",
        excelRow: 18,
        excelCol: "C"
    },
    {
        code: "149_00006",
        desc: "Total  Loans and Advances Re-Categorized from Non-Accrual To Accrual Status_Amount of  Loans and Advance Re-Categorized from Non-Accrual To Accrual Status",
        excelRow: 18,
        excelCol: "D"
    }
];

export interface ANARN001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface ANARN001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: ANARN001ReturnItem[];
    DynamicItemsList?: any[];
}
