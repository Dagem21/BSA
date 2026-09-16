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

const returnItems = [];
let codeCounter = 1;

for (let i = 0; i < 20; i++) {
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

    const rowItems = [
        { desc: "Name of Counterparty*", val: cp, dataType: "TEXT", required: true },
        { desc: "Type of Exposure", val: expType, dataType: "TEXT", required: true },
        { desc: "Sector of Exposure", val: sec, dataType: "TEXT", required: true },
        { desc: "Approved Limit/Facility", val: approvedLimit, dataType: "NUMERIC", required: true },
        { desc: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A", val: onBal, dataType: "NUMERIC", required: false },
        { desc: "Off-balance Sheet Exposure Amount (e.g. guarantee)_  B", val: offBal, dataType: "NUMERIC", required: false },
        { desc: "Total Outstanding Balance_    C=A+B", val: totalOut, dataType: "NUMERIC", required: true },
        { desc: "Maturity Date", val: maturity, dataType: "DATE", required: true },
        { desc: "Capital", val: capital, dataType: "NUMERIC", required: true },
        { desc: "Exposure Amount (A+B) as Percent of Total Capital", val: pctCapital, dataType: "NUMERIC", required: true },
        { desc: "Status (classification)", val: status, dataType: "TEXT", required: true },
        { desc: "Collateral_Type", val: colType, dataType: "TEXT", required: true },
        { desc: "Collateral_Estimated/Face value", val: colVal, dataType: "NUMERIC", required: false }
    ];

    rowItems.forEach(item => {
        const codeStr = `LB002_${codeCounter.toString().padStart(5, '0')}`;
        codeCounter++;
        returnItems.push({
            Code: codeStr,
            Value: item.val,
            _description: item.desc,
            _dataType: item.dataType,
            _required: item.required
        });
    });
}

while (returnItems.length < 79) {
    const itemIdx = returnItems.length;
    const codeStr = `LB002_${(itemIdx + 1).toString().padStart(5, '0')}`;
    returnItems.push({
        Code: codeStr,
        Value: "0",
        _description: "Collateral_Estimated/Face value",
        _dataType: "NUMERIC",
        _required: false
    });
}

const reportData = {
    "ReturnKey": "BOR_TEN_PER_LB002",
    "InstCode": "0000001",
    "FinYear": 2026,
    "StartDate": "2026-08-01T00:00:00",
    "EndDate": "2026-08-31T00:00:00",
    "ReturnItemsList": returnItems,
    "DynamicItemsList": []
};

const targetPath = path.join(__dirname, '..', 'reports', 'json', 'LB002_20260831_01.json');
fs.writeFileSync(targetPath, JSON.stringify(reportData, null, 4));
console.log('Successfully updated LB002 JSON file at:', targetPath);
