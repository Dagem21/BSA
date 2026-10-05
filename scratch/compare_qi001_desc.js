import { QI001_DESCRIPTIONS } from '../src/utils/services/QI001/jsonFormat.ts';
import fs from 'fs';
import path from 'path';

const jsonPath = path.resolve('templates/json/QI001.json');
const raw = fs.readFileSync(jsonPath, 'utf-8');
const templateJson = JSON.parse(raw);

console.log('Template items count:', templateJson.ReturnItemsList.length);
console.log('QI001_DESCRIPTIONS count:', QI001_DESCRIPTIONS.length);

let diffCount = 0;
templateJson.ReturnItemsList.forEach((tItem, idx) => {
    const dItem = QI001_DESCRIPTIONS[idx];
    if (!dItem) {
        console.log(`Missing description at index ${idx} for code ${tItem.Code}`);
        diffCount++;
    } else if (tItem.Code !== dItem.code || tItem._description !== dItem.desc) {
        console.log(`Mismatch at ${idx}:`);
        console.log(`  Template: code=${tItem.Code}, desc="${tItem._description}"`);
        console.log(`  Config  : code=${dItem.code}, desc="${dItem.desc}"`);
        diffCount++;
    }
});

console.log('Total diff count:', diffCount);
