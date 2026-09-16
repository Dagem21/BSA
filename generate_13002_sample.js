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
    "East Africa Holding"
];

const natures = [
    "Influential Shareholder",
    "Board Director",
    "Executive Officer",
    "Subsidiary Company",
    "Associate Enterprise"
];

const exposureTypes = ["Term Loan", "Overdraft", "Letter of Credit", "Bank Guarantee", "Syndicated Loan"];
const sectors = ["Manufacturing", "Services", "Construction", "Trade", "Transport", "Agriculture"];
const statuses = ["Pass", "Special Mention", "Substandard", "Doubtful", "Loss"];
const collateralTypes = ["Building", "Factory Machinery", "Cash Deposit", "Corporate Guarantee", "Vehicle Fleet"];

const sampleRows = [];

for (let i = 0; i < 8; i++) {
    const cp = counterparties[i % counterparties.length];
    const nature = natures[i % natures.length];
    const expType = exposureTypes[Math.floor(Math.random() * exposureTypes.length)];
    const sec = sectors[Math.floor(Math.random() * sectors.length)];
    
    const approvedLimit = (Math.random() * 5000 + 1000).toFixed(2);
    const onBal = (Math.random() * 4000 + 500).toFixed(2);
    const offBal = (Math.random() * 1000 + 100).toFixed(2);
    const totalOut = (parseFloat(onBal) + parseFloat(offBal)).toFixed(2);
    const maturity = `2027-12-${String((i % 28) + 1).padStart(2, '0')}`;
    const capital = "197320.25";
    const pctCapital = ((parseFloat(totalOut) / parseFloat(capital)) * 100).toFixed(2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const colType = collateralTypes[Math.floor(Math.random() * collateralTypes.length)];
    const colVal = (parseFloat(totalOut) * 1.2).toFixed(2);

    sampleRows.push({
        counterpartyName: cp,
        counterpartyNature: nature,
        exposureType: expType,
        exposureSector: sec,
        approvedLimit,
        onBalanceExposure: onBal,
        offBalanceExposure: offBal,
        totalOutstanding: totalOut,
        maturityDate: maturity,
        capital,
        exposurePctCapital: pctCapital,
        status,
        collateralType: colType,
        collateralValue: colVal
    });
}

const fmt = (val, dataType = "NUMERIC") => {
    if (val !== undefined && val !== null) {
        let str = val.toString().trim();
        if (str !== "" && str !== "-" && str !== "—" && str !== "–" && str !== "--" && str.toLowerCase() !== "n/a" && str.toLowerCase() !== "nil") {
            if (dataType === "DATE") {
                if (str.includes("T")) {
                    return str.split("T")[0];
                }
                return str;
            }
            return str;
        }
    }
    if (dataType === "DATE") return "";
    return dataType === "TEXT" ? "-" : "0";
};

let sumTotalOutstanding = 0;
let sumCapital = 0;
sampleRows.forEach((row) => {
    const numOut = parseFloat(row.totalOutstanding?.toString() || "0");
    if (!isNaN(numOut)) sumTotalOutstanding += numOut;
    const numCap = parseFloat(row.capital?.toString() || "0");
    if (!isNaN(numCap) && sumCapital === 0) sumCapital = numCap;
});

const returnItems = [];

for (let c = 1; c <= 142; c++) {
    const codeStr = `13002_${c.toString().padStart(5, "0")}`;

    if (c >= 1 && c <= 20) {
        const idx = 21 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.counterpartyName, "TEXT"),
            _description: `Name of Counterparty_${idx}`,
            _dataType: "TEXT",
            _required: true
        });
    } else if (c >= 21 && c <= 40) {
        const idx = 41 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.counterpartyNature, "TEXT"),
            _description: `Nature of Counterparty _${idx}`,
            _dataType: "TEXT",
            _required: true
        });
    } else if (c >= 41 && c <= 60) {
        const idx = 61 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.totalOutstanding, "NUMERIC"),
            _description: `Total Outstanding Balance After Deduction Cash and Cash Equivalent_${idx}`,
            _dataType: "NUMERIC",
            _required: true
        });
    } else if (c >= 61 && c <= 80) {
        const idx = 81 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.exposureSector, "TEXT"),
            _description: `Sector of Exposure_${idx}`,
            _dataType: "TEXT",
            _required: true
        });
    } else if (c >= 81 && c <= 100) {
        const idx = 101 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.exposurePctCapital, "NUMERIC"),
            _description: `Percent of Capital (M=J/L*100)_${idx}`,
            _dataType: "NUMERIC",
            _required: true
        });
    } else if (c >= 101 && c <= 120) {
        const idx = 121 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.status, "TEXT"),
            _description: `Status (Classification)_${idx}`,
            _dataType: "TEXT",
            _required: true
        });
    } else if (c >= 121 && c <= 140) {
        const idx = 141 - c;
        const row = sampleRows[idx - 1];
        returnItems.push({
            Code: codeStr,
            Value: fmt(row?.capital, "NUMERIC"),
            _description: `Capital of the Bank_${idx}`,
            _dataType: "NUMERIC",
            _required: true
        });
    } else if (c === 141) {
        returnItems.push({
            Code: codeStr,
            Value: fmt(sumCapital, "NUMERIC"),
            _description: "Aggregate _Capital",
            _dataType: "NUMERIC",
            _required: true
        });
    } else if (c === 142) {
        returnItems.push({
            Code: codeStr,
            Value: fmt(sumTotalOutstanding, "NUMERIC"),
            _description: "Aggregate _Total Outstanding Balance",
            _dataType: "NUMERIC",
            _required: true
        });
    }
}

