const fs = require('fs');
const path = require('path');

const sectors = [
    "Agriculture",
    "Manufacturing",
    "Construction",
    "Trade",
    "Hotels and Tourism",
    "Transport and Communication",
    "Financial Institutions",
    "Real Estate",
    "Personal Loans",
    "Mining and Quarrying",
    "Health and Education",
    "Others"
];

const loanCategories = [
    "Short Term",
    "Medium Term",
    "Long Term",
    "Overdraft",
    "Pre-shipment",
    "Post-shipment"
];

const dynamicItems = [];

for (let i = 0; i < 40; i++) {
    const rowNum = i + 1;
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const category = loanCategories[Math.floor(Math.random() * loanCategories.length)];
    
    // Generate some realistic looking data
    const outstanding = (Math.random() * 1000 + 50).toFixed(2); // 50 to 1050 Mn
    const accounts = Math.floor(Math.random() * 500) + 10;
    
    const minRate = (Math.random() * 5 + 7).toFixed(2); // 7% to 12%
    const maxRate = (Math.random() * 5 + 13).toFixed(2); // 13% to 18%
    const weightedRate = (Math.random() * 3 + 10).toFixed(2); // 10% to 13%
    const weightedAvgRate = (Math.random() * 2 + 11).toFixed(2); // 11% to 13%
    
    dynamicItems.push(
        { Code: `${rowNum}.1`, Value: sector, _description: "Sector", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.2`, Value: category, _description: "Loan Category ", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.3`, Value: outstanding, _description: "Outstanding Loan & \\nAdvance ( in\\nMn Birr)", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.4`, Value: accounts.toString(), _description: "No. of Loan \\nAccounts by \\nLoan Category ", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.5`, Value: minRate, _description: "Lending Interest Rates (% per annum) ", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.6`, Value: maxRate, _description: "Lending Interest Rates (% per annum) _Maximum Rate ", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.7`, Value: weightedRate, _description: "Lending Interest Rates (% per annum)_ Weighted ", _dataType: "TEXT", _required: false },
        { Code: `${rowNum}.8`, Value: weightedAvgRate, _description: "Lending Interest Rates (% per annum)_Weighted Average Rate ", _dataType: "TEXT", _required: false }
    );
}

const reportData = {
    "ReturnKey": "IFBLCMWAL001",
    "InstCode": "0000001",
    "FinYear": 2026,
    "StartDate": "2026-08-01T00:00:00",
    "EndDate": "2026-08-31T00:00:00",
    "ReturnItemsList": [],
    "DynamicItemsList": [
        {
            "Area": 214,
            "_areaName": "Monthly Weighted Average Lending Profit Rates (Interest-Free Banks) ",
            "DynamicItems": dynamicItems
        }
    ]
};

const outputDir = path.join(__dirname, 'reports', 'json');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'MWAL001_20260831_14.json');
fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 4));
console.log(`Generated sample data at ${outputPath}`);
