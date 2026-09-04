const fs = require('fs');
const path = require('path');

const counterparties = [
    "Ethio Telecom",
    "Ethiopian Airlines Group",
    "Ethiopian Electric Power",
    "Sugar Corporation",
    "MIDROC Investment Group",
    "Dangote Cement Ethiopia",
    "Habesha Breweries",
    "East Africa Holding",
    "MOHA Soft Drinks Industry",
    "BGI Ethiopia",
    "Horizon Plantations",
    "Derba MIDROC Cement"
];

const exposureTypes = ["Term Loan", "Overdraft", "Letter of Credit", "Bank Guarantee", "Syndicated Loan"];
const sectors = ["Manufacturing", "Services", "Construction", "Trade", "Transport", "Agriculture"];
const statuses = ["Pass", "Special Mention", "Substandard", "Doubtful", "Loss"];
const collateralTypes = ["Building", "Factory Machinery", "Cash Deposit", "Corporate Guarantee", "Vehicle Fleet"];

const dynamicItems = [];

for (let i = 0; i < 20; i++) {
    const rowNum = i + 1;
    const cp = counterparties[i % counterparties.length];
    const expType = exposureTypes[Math.floor(Math.random() * exposureTypes.length)];
    const sec = sectors[Math.floor(Math.random() * sectors.length)];
    
    const approvedLimit = (Math.random() * 5000 + 1000).toFixed(2);
    const onBal = (Math.random() * 4000 + 500).toFixed(2);
    const offBal = (Math.random() * 1000 + 100).toFixed(2);
    const totalOut = (parseFloat(onBal) + parseFloat(offBal)).toFixed(2);
    const maturity = `2027-12-${String((i % 28) + 1).padStart(2, '0')}T00:00:00`;
    const capital = "15000.00";
    const pctCapital = ((parseFloat(totalOut) / parseFloat(capital)) * 100).toFixed(2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const colType = collateralTypes[Math.floor(Math.random() * collateralTypes.length)];
    const colVal = (parseFloat(totalOut) * 1.2).toFixed(2);

    dynamicItems.push(
        { Code: `${rowNum}.1`, Value: cp, _description: "Name of Counterparty*", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.2`, Value: expType, _description: "Type of Exposure", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.3`, Value: sec, _description: "Sector of Exposure", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.4`, Value: approvedLimit, _description: "Approved Limit/Facility", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.5`, Value: onBal, _description: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A", _dataType: "NUMERIC", _required: false },
        { Code: `${rowNum}.6`, Value: offBal, _description: "Off-balance Sheet Exposure Amount (e.g. guarantee)_  B", _dataType: "NUMERIC", _required: false },
        { Code: `${rowNum}.7`, Value: totalOut, _description: "Total Outstanding Balance_    C=A+B", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.8`, Value: maturity, _description: "Maturity Date", _dataType: "DATE", _required: true },
        { Code: `${rowNum}.9`, Value: capital, _description: "Capital", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.10`, Value: pctCapital, _description: "Exposure Amount (A+B) as Percent of Total Capital", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.11`, Value: status, _description: "Status (classification)", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.12`, Value: colType, _description: "Collateral_Type", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.13`, Value: colVal, _description: "Collateral_Estimated/Face value", _dataType: "NUMERIC", _required: false }
    );
}

const reportData = {
    "ReturnKey": "BOR_TEN_PER_LB002",
    "InstCode": "0000001",
    "FinYear": 2026,
    "StartDate": "2026-08-01T00:00:00",
    "EndDate": "2026-08-31T00:00:00",
    "ReturnItemsList": [],
    "DynamicItemsList": [
        {
            "Area": 226,
            "_areaName": "Monthly Return on Large Exposures List of Counterparties that Exceed Ten Percent of the Bank’s Total Capital ",
            "DynamicItems": dynamicItems
        }
    ]
};

const outputDir = path.join(__dirname, 'reports', 'json');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'LB002_20260831_01.json');
fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 4));
console.log(`Generated LB002 sample data at ${outputPath}`);
