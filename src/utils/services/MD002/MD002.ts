import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { MD002Format } from "./jsonFormat";

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

export async function processMD002Report(
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
            workbook.getWorksheet("Deposit by sector and region") ||
            workbook.getWorksheet("CDby Sector and RegMD002") ||
            workbook.getWorksheet("NBE") ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "Invalid MD002 Excel structure: No worksheet found."
            };
        }

        const finYear = new Date(startDate).getFullYear();
        const formattedStartDate = formatIsoString(startDate);
        const formattedEndDate = formatIsoString(endDate);

        // Update Header Metadata cells
        worksheet.getCell("C8").value = instCode;
        worksheet.getCell("C9").value = finYear;
        worksheet.getCell("C10").value = formattedStartDate;
        worksheet.getCell("C11").value = formattedEndDate;

        // 85 rows total: 84 regional sub-rows (Rows 16..99) + 1 Total Deposits row (Row 100)
        // 18 columns (Cols C..T)
        const grid: string[][] = [];

        // Read 14 Regions x 6 sub-rows (Rows 16..99)
        for (let regIndex = 0; regIndex < 14; regIndex++) {
            const startRow = 16 + regIndex * 6;
            for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
                const excelRowIndex = startRow + subRowIndex;
                const row = worksheet.getRow(excelRowIndex);
                const rowArr: string[] = [];

                for (let colIndex = 0; colIndex < 18; colIndex++) {
                    const excelColIndex = 3 + colIndex;
                    const cell = row.getCell(excelColIndex);
                    rowArr.push(getDirectCellValue(cell));
                }
                grid.push(rowArr);
            }
        }

        // Read Total Deposits Row (Row 100)
        const totalRow = worksheet.getRow(100);
        const totalRowArr: string[] = [];
        for (let colIndex = 0; colIndex < 18; colIndex++) {
            const excelColIndex = 3 + colIndex;
            const cell = totalRow.getCell(excelColIndex);
            totalRowArr.push(getDirectCellValue(cell));
        }
        grid.push(totalRowArr);

        const parseNum = (v: string): number => {
            if (!v) return 0;
            const n = parseFloat(v.replace(/,/g, ""));
            return isNaN(n) ? 0 : n;
        };

        // 1. Evaluate Regional Header Rows (sub-row 0 in each region) if empty
        for (let regIndex = 0; regIndex < 14; regIndex++) {
            const headRowIdx = regIndex * 6;
            const demandRowIdx = headRowIdx + 1;
            const savingRowIdx = headRowIdx + 2;
            const timeRowIdx = headRowIdx + 3;
            const urbanRowIdx = headRowIdx + 4;
            const ruralRowIdx = headRowIdx + 5;

            for (let c = 0; c < 18; c++) {
                if (!grid[headRowIdx][c] || grid[headRowIdx][c] === "0") {
                    const demandVal = parseNum(grid[demandRowIdx][c]);
                    const savingVal = parseNum(grid[savingRowIdx][c]);
                    const timeVal = parseNum(grid[timeRowIdx][c]);
                    const subSum = demandVal + savingVal + timeVal;

                    if (subSum !== 0) {
                        grid[headRowIdx][c] = String(subSum);
                    } else {
                        const urbanVal = parseNum(grid[urbanRowIdx][c]);
                        const ruralVal = parseNum(grid[ruralRowIdx][c]);
                        const urSum = urbanVal + ruralVal;
                        if (urSum !== 0) {
                            grid[headRowIdx][c] = String(urSum);
                        }
                    }
                }
            }
        }

        // 2. Evaluate Total Sector Columns (cols 15, 16, 17: Sector Total) for each row if empty
        for (let r = 0; r < 85; r++) {
            // Col 15: Amount Total (sum cols 0, 3, 6, 9, 12)
            if (!grid[r][15] || grid[r][15] === "0") {
                let amtSum = 0;
                for (let i = 0; i < 5; i++) {
                    amtSum += parseNum(grid[r][i * 3]);
                }
                if (amtSum !== 0) grid[r][15] = String(amtSum);
            }

            // Col 16: Depositors Total (sum cols 1, 4, 7, 10, 13)
            if (!grid[r][16] || grid[r][16] === "0") {
                let depSum = 0;
                for (let i = 0; i < 5; i++) {
                    depSum += parseNum(grid[r][i * 3 + 1]);
                }
                if (depSum !== 0) grid[r][16] = String(depSum);
            }

            // Col 17: Accounts Total (sum cols 2, 5, 8, 11, 14)
            if (!grid[r][17] || grid[r][17] === "0") {
                let accSum = 0;
                for (let i = 0; i < 5; i++) {
                    accSum += parseNum(grid[r][i * 3 + 2]);
                }
                if (accSum !== 0) grid[r][17] = String(accSum);
            }
        }

        // 3. Evaluate Total Deposits Row (Row 100, index 84 in grid) if empty
        for (let c = 0; c < 18; c++) {
            if (!grid[84][c] || grid[84][c] === "0") {
                let colSum = 0;
                for (let regIndex = 0; regIndex < 14; regIndex++) {
                    const headRowIdx = regIndex * 6;
                    colSum += parseNum(grid[headRowIdx][c]);
                }
                if (colSum !== 0) {
                    grid[84][c] = String(colSum);
                }
            }
        }

        // Build valuesMap and update Excel cell values
        const valuesMap: Record<string, string> = {};
        let codeCounter = 47252;

        // Write regional sub-rows (Rows 16..99)
        for (let regIndex = 0; regIndex < 14; regIndex++) {
            const startRow = 16 + regIndex * 6;
            for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
                const excelRowIndex = startRow + subRowIndex;
                const gridRowIdx = regIndex * 6 + subRowIndex;

                for (let colIndex = 0; colIndex < 18; colIndex++) {
                    const excelColIndex = 3 + colIndex;
                    const valStr = grid[gridRowIdx][colIndex];
                    const codeStr = `MD002_${codeCounter}`;
                    valuesMap[codeStr] = valStr;
                    codeCounter++;

                    if (valStr) {
                        const cell = worksheet.getRow(excelRowIndex).getCell(excelColIndex);
                        const numVal = parseFloat(valStr);
                        if (typeof cell.value === "object" && cell.value !== null) {
                            (cell.value as any).result = isNaN(numVal) ? valStr : numVal;
                        } else {
                            cell.value = isNaN(numVal) ? valStr : numVal;
                        }
                    }
                }
            }
        }

        // Write Total Deposits Row (Row 100)
        for (let colIndex = 0; colIndex < 18; colIndex++) {
            const excelColIndex = 3 + colIndex;
            const valStr = grid[84][colIndex];
            const codeStr = `MD002_${codeCounter}`;
            valuesMap[codeStr] = valStr;
            codeCounter++;

            if (valStr) {
                const cell = totalRow.getCell(excelColIndex);
                const numVal = parseFloat(valStr);
                if (typeof cell.value === "object" && cell.value !== null) {
                    (cell.value as any).result = isNaN(numVal) ? valStr : numVal;
                } else {
                    cell.value = isNaN(numVal) ? valStr : numVal;
                }
            }
        }

        const jsonOutput = MD002Format(
            "CDby Sector and RegMD002",
            instCode,
            finYear,
            formattedStartDate,
            formattedEndDate,
            valuesMap
        );

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
            itemCount: 1530
        };
    } catch (err: any) {
        console.error("Error in processMD002Report:", err);
        return {
            success: false,
            error: err.message || "Failed to process MD002 report format."
        };
    }
}
