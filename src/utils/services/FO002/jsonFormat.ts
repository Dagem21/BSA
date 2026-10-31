export interface FO002ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface FO002DynamicItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface FO002DynamicEntry {
    Area: number;
    _areaName: string;
    DynamicItems: FO002DynamicItem[];
}

export interface FO002JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: FO002ReturnItem[];
    DynamicItemsList: FO002DynamicEntry[];
}

export const FO002_RETURN_ITEMS_DEF: Array<{
    code: string;
    desc: string;
    dataType: string;
    colIndex: number; // 4=D, 5=E, 6=F, 7=G, 8=H, 9=I, 10=J, 11=K, 12=L, 13=M
    colLetter: string;
}> = [
    {
        code: "117_00001",
        desc: "Total_ Fraud cases outstanding as of  the end of the previous quarter_Number (A)",
        dataType: "NUMERIC",
        colIndex: 4,
        colLetter: "D"
    },
    {
        code: "117_00002",
        desc: "Total_Fraud cases outstanding as of  the end of the previous quarter_Amount (B)",
        dataType: "NUMERIC",
        colIndex: 5,
        colLetter: "E"
    },
    {
        code: "117_00003",
        desc: "Total_New fraud cases reported during the current quarter_Number (C)",
        dataType: "NUMERIC",
        colIndex: 6,
        colLetter: "F"
    },
    {
        code: "117_00004",
        desc: "Total_New fraud cases reported during the current quarter_Amount (D)",
        dataType: "NUMERIC",
        colIndex: 7,
        colLetter: "G"
    },
    {
        code: "117_00005",
        desc: "Fraud amount recovered during the current quarter_Number  (E)",
        dataType: "NUMERIC",
        colIndex: 8,
        colLetter: "H"
    },
    {
        code: "117_00006",
        desc: "Fraud amount recovered during the current quarter_Amount  (F)",
        dataType: "NUMERIC",
        colIndex: 9,
        colLetter: "I"
    },
    {
        code: "117_00007",
        desc: "Fraud outstanding at the end of the current quarter_Number  (G=A+C-E)",
        dataType: "NUMERIC",
        colIndex: 10,
        colLetter: "J"
    },
    {
        code: "117_00008",
        desc: "Total_Fraud amount written off during the current quarter (I)",
        dataType: "NUMERIC",
        colIndex: 12,
        colLetter: "L"
    },
    {
        code: "117_00009",
        desc: "Total_Provision held for  fraud  outstanding as of end of current quarter (J)",
        dataType: "NUMERIC",
        colIndex: 13,
        colLetter: "M"
    },
    {
        code: "117_00010",
        desc: "Fraud  outstanding at the end of the current quarter_Amount (H=B+D-F)",
        dataType: "NUMERIC",
        colIndex: 11,
        colLetter: "K"
    }
];

export const FO002_DYNAMIC_ITEMS_DEF: Array<{
    code: string;
    desc: string;
    dataType: string;
    required: boolean;
    colIndex: number;
    colLetter: string;
}> = [
    {
        code: "1.1",
        desc: "Code",
        dataType: "NUMERIC",
        required: true,
        colIndex: 1,
        colLetter: "A"
    },
    {
        code: "1.2",
        desc: "Category",
        dataType: "TEXT",
        required: false,
        colIndex: 2,
        colLetter: "B"
    },
    {
        code: "1.3",
        desc: "Type of Fraud",
        dataType: "TEXT",
        required: false,
        colIndex: 3,
        colLetter: "C"
    },
    {
        code: "1.4",
        desc: "Fraud cases outstanding as of  the end of the previous quarter_Number( A",
        dataType: "NUMERIC",
        required: false,
        colIndex: 4,
        colLetter: "D"
    },
    {
        code: "1.5",
        desc: "Fraud cases outstanding as of  the end of the previous quarter_Amount (B)",
        dataType: "NUMERIC",
        required: false,
        colIndex: 5,
        colLetter: "E"
    },
    {
        code: "1.6",
        desc: "New fraud cases reported during the current quarter_Number  (C)",
        dataType: "NUMERIC",
        required: false,
        colIndex: 6,
        colLetter: "F"
    },
    {
        code: "1.7",
        desc: "New fraud cases reported during the current quarter_Amount (D",
        dataType: "NUMERIC",
        required: false,
        colIndex: 7,
        colLetter: "G"
    },
    {
        code: "1.8",
        desc: "Fraud amount recovered during the current quarter_Number (E",
        dataType: "NUMERIC",
        required: false,
        colIndex: 8,
        colLetter: "H"
    },
    {
        code: "1.9",
        desc: "Fraud amount recovered during the current quarter_Amount (F) ",
        dataType: "NUMERIC",
        required: false,
        colIndex: 9,
        colLetter: "I"
    },
    {
        code: "1.10",
        desc: "Fraud  outstanding at the end of the current quarter_Number  (G=A+C-E)",
        dataType: "NUMERIC",
        required: false,
        colIndex: 10,
        colLetter: "J"
    },
    {
        code: "1.11",
        desc: "Fraud  outstanding at the end of the current quarter_Amount (H=B+D-F)",
        dataType: "NUMERIC",
        required: false,
        colIndex: 11,
        colLetter: "K"
    },
    {
        code: "1.12",
        desc: "Fraud amount written off during the current quarter (I)",
        dataType: "NUMERIC",
        required: false,
        colIndex: 12,
        colLetter: "L"
    },
    {
        code: "1.13",
        desc: "Provision held for  fraud  outstanding as of end of current quaterer (J)",
        dataType: "NUMERIC",
        required: false,
        colIndex: 13,
        colLetter: "M"
    }
];

export function buildFO002EmptyDynamicRow(code: string = "1"): FO002DynamicEntry {
    return {
        Area: 193,
        _areaName: "fraud_outstanding",
        DynamicItems: FO002_DYNAMIC_ITEMS_DEF.map((def) => ({
            Code: def.code,
            Value: def.code === "1.1" ? code : "",
            _description: def.desc,
            _dataType: def.dataType,
            _required: def.required
        }))
    };
}
