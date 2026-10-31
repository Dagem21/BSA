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
    defaultFactor?: string;
    defaultWeight?: string;
}

export const QO001_ROWS_CONFIG: Array<{ row: number; section: string; category: string; defaultFactor: string; defaultWeight: string }> = [
    { row: 16, section: "10", category: "Commitments to purchase  and/or sell FCY", defaultFactor: "1", defaultWeight: "1" },
    { row: 18, section: "11.1", category: "Federal government", defaultFactor: "1", defaultWeight: "0" },
    { row: 19, section: "11.2", category: "Regional government", defaultFactor: "1", defaultWeight: "0.2" },
    { row: 20, section: "11.3", category: "Bank (domestic/foreign)", defaultFactor: "1", defaultWeight: "0.2" },
    { row: 21, section: "11.4", category: "All others", defaultFactor: "1", defaultWeight: "1" },
    { row: 23, section: "12.1", category: "Federal government", defaultFactor: "0.5", defaultWeight: "0" },
    { row: 24, section: "12.2", category: "Regional government", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 25, section: "12.3", category: "Bank (domestic/foreign)", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 26, section: "12.4", category: "All other", defaultFactor: "0.5", defaultWeight: "1" },
    { row: 28, section: "13.1", category: "Federal government", defaultFactor: "0.5", defaultWeight: "0" },
    { row: 29, section: "13.2", category: "Regional government", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 30, section: "13.3", category: "Bank (domestic/foreign)", defaultFactor: "0.5", defaultWeight: "0.2" },
    { row: 31, section: "13.4", category: "All others", defaultFactor: "0.5", defaultWeight: "1" },
    { row: 33, section: "14.1", category: "Federal government", defaultFactor: "0.2", defaultWeight: "0" },
    { row: 34, section: "14.2", category: "Regional government", defaultFactor: "0.2", defaultWeight: "0.2" },
    { row: 35, section: "14.3", category: "Bank (domestic/foreign)", defaultFactor: "0.2", defaultWeight: "0.2" },
    { row: 36, section: "14.4", category: "All others", defaultFactor: "0.2", defaultWeight: "1" },
    { row: 37, section: "15", category: "Others**", defaultFactor: "", defaultWeight: "" },
    { row: 38, section: "16", category: "Total Risk weighted Off - BSA", defaultFactor: "", defaultWeight: "" }
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
QO001_ROWS_CONFIG.forEach((r) => {
    COLS_CONFIG.forEach((c) => {
        const codeNum = String(itemCounter).padStart(5, "0");
        const code = `12_${codeNum}`;
        itemCounter++;
        QO001_DESCRIPTIONS.push({
            code,
            desc: `${r.category}_${c.suffix}`,
            excelRow: r.row,
            excelCol: c.col,
            colName: c.name,
            defaultFactor: r.defaultFactor,
            defaultWeight: r.defaultWeight
        });
    });
});

