export interface QI001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface QI001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: QI001ReturnItem[];
    DynamicItemsList?: any[];
}

export interface QI001ItemDefinition {
    code: string;
    desc: string;
    excelRow: number;
    excelCol: string;
    colName: string;
}

const ROWS_CONFIG: Array<{ row: number; section: string; category: string }> = [
    { row: 16, section: "1", category: "1-Cash on hand (local and  foreign currency)" },
    { row: 17, section: "2", category: "2-Claims on banks" },
    { row: 18, section: "2.1", category: "2,1-Claims on NBE" },
    { row: 19, section: "2.2", category: "2,2-Claims on other banks(Domestic & foreign)" },
    { row: 20, section: "2.2.1", category: "2.2.1-Less than 1 year maturity" },
    { row: 21, section: "2.2.2", category: "2.2.2-Over 1 year maturity" },
    { row: 22, section: "3", category: "3-Claims on government" },
    { row: 23, section: "3.1", category: "3,1-Central government" },
    { row: 24, section: "3.2", category: "3,2-Regional government" },
    { row: 25, section: "4", category: "4-Loans & advances (net)" },
    { row: 26, section: "4.1", category: "4,1-Secured by cash, central  government securities or guaranteed by central government" },
    { row: 27, section: "4.2", category: "4,2-Secured/guaranteed by regional government" },
    { row: 28, section: "4.3", category: "4,3-Residential mortgage loans" },
    { row: 29, section: "4.4", category: "4,4-Others" },
    { row: 30, section: "5", category: "5-Securities (non-government)" },
    { row: 31, section: "6", category: "6-Investments" },
    { row: 32, section: "7", category: "7-Fixed assets (net)" },
    { row: 33, section: "8", category: "8-Other assets" },
    { row: 34, section: "8.1", category: "8,1-Accounts receivable" },
    { row: 35, section: "8.2", category: "8,2-Supplies stock a/c" },
    { row: 36, section: "8.3", category: "8,3-Customers’ liabilities for L/C" },
    { row: 37, section: "8.4", category: "8,4-Uncleared effect foreign" },
    { row: 38, section: "8.5", category: "8,5-Others" },
    { row: 39, section: "9", category: "9-Total RWBSA*" }
];

const COLS_CONFIG: Array<{ col: string; name: string; suffix: string }> = [
    { col: "C", name: "Amount", suffix: "Amount" },
    { col: "D", name: "Weight (%)", suffix: "Weight (%)" },
    { col: "E", name: "Weighted Assets", suffix: "Weighted Assets" }
];

export const QI001_DESCRIPTIONS: QI001ItemDefinition[] = [];

let itemCounter = 1;
ROWS_CONFIG.forEach((r) => {
    COLS_CONFIG.forEach((c) => {
        const codeNum = String(itemCounter).padStart(5, "0");
        const code = `11_${codeNum}`;
        itemCounter++;
        QI001_DESCRIPTIONS.push({
            code,
            desc: `${r.category}_${c.suffix}`,
            excelRow: r.row,
            excelCol: c.col,
            colName: c.name
        });
    });
});
