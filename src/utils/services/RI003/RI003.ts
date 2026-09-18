import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { RI003Format, getRI003SubRows } from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) return str;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    return str;
}

function getDirectCellValue(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) return "";
    const val = cell.value;
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        return val.trim();
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && "error" in val.result) {
                return "";
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t) => t.text).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
    }
    if (cell.result !== undefined && cell.result !== null) {
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

export function processRI003(worksheet: ExcelJS.Worksheet, options?: { instCode?: string; startDate?: string; endDate?: string }) {
    let instCode = options?.instCode || "0000001";
    let finYear = 2026;
    let startDate = options?.startDate || "2026-04-01T00:00:00";
    let endDate = options?.endDate || "2026-06-30T00:00:00";

    for (let r = 1; r <= 15; r++) {
        const row = worksheet.getRow(r);
        const colAText = getDirectCellValue(row.getCell(1)).toLowerCase();
        const colBText = getDirectCellValue(row.getCell(2)).toLowerCase();
        const colCText = getDirectCellValue(row.getCell(3)).toLowerCase();
        const combined = `${colAText} ${colBText} ${colCText}`;

        if (combined.includes("institution code") || combined.includes("instiution code")) {
            const val = getDirectCellValue(row.getCell(3)) || getDirectCellValue(row.getCell(2)) || getDirectCellValue(row.getCell(4));
            if (val) instCode = val;
        } else if (combined.includes("financial year")) {
            const val = getDirectCellValue(row.getCell(3)) || getDirectCellValue(row.getCell(2)) || getDirectCellValue(row.getCell(4));
            if (val && !isNaN(Number(val))) finYear = Number(val);
        } else if (combined.includes("start date")) {
            const val = getDirectCellValue(row.getCell(3)) || getDirectCellValue(row.getCell(2)) || getDirectCellValue(row.getCell(4));
            if (val) startDate = formatIsoString(val);
        } else if (combined.includes("end date")) {
            const val = getDirectCellValue(row.getCell(3)) || getDirectCellValue(row.getCell(2)) || getDirectCellValue(row.getCell(4));
            if (val) endDate = formatIsoString(val);
        }
    }

    // 14 regions x 8 sub-rows = 112 rows grid
    let startRowOffset = 15;
    for (let r = 1; r <= 20; r++) {
        const row = worksheet.getRow(r);
        const col1 = getDirectCellValue(row.getCell(1)).toLowerCase();
        const col2 = getDirectCellValue(row.getCell(2)).toLowerCase();
        if (col1.includes("addis ababa") || col2.includes("addis ababa")) {
            startRowOffset = r;
            break;
        }
    }

    let startCol = 3;
    const firstDataRow = worksheet.getRow(startRowOffset);
    for (let c = 1; c <= 5; c++) {
        const val = getDirectCellValue(firstDataRow.getCell(c));
        if (val && !isNaN(Number(val))) {
            startCol = c;
            break;
        }
    }

    const grid: string[][] = [];
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const startRow = startRowOffset + regIndex * 8;
        for (let subRowIndex = 0; subRowIndex < 8; subRowIndex++) {
            const excelRowIndex = startRow + subRowIndex;
            const row = worksheet.getRow(excelRowIndex);
            const rowArr: string[] = [];

            for (let colIndex = 0; colIndex < 18; colIndex++) {
                const excelColIndex = startCol + colIndex;
                const cell = row.getCell(excelColIndex);
                rowArr.push(getDirectCellValue(cell));
            }
            grid.push(rowArr);
        }
    }

    const parseNum = (v: string): number => {
        if (!v) return 0;
        const n = parseFloat(v.replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
    };

    // Auto-calculate empty regional totals (sub-row 0) from Demand (1) + Saving (2) + Time (3) + Restricted (4) + Unrestricted (5)
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const headRowIdx = regIndex * 8;
        const demandRowIdx = headRowIdx + 1;
        const savingRowIdx = headRowIdx + 2;
        const timeRowIdx = headRowIdx + 3;
        const restrRowIdx = headRowIdx + 4;
        const unrestrRowIdx = headRowIdx + 5;

        for (let c = 0; c < 18; c++) {
            if (!grid[headRowIdx][c] || grid[headRowIdx][c] === "0") {
                const dVal = parseNum(grid[demandRowIdx][c]);
                const sVal = parseNum(grid[savingRowIdx][c]);
                const tVal = parseNum(grid[timeRowIdx][c]);
                const rVal = parseNum(grid[restrRowIdx][c]);
                const uVal = parseNum(grid[unrestrRowIdx][c]);
                const subSum = dVal + sVal + tVal + rVal + uVal;

                if (subSum !== 0) {
                    grid[headRowIdx][c] = String(subSum);
                }
            }
        }
    }

    // Auto-calculate empty sector total columns (Cols 15, 16, 17) from Pub Ent (0..2), Priv (3..5), RegGov (6..8), Banks (9..11), Others (12..14)
    for (let r = 0; r < grid.length; r++) {
        // Sector Total Amount (col 15) = col 0 + col 3 + col 6 + col 9 + col 12
        if (!grid[r][15] || grid[r][15] === "0") {
            const sumAmt = parseNum(grid[r][0]) + parseNum(grid[r][3]) + parseNum(grid[r][6]) + parseNum(grid[r][9]) + parseNum(grid[r][12]);
            if (sumAmt !== 0) grid[r][15] = String(sumAmt);
        }
        // Sector Total Depositors (col 16) = col 1 + col 4 + col 7 + col 10 + col 13
        if (!grid[r][16] || grid[r][16] === "0") {
            const sumDep = parseNum(grid[r][1]) + parseNum(grid[r][4]) + parseNum(grid[r][7]) + parseNum(grid[r][10]) + parseNum(grid[r][13]);
            if (sumDep !== 0) grid[r][16] = String(sumDep);
        }
        // Sector Total Accounts (col 17) = col 2 + col 5 + col 8 + col 11 + col 14
        if (!grid[r][17] || grid[r][17] === "0") {
            const sumAcc = parseNum(grid[r][2]) + parseNum(grid[r][5]) + parseNum(grid[r][8]) + parseNum(grid[r][11]) + parseNum(grid[r][14]);
            if (sumAcc !== 0) grid[r][17] = String(sumAcc);
        }
    }

    const valuesMap: Record<string, string> = {};
    let codeCounter = 35702;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < 18; c++) {
            const codeStr = `RI003_${codeCounter}`;
            valuesMap[codeStr] = grid[r][c];
            codeCounter++;
        }
    }

    return RI003Format("INT_FRE_SECRI003", instCode, finYear, startDate, endDate, valuesMap);
}

