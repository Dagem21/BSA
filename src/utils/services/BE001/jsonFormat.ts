export const BE001_DESCRIPTIONS: Array<{
    code: string;
    desc: string;
    excelRow: number;
    excelCode: string;
}> = [
    { code: "5_00001", desc: "1-Interest expense (sum 1.1-1.7)", excelRow: 15, excelCode: "1" },
    { code: "5_00002", desc: "1,1-Interest on savings deposits", excelRow: 16, excelCode: "1.1" },
    { code: "5_00003", desc: "1,2-Interest on demand deposit", excelRow: 17, excelCode: "1.2" },
    { code: "5_00004", desc: "1,3-Interest on time deposits", excelRow: 18, excelCode: "1.3" },
    { code: "5_00005", desc: "1,4-Interest paid on local borrowings    (sum 1.4.1-1.4.3)", excelRow: 19, excelCode: "1.4" },
    { code: "5_00006", desc: "1.4.1-NBE", excelRow: 20, excelCode: "1.4.1" },
    { code: "5_00007", desc: "1.4.2-Other banks", excelRow: 21, excelCode: "1.4.2" },
    { code: "5_00008", desc: "1.4.3- Others", excelRow: 22, excelCode: "1.4.3" },
    { code: "5_00009", desc: "1,5- Interest paid on foreign borrowings", excelRow: 23, excelCode: "1.5" },
    { code: "5_00010", desc: "1,6-Interest paid on NP special FCY accounts", excelRow: 24, excelCode: "1.6" },
    { code: "5_00011", desc: "1,7-Interest paid on correspondents’ accounts", excelRow: 25, excelCode: "1.7" },
    { code: "5_00012", desc: "2-General  and adminstrative expense (sum 2.1-2.3)", excelRow: 26, excelCode: "2" },
    { code: "5_00013", desc: "2,1-Depreciation and amortization", excelRow: 27, excelCode: "2.1" },
    { code: "5_00014", desc: "2,2-Foreign exchange trading and fluctuation losses", excelRow: 28, excelCode: "2.2" },
    { code: "5_00015", desc: "2,3-Other general expenses", excelRow: 29, excelCode: "2.3" },
    { code: "5_00016", desc: "3-Employee Salaries and Benefits  (sum 3.1-3.3)", excelRow: 30, excelCode: "3" },
    { code: "5_00017", desc: "3,1-Employee Salaries", excelRow: 31, excelCode: "3.1" },
    { code: "5_00018", desc: "3,2-Employee  Benefits", excelRow: 32, excelCode: "3.2" },
    { code: "5_00019", desc: "3,3-other", excelRow: 33, excelCode: "3.3" },
    { code: "5_00020", desc: "4-Total expense incurred(Sum 1-3)", excelRow: 34, excelCode: "4" }
];

export interface BE001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface BE001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: BE001ReturnItem[];
    DynamicItemsList?: any[];
}
