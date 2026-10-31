const fs = require('fs');
const path = require('path');

function removeRequiredDeep(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeRequiredDeep);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === '_required') continue;
            newObj[key] = removeRequiredDeep(value);
        }
        return newObj;
    }
    return obj;
}

const templatesDir = path.resolve('templates/json');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const filePath = path.join(templatesDir, file);
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        const cleaned = removeRequiredDeep(data);
        fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 4), 'utf-8');
        console.log(`Cleaned ${file}`);
    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});