const dynamicItems = sampleRows.map((row, index) => {
    const rowNum = index + 1;
    return [
        { Code: `${rowNum}.1`, Value: fmt(row.counterpartyName, "TEXT"), _description: "Name of Counterparty*", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.2`, Value: fmt(row.counterpartyNature, "TEXT"), _description: "Nature of Counterparty (e.g. influential shareholder, director, subsidiary ….)", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.3`, Value: fmt(row.exposureType, "TEXT"), _description: "Type of Exposure", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.4`, Value: fmt(row.exposureSector, "TEXT"), _description: "Sector of Exposure", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.5`, Value: fmt(row.approvedLimit, "NUMERIC"), _description: "Approved Limit/Facility", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.6`, Value: fmt(row.onBalanceExposure, "NUMERIC"), _description: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A", _dataType: "NUMERIC", _required: false },
        { Code: `${rowNum}.7`, Value: fmt(row.offBalanceExposure, "NUMERIC"), _description: "Off-balance Sheet Exposure Amount (e.g. guarantee)_   B", _dataType: "NUMERIC", _required: false },
        { Code: `${rowNum}.8`, Value: fmt(row.totalOutstanding, "NUMERIC"), _description: "Total Outstanding Balance_     C=A+B", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.9`, Value: fmt(row.maturityDate, "DATE"), _description: "Maturity Date", _dataType: "DATE", _required: true },
        { Code: `${rowNum}.10`, Value: fmt(row.capital, "NUMERIC"), _description: "Capital", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.11`, Value: fmt(row.exposurePctCapital, "NUMERIC"), _description: "Exposure Amount (A+B) as Percent of Total Capital", _dataType: "NUMERIC", _required: true },
        { Code: `${rowNum}.12`, Value: fmt(row.status, "TEXT"), _description: "Status (classification)", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.13`, Value: fmt(row.collateralType, "TEXT"), _description: "Collateral_Type", _dataType: "TEXT", _required: true },
        { Code: `${rowNum}.14`, Value: fmt(row.collateralValue, "NUMERIC"), _description: "Collateral_Estimated/Face value", _dataType: "NUMERIC", _required: false }
    ];
});

const reportData = {
    "ReturnKey": "BSD_LOAN_PART13002",
    "InstCode": "0000001",
    "FinYear": 2026,
    "StartDate": "2026-08-01T00:00:00",
    "EndDate": "2026-08-31T00:00:00",
    "ReturnItemsList": returnItems,
    "DynamicItemsList": [
        {
            "Area": 225,
            "_areaName": "Monthly Returns on Related Party Transactions List of Related Party Exposures",
            "DynamicItems": dynamicItems.flat()
        }
    ]
};

const outputDir = path.join(__dirname, 'reports', 'json');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, '13002_20260831_01.json');
fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 4));
console.log(`Generated 13002 sample data at ${outputPath}`);
