const ExcelJS = require('exceljs');
const fs = require('fs');

async function inspectFile(filePath, outLines) {
    outLines.push(`=== Inspecting: ${filePath} ===`);
    if (!fs.existsSync(filePath)) {
        outLines.push("File does not exist!");
        return;
    }
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    outLines.push(`Worksheet count: ${wb.worksheets.length}`);
    wb.worksheets.forEach((ws, i) => {
        outLines.push(`Sheet ${i}: name=${ws.name}, actualRowCount=${ws.actualRowCount}`);
        ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            const vals = [];
            row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                let v = cell.value;
                if (v && typeof v === 'object') {
                    if (v.result !== undefined) v = v.result;
                    else if (v.text !== undefined) v = v.text;
                    else v = JSON.stringify(v);
                }
                vals.push(`C${colNumber}:${v}`);
            });
            outLines.push(`R${rowNumber}: ${vals.join(' | ')}`);
        });
    });
}

async function main() {
    const outLines = [];
    await inspectFile('./templates/MA001.xlsx', outLines);
    await inspectFile('./templates/MA001 (1).xlsx', outLines);
    fs.writeFileSync('./scratch/inspect_out.txt', outLines.join('\n'));
    console.log("Done writing inspect_out.txt");
}

main().catch(err => {
    fs.writeFileSync('./scratch/inspect_out.txt', err.stack || String(err));
});
