const fs = require('fs');
const path = require('path');

const qPath = path.join(process.cwd(), 'templates', 'json', 'QO001.json');
const raw = fs.readFileSync(qPath, 'utf8');
const data = JSON.parse(raw);

console.log('Total items in QO001.json:', data.ReturnItemsList.length);
console.log('Sample item 0:', JSON.stringify(data.ReturnItemsList[0], null, 2));
console.log('Sample item 5:', JSON.stringify(data.ReturnItemsList[5], null, 2));
console.log('Sample item 94:', JSON.stringify(data.ReturnItemsList[94], null, 2));
