// @ts-nocheck

export interface C5001ItemDefinition {
    code: string;
    description: string;
    dataType: string;
    required: boolean;
}

export interface C5001CellMapping {
    code: string;
    row: number;
    col: string;
    desc: string;
}

export const C5001_ITEM_DEFINITIONS: C5001ItemDefinition[] = [
    {
        code: "171_00001",
        description: "Total Commodity Instruments_Gross Commodity Position",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00002",
        description: "Total Commodity Instruments_Positive Net Open Position",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00003",
        description: "Total Commodity Instruments_15% of Net Open Position ",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00004",
        description: "Total Commodity Instruments_3% of Gross Open Position",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00005",
        description: "Capital Required Against Directional Risks (Sum of F)",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00006",
        description: "Capital Required Against Basis, Interest Rate & Forward Gap Risks (Sum of G)",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00007",
        description: "Total Capital Requirement Against Commodity Position Risk (Sum of Row 1 + Row 2)",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00008",
        description: "Commodity Position Risk Equivalent Assets (Total Capital Requirement (Row 3) * 9.1)",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00009",
        description: "Total Commodity Instruments_Gross Long",
        dataType: "NUMERIC",
        required: false
    },
    {
        code: "171_00010",
        description: "Total Commodity Instruments_Gross Short",
        dataType: "NUMERIC",
        required: false
    }
];

export const C5001_CELL_MAPPING: C5001CellMapping[] = [
    {
        code: "171_00001",
        row: 14,
        col: "D",
        desc: "Total Commodity Instruments_Gross Commodity Position"
    },
    {
        code: "171_00002",
        row: 14,
        col: "E",
        desc: "Total Commodity Instruments_Positive Net Open Position"
    },
    {
        code: "171_00003",
        row: 14,
        col: "F",
        desc: "Total Commodity Instruments_15% of Net Open Position "
    },
    {
        code: "171_00004",
        row: 14,
        col: "G",
        desc: "Total Commodity Instruments_3% of Gross Open Position"
    },
    {
        code: "171_00005",
        row: 15,
        col: "G",
        desc: "Capital Required Against Directional Risks (Sum of F)"
    },
    {
        code: "171_00006",
        row: 16,
        col: "G",
        desc: "Capital Required Against Basis, Interest Rate & Forward Gap Risks (Sum of G)"
    },
    {
        code: "171_00007",
        row: 17,
        col: "G",
        desc: "Total Capital Requirement Against Commodity Position Risk (Sum of Row 1 + Row 2)"
    },
    {
        code: "171_00008",
        row: 18,
        col: "G",
        desc: "Commodity Position Risk Equivalent Assets (Total Capital Requirement (Row 3) * 9.1)"
    },
    {
        code: "171_00009",
        row: 14,
        col: "B",
        desc: "Total Commodity Instruments_Gross Long"
    },
    {
        code: "171_00010",
        row: 14,
        col: "C",
        desc: "Total Commodity Instruments_Gross Short"
    }
];

export interface DynamicSubItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType: string;
    _required: boolean;
}

export interface DynamicAreaEntry {
    Area: number;
    _areaName: string;
    DynamicItems: DynamicSubItem[];
}

export interface C5001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface C5001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: C5001ReturnItem[];
    DynamicItemsList: DynamicAreaEntry[];
}
