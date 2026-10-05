const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('templates/json/QI001.json');
const raw = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);

data.ReturnItemsList = data.ReturnItemsList.map(item => {
    const { _required, ...rest } = item;
    return {
        ...rest,
        Value: rest.Value || ""
    };
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4), 'utf-8');
console.log('Successfully updated templates/json/QI001.json. Items count:', data.ReturnItemsList.length);
