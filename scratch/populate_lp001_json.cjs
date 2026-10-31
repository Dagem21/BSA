const fs = require('fs');
const path = require('path');

const jsonFormatPath = path.resolve('src/utils/services/LP001/jsonFormat.ts');
const text = fs.readFileSync(jsonFormatPath, 'utf8');

const matches = [...text.matchAll(/code:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)];
console.log("Matched items count:", matches.length);

const returnItems = matches.map(m => ({
    Code: m[1],
    Value: "",
    _description: m[2],
    _dataType: "NUMERIC"
}));

const template = {
    ReturnKey: "LOAN_CLA&PROV_LP001",
    InstCode: "0000001",
    FinYear: 2026,
    StartDate: "2026-07-01T00:00:00",
    EndDate: "2026-09-30T00:00:00",
    ReturnItemsList: returnItems,
    DynamicItemsList: []
};

const targetPath = path.resolve('templates/json/LP001.json');
fs.writeFileSync(targetPath, JSON.stringify(template, null, 4), 'utf8');
console.log("Successfully wrote all items to templates/json/LP001.json!");
