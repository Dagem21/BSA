const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'tsc_out.txt');
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file);
    let str = content.toString('utf16le');
    if (!str.includes('error TS') && !str.includes('Found ')) str = content.toString('utf8');
    fs.writeFileSync(path.join(__dirname, 'tsc_out_utf8.txt'), str);
}
