import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { DR002Format } from "./jsonFormat";

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

export function processDR002(worksheet: ExcelJS.Worksheet, options?: { instCode?: string; startDate?: string; endDate?: string }) {
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

    // 14 regions x 6 sub-rows = 84 rows
    // Detect starting row for data (usually Row 14 or 17)
    let startRowOffset = 14;
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
        const startRow = startRowOffset + regIndex * 6;
        for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
            const excelRowIndex = startRow + subRowIndex;
            const row = worksheet.getRow(excelRowIndex);
            const rowArr: string[] = [];

            for (let colIndex = 0; colIndex < 12; colIndex++) {
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

    // Auto-calculate empty regional totals (sub-row 0) from Demand (sub-row 1) + Saving (sub-row 2) + Time (sub-row 3)
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const headRowIdx = regIndex * 6;
        const demandRowIdx = headRowIdx + 1;
        const savingRowIdx = headRowIdx + 2;
        const timeRowIdx = headRowIdx + 3;
        const urbanRowIdx = headRowIdx + 4;
        const ruralRowIdx = headRowIdx + 5;

        for (let c = 0; c < 12; c++) {
            if (!grid[headRowIdx][c] || grid[headRowIdx][c] === "0") {
                const dVal = parseNum(grid[demandRowIdx][c]);
                const sVal = parseNum(grid[savingRowIdx][c]);
                const tVal = parseNum(grid[timeRowIdx][c]);
                const subSum = dVal + sVal + tVal;

                if (subSum !== 0) {
                    grid[headRowIdx][c] = String(subSum);
                } else {
                    const uVal = parseNum(grid[urbanRowIdx][c]);
                    const rVal = parseNum(grid[ruralRowIdx][c]);
                    const urSum = uVal + rVal;
                    if (urSum !== 0) {
                        grid[headRowIdx][c] = String(urSum);
                    }
                }
            }
        }
    }

    // Auto-calculate empty Range Totals (cols 9, 10, 11) for each row
    for (let r = 0; r < 84; r++) {
        // Col 9: Amount Total (sum cols 0, 3, 6)
        if (!grid[r][9] || grid[r][9] === "0") {
            const amtSum = parseNum(grid[r][0]) + parseNum(grid[r][3]) + parseNum(grid[r][6]);
            if (amtSum !== 0) grid[r][9] = String(amtSum);
        }
        // Col 10: Depositors Total (sum cols 1, 4, 7)
        if (!grid[r][10] || grid[r][10] === "0") {
            const depSum = parseNum(grid[r][1]) + parseNum(grid[r][4]) + parseNum(grid[r][7]);
            if (depSum !== 0) grid[r][10] = String(depSum);
        }
        // Col 11: Accounts Total (sum cols 2, 5, 8)
        if (!grid[r][11] || grid[r][11] === "0") {
            const accSum = parseNum(grid[r][2]) + parseNum(grid[r][5]) + parseNum(grid[r][8]);
            if (accSum !== 0) grid[r][11] = String(accSum);
        }
    }

    // Map valuesMap to DR002 codes starting from DR002_34682
    const valuesMap: Record<string, string> = {};
    let codeCounter = 34682;

    for (let r = 0; r < 84; r++) {
        for (let colIndex = 0; colIndex < 12; colIndex++) {
            const codeStr = `DR002_${codeCounter}`;
            valuesMap[codeStr] = grid[r][colIndex];
            codeCounter++;
        }
    }

    // Check code-based cell list overrides (DR002_XXXXX in Col 1)
    for (let r = 1; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const codeVal = getDirectCellValue(row.getCell(1));
        const itemVal = getDirectCellValue(row.getCell(3)) || getDirectCellValue(row.getCell(2));
        if (codeVal && codeVal.startsWith("DR002_")) {
            valuesMap[codeVal] = itemVal;
        }
    }

    return DR002Format(
        "DEP_RAN&REG_DR002",
        instCode,
        finYear,
        startDate,
        endDate,
        valuesMap
    );
}

export async function processDR002Report(
    instCode: string,
    inputFilePath: string,
    startDate: string,
    endDate: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);

        const worksheet =
            workbook.getWorksheet("DEP_RAN&REG_DR002") ||
            workbook.getWorksheet("DR002") ||
            workbook.getWorksheet("Deposit by range and region") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "Invalid DR002 Excel structure: No worksheet found."
            };
        }

        const jsonOutput = processDR002(worksheet, {
            instCode,
            startDate,
            endDate
        });

        const jsonDir = path.dirname(outputJsonPath);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputJsonPath, JSON.stringify(jsonOutput, null, 4));

        const excelDir = path.dirname(outputExcelPath);
        if (!fs.existsSync(excelDir)) {
            fs.mkdirSync(excelDir, { recursive: true });
        }
        await workbook.xlsx.writeFile(outputExcelPath);

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath,
            itemCount: 1008
        };
    } catch (err: any) {
        console.error("Error in processDR002Report:", err);
        return {
            success: false,
            error: err.message || "Failed to process DR002 report format."
        };
    }
}
