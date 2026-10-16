const fs = require('fs');
const path = require('path');

try {
    const templatePath = path.resolve('templates/json/MB001.json');
    const content = fs.readFileSync(templatePath, 'utf8');
    const template = JSON.parse(content);
    
    const output = [];
    output.push("Top-level keys in template: " + Object.keys(template).join(', '));
    output.push("Number of items in template ReturnItemsList: " + template.ReturnItemsList.length);
    if (template.ReturnItemsList.length > 0) {
        output.push("Sample item 0: " + JSON.stringify(template.ReturnItemsList[0]));
        output.push("Sample item last: " + JSON.stringify(template.ReturnItemsList[template.ReturnItemsList.length - 1]));
    }
    fs.writeFileSync('scratch/compare_out.txt', output.join('\n'), 'utf8');
} catch (err) {
    fs.writeFileSync('scratch/compare_out.txt', 'ERROR: ' + err.stack, 'utf8');
}
