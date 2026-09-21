export const QC001_DESCRIPTIONS: Array<{
    code: string;
    desc: string;
    excelRow: number;
    excelCode: string;
}> = [
    { code: "13_00001", desc: "TOTAL CAPITAL (17.1+17.2)", excelRow: 15, excelCode: "17" },
    { code: "13_00002", desc: "Primary capital(sum 17.1.1-17.1.3)", excelRow: 16, excelCode: "17.1" },
    { code: "13_00003", desc: "Paid up capital", excelRow: 17, excelCode: "17.1.1" },
    { code: "13_00013", desc: "Share Premium", excelRow: 18, excelCode: "17.1.2" },
    { code: "13_00004", desc: "General reserves", excelRow: 19, excelCode: "17.1.3" },
    { code: "13_00005", desc: "Legal reserves", excelRow: 20, excelCode: "17.1.4" },
    { code: "13_00006", desc: "Supplementary capital (specify)", excelRow: 21, excelCode: "17.2" },
    { code: "13_00007", desc: "Risk-weighted assets (RWA) (18.1+18.2)", excelRow: 22, excelCode: "18" },
    { code: "13_00008", desc: "On balance sheet (9)", excelRow: 23, excelCode: "18.1" },
    { code: "13_00009", desc: "Off balance sheet (16)", excelRow: 24, excelCode: "18.2" },
    { code: "13_00010", desc: "Ratios (%)", excelRow: 25, excelCode: "19" },
    { code: "13_00011", desc: "Primary capital to RWA  (17.1/18)", excelRow: 26, excelCode: "19.1" },
    { code: "13_00012", desc: "Total capital to RWA (17/18)", excelRow: 27, excelCode: "19.2" }
];

export interface QC001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface QC001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: QC001ReturnItem[];
    DynamicItemsList?: any[];
}
