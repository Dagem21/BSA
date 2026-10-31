const fs = require('fs');
const path = require('path');

const qPath = path.join(process.cwd(), 'templates', 'json', 'QO001.json');
const raw = fs.readFileSync(qPath, 'utf8');
const data = JSON.parse(raw);

data.ReturnItemsList = data.ReturnItemsList.map(item => {
    const newItem = {
        Code: item.Code,
        Value: "",
        _description: item._description,
        _dataType: item._dataType || "NUMERIC"
    };
    return newItem;
});

fs.writeFileSync(qPath, JSON.stringify(data, null, 4), 'utf8');
console.log('Updated QO001.json template successfully.');
