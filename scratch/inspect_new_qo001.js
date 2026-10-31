const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
    const wb = new ExcelJS.Workbook();
    const filePath = path.join(process.cwd(), 'templates', 'QO001.xlsx');
    await wb.xlsx.readFile(filePath);
    console.log('Worksheets in QO001.xlsx:');
    wb.worksheets.forEach((ws, idx) => {
        console.log(`Sheet ${idx}: '${ws.name}', rowCount: ${ws.rowCount}`);
    });

    const ws = wb.getWorksheet('CAP_ADQ_OFB_QO001') || wb.worksheets[0];
    console.log('\n--- Printing all non-empty rows of sheet:', ws.name, '---');
    ws.eachRow((row, rowNum) => {
        const vals = [];
        let hasContent = false;
        for (let col = 1; col <= 12; col++) {
            const cell = row.getCell(col);
            let v = cell.value;
            if (v !== null && v !== undefined && v !== "") hasContent = true;
            if (v && typeof v === 'object') {
                if (v.result !== undefined) v = `[F: ${v.formula} = ${v.result}]`;
                else v = JSON.stringify(v);
            }
            vals.push(`C${col}:${v}`);
        }
        if (hasContent) {
            console.log(`R${rowNum}: ${vals.join(' | ')}`);
        }
    });
}

main().catch(console.error);
