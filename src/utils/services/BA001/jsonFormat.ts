export const BA001_DESCRIPTIONS: Array<{
    code: string;
    desc: string;
    excelRow: number;
    excelCode: string;
}> = [
    { code: "4_00001", desc: "Interest income (1.1+1.2)", excelRow: 15, excelCode: "1" },
    { code: "4_00002", desc: "Domestic (sum 1.1.1-1.1.7)", excelRow: 16, excelCode: "1.1" },
    { code: "4_00003", desc: "Loans (sum1.1.1.1-1.1.1.3)", excelRow: 17, excelCode: "1.1.1" },
    { code: "4_00004", desc: "Banks", excelRow: 18, excelCode: "1.1.1.1" },
    { code: "4_00005", desc: "Non-bank financial institutions", excelRow: 19, excelCode: "1.1.1.2" },
    { code: "4_00006", desc: "Others", excelRow: 20, excelCode: "1.1.1.3" },
    { code: "4_00007", desc: "Federal government bonds", excelRow: 21, excelCode: "1.1.2" },
    { code: "4_00008", desc: "Treasury bills", excelRow: 22, excelCode: "1.1.3" },
    { code: "4_00009", desc: "NBE bills", excelRow: 23, excelCode: "1.1.4" },
    { code: "4_00010", desc: "DBE-Bonds", excelRow: 24, excelCode: "1.1.5" },
    { code: "4_00011", desc: "Corporate bonds", excelRow: 25, excelCode: "1.1.6" },
    { code: "4_00012", desc: "Others", excelRow: 26, excelCode: "1.1.7" },
    { code: "4_00013", desc: "Foreign (sum 1.2.1-1.2.3)", excelRow: 27, excelCode: "1.2" },
    { code: "4_00014", desc: "Income on correspondent accounts", excelRow: 28, excelCode: "1.2.1" },
    { code: "4_00015", desc: "Securities", excelRow: 29, excelCode: "1.2.2" },
    { code: "4_00016", desc: "Call accounts", excelRow: 30, excelCode: "1.2.3" },
    { code: "4_00017", desc: "Service charges and commissions (sum 2.1-2.8)", excelRow: 31, excelCode: "2" },
    { code: "4_00018", desc: "Commission income", excelRow: 32, excelCode: "2.1" },
    { code: "4_00019", desc: "Letters of guarantee", excelRow: 33, excelCode: "2.2" },
    { code: "4_00020", desc: "Letters of credit", excelRow: 34, excelCode: "2.3" },
    { code: "4_00021", desc: "Documentary collection", excelRow: 35, excelCode: "2.4" },
    { code: "4_00022", desc: "Foreign exchange transfers", excelRow: 36, excelCode: "2.5" },
    { code: "4_00023", desc: "Local transfers", excelRow: 37, excelCode: "2.6" },
    { code: "4_00024", desc: "Negotiation of cheques, CPOs", excelRow: 38, excelCode: "2.7" },
    { code: "4_00025", desc: "Others", excelRow: 39, excelCode: "2.8" },
    { code: "4_00026", desc: "Other income (sum 3.1-3.6)", excelRow: 40, excelCode: "3" },
    { code: "4_00027", desc: "Postage, telegram, telephone, telex, swift", excelRow: 41, excelCode: "3.1" },
    { code: "4_00028", desc: "Foreign exchange trading  and  fluctuation gains (3.2.1+3.2.2)", excelRow: 42, excelCode: "3.2" },
    { code: "4_00029", desc: "Foreign exchange trading", excelRow: 43, excelCode: "3.2.1" },
    { code: "4_00030", desc: "Foreign exchange  fluctuation gains", excelRow: 44, excelCode: "3.2.2" },
    { code: "4_00031", desc: "Transfer from specific loan provisions", excelRow: 45, excelCode: "3.3" },
    { code: "4_00032", desc: "Extraordinary income", excelRow: 46, excelCode: "3.4" },
    { code: "4_00033", desc: "Bad debts collected", excelRow: 47, excelCode: "3.5" },
    { code: "4_00034", desc: "Others", excelRow: 48, excelCode: "3.6" },
    { code: "4_00035", desc: "Total income earned (sum 1-3)", excelRow: 49, excelCode: "4" }
];

export interface BA001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface BA001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: BA001ReturnItem[];
    DynamicItemsList?: any[];
}
