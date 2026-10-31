const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function inspect() {
    try {
        const wb = new ExcelJS.Workbook();
        const filePath = path.resolve(__dirname, '../templates/MB001.xlsx');
        console.log("Reading file:", filePath);
        await wb.xlsx.readFile(filePath);
        const ws = wb.getWorksheet("NBE") || wb.getWorksheet("BSD Monthly  Balance Sheet") || wb.worksheets[0];
        console.log("Found worksheet:", ws.name);
        
        const lines = [];
        ws.eachRow((row, rNum) => {
            if (rNum >= 15 && rNum <= 170) {
                const colA = String(row.getCell(1).value || '').trim();
                const colB = String(row.getCell(2).value || '').trim();
                const colC = String(row.getCell(3).value || '').trim();
                lines.push(`Row ${rNum}: colA="${colA}" | colB="${colB}" | colC="${colC}"`);
            }
        });
        const outPath = path.resolve(__dirname, 'excel_rows.txt');
        fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
        console.log("SUCCESS Wrote excel_rows.txt. Total rows:", lines.length);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

inspect();
