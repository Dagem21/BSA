const XLSX = require('xlsx');
const fs = require('fs');

console.log("Starting xlsx generation...");

const data = [
    ["", "", "NATIONAL BANK OF ETHIOPIA"],
    ["", "", "Institution Code", "0000001"],
    ["", "", "Financial Year", 2026],
    ["", "", "Start Date", "2026-08-01"],
    ["", "", "End Date", "2026-08-31"],
    [],
    [],
    [],
    [],
    [],
    [],
    [
        "Sector",
        "Loan Category",
        "Outstanding Loan & Advance (in Mn Birr)",
        "No. of Loan Accounts by Loan Category",
        "Lending Interest Rates (% per annum)",
        "Lending Interest Rates (% per annum) _Maximum Rate",
        "Lending Interest Rates (% per annum)_ Weighted",
        "Lending Interest Rates (% per annum)_Weighted Average Rate"
    ]
];

const sectors = ["Agriculture", "Manufacturing", "Construction", "Trade", "Hotels and Tourism", "Transport and Communication", "Financial Institutions", "Real Estate", "Personal Loans", "Mining and Quarrying", "Health and Education", "Others"];
const cats = ["Short Term", "Medium Term", "Long Term", "Overdraft", "Pre-shipment", "Post-shipment"];

for (let r = 0; r < 50; r++) {
    data.push([
        sectors[Math.floor(Math.random() * sectors.length)],
        cats[Math.floor(Math.random() * cats.length)],
        +(Math.random() * 1000 + 50).toFixed(2),
        Math.floor(Math.random() * 500) + 10,
        +(Math.random() * 5 + 7).toFixed(2),
        +(Math.random() * 5 + 13).toFixed(2),
        +(Math.random() * 3 + 10).toFixed(2),
        +(Math.random() * 2 + 11).toFixed(2)
    ]);
}

try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "MWAL001");
    XLSX.writeFile(wb, "MWAL001_Data_More_Than_45_Rows.xlsx");
    console.log("Success");
} catch(e) {
    console.error("Error", e);
}
