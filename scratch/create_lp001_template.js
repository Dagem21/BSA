const fs = require('fs');
const path = require('path');

// Dynamically extract LP001 definitions from src/utils/services/LP001/jsonFormat.ts
const jsonFormatPath = path.resolve('src/utils/services/LP001/jsonFormat.ts');
const jsonFormatContent = fs.readFileSync(jsonFormatPath, 'utf8');

// Parse LP001_ITEM_DEFINITIONS
const itemsMatch = jsonFormatContent.match(/export const LP001_ITEM_DEFINITIONS:[^=]*=\s*(\[[\s\S]*?\]);/);
let items = [];

if (itemsMatch) {
    try {
        // Evaluate the items array
        const rawItemsStr = itemsMatch[1];
        items = eval(rawItemsStr);
    } catch (e) {
        console.error("Failed to eval items array:", e);
    }
}

const returnItems = items.map(item => ({
    Code: item.code,
    Value: "",
    _description: item.description,
    _dataType: item.dataType || "NUMERIC"
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

const jsonDir = path.resolve('templates/json');
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
}

const targetFile = path.join(jsonDir, 'LP001.json');
fs.writeFileSync(targetFile, JSON.stringify(template, null, 4), 'utf8');
console.log(`Successfully created ${targetFile} with ${returnItems.length} return items.`);
