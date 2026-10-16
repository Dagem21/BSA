import { MB001_DESCRIPTIONS } from '../src/utils/services/MB001/jsonFormat.ts';
import fs from 'fs';
import path from 'path';

const returnItems = MB001_DESCRIPTIONS.map(item => ({
    Code: item.code,
    Value: "",
    _description: item.desc,
    _dataType: "NUMERIC",
    _required: false
}));

const template = {
    ReturnKey: "MB001MB001",
    InstCode: "0000001",
    FinYear: 2026,
    StartDate: "2026-09-01T00:00:00.000Z",
    EndDate: "2026-09-30T00:00:00.000Z",
    ReturnItemsList: returnItems,
    DynamicItemsList: []
};

const jsonPath = path.resolve('templates/json/MB001.json');
fs.writeFileSync(jsonPath, JSON.stringify(template, null, 4), 'utf-8');
console.log('Successfully updated templates/json/MB001.json with _required: false and .000Z ISO dates. Items count:', returnItems.length);
