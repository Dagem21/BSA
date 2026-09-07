const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'bp001_res.txt');
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file);
    let str = content.toString('utf16le');
    if (!str.includes('Testing')) str = content.toString('utf8');
    fs.writeFileSync(path.join(__dirname, 'bp001_res_utf8.txt'), str);
}