export async function processRI003Report(filePath: string, instCode?: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    let worksheet = workbook.getWorksheet("RI003") || workbook.worksheets[0];
    if (!worksheet) {
        throw new Error("No worksheet found in workbook");
    }

    const jsonData = processRI003(worksheet, { instCode });

    const reportsDir = path.join(process.cwd(), "reports");
    const jsonDir = path.join(reportsDir, "json");
    const excelDir = path.join(reportsDir, "excel");

    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
    if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });

    const baseName = path.basename(filePath, path.extname(filePath));
    const jsonFileName = `${baseName}.json`;
    const excelFileName = `${baseName}.xlsx`;

    const jsonPath = path.join(jsonDir, jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 4), "utf-8");

    const outWorkbook = new ExcelJS.Workbook();
    const outWs = outWorkbook.addWorksheet("RI003");
    outWs.views = [{ showGridLines: true }];

    outWs.addRow(["ReturnKey", jsonData.ReturnKey]);
    outWs.addRow(["InstCode", jsonData.InstCode]);
    outWs.addRow(["FinYear", jsonData.FinYear]);
    outWs.addRow(["StartDate", jsonData.StartDate]);
    outWs.addRow(["EndDate", jsonData.EndDate]);
    outWs.addRow([]);

    const headerRow = ["Item Code", "Description", "Value"];
    outWs.addRow(headerRow);

    jsonData.ReturnItemsList.forEach((item) => {
        outWs.addRow([item.Code, item._description, item.Value]);
    });

    const excelPath = path.join(excelDir, excelFileName);
    await outWorkbook.xlsx.writeFile(excelPath);

    return {
        jsonData,
        jsonPath: `/reports/json/${jsonFileName}`,
        excelPath: `/reports/excel/${excelFileName}`
    };
}
