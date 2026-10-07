const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('templates/json/MB001.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

data.StartDate = "2026-09-01T00:00:00.000Z";
data.EndDate = "2026-09-30T00:00:00.000Z";
data.ReturnItemsList = data.ReturnItemsList.map(item => ({
    Code: item.Code,
    Value: item.Value || "",
    _description: item._description,
    _dataType: item._dataType || "NUMERIC",
    _required: false
}));

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4), 'utf8');
console.log("Updated templates/json/MB001.json successfully.");
