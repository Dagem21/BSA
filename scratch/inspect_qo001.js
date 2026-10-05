const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.join(process.cwd(), 'templates', 'QO001.xlsx');
    await wb.xlsx.readFile(filePath);
    const ws = wb.getWorksheet('CAP_ADQ_OFB_QO001') || wb.worksheets[0];
    console.log('Worksheet name:', ws.name);
    ws.eachRow((row, rowNum) => {
        const vals = [];
        for (let col = 1; col <= 8; col++) {
            const cell = row.getCell(col);
            let v = cell.value;
            if (v && typeof v === 'object') {
                if (v.result !== undefined) v = `[F: ${v.formula} = ${v.result}]`;
                else v = JSON.stringify(v);
            }
            vals.push(`C${col}:${v}`);
        }
        console.log(`R${rowNum}: ${vals.join(' | ')}`);
    });
}

main().catch(console.error);
