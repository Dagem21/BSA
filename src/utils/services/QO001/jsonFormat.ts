export interface QO001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface QO001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: QO001ReturnItem[];
    DynamicItemsList?: any[];
}

export interface QO001ItemDefinition {
    code: string;
    desc: string;
    excelRow: number;
    excelCol: string;
    colName: string;
}

const ROWS_CONFIG: Array<{ row: number; section: string; category: string }> = [
    { row: 16, section: "10", category: "Commitments to purchase and/or sell FCY" },
    { row: 18, section: "11.1", category: "Standby letters of credit - Federal government" },
    { row: 19, section: "11.2", category: "Standby letters of credit - Regional government" },
    { row: 20, section: "11.3", category: "Standby letters of credit - Bank (domestic/foreign)" },
    { row: 21, section: "11.4", category: "Standby letters of credit - All others" },
    { row: 23, section: "12.1", category: "Loan commitments - Federal government" },
    { row: 24, section: "12.2", category: "Loan commitments - Regional government" },
    { row: 25, section: "12.3", category: "Loan commitments - Bank (domestic/foreign)" },
    { row: 26, section: "12.4", category: "Loan commitments - All other" },
    { row: 28, section: "13.1", category: "Guarantees issued - Federal government" },
    { row: 29, section: "13.2", category: "Guarantees issued - Regional government" },
    { row: 30, section: "13.3", category: "Guarantees issued - Bank (domestic/foreign)" },
    { row: 31, section: "13.4", category: "Guarantees issued - All others" },
    { row: 33, section: "14.1", category: "Commercial letter of credit - Federal government" },
    { row: 34, section: "14.2", category: "Commercial letter of credit - Regional government" },
    { row: 35, section: "14.3", category: "Commercial letter of credit - Bank (domestic/foreign)" },
    { row: 36, section: "14.4", category: "Commercial letter of credit - All others" },
    { row: 37, section: "15", category: "Others**" },
    { row: 38, section: "16", category: "Total Risk weighted Off - BSA" }
];

const COLS_CONFIG: Array<{ col: string; name: string; suffix: string }> = [
    { col: "C", name: "Face Value", suffix: "Face Value" },
    { col: "D", name: "Credit Conv. Factor (%)", suffix: "Credit Conv. Factor (%)" },
    { col: "E", name: "Amount", suffix: "Amount" },
    { col: "F", name: "Weight (%)", suffix: "Weight (%)" },
    { col: "G", name: "Credit Equ", suffix: "Credit Equ" }
];

export const QO001_DESCRIPTIONS: QO001ItemDefinition[] = [];

let itemCounter = 1;
ROWS_CONFIG.forEach((r) => {
    COLS_CONFIG.forEach((c) => {
        const codeNum = String(itemCounter).padStart(5, "0");
        const code = `12_${codeNum}`;
        itemCounter++;
        QO001_DESCRIPTIONS.push({
            code,
            desc: `${r.category}_${c.suffix}`,
            excelRow: r.row,
            excelCol: c.col,
            colName: c.name
        });
    });
});
