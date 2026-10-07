const fs = require('fs');
const path = require('path');

const filePath = path.resolve('scratch/out_generated_lp.json');
const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log('Items 21_00010 to 21_00027:');
json.ReturnItemsList.slice(9, 27).forEach(item => {
    console.log(`  ${item.Code}: ${JSON.stringify(item.Value)} (${item._description})`);
});
