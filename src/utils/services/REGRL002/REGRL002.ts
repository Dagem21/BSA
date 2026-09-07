import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { REGRL002Format } from "./jsonFormat";

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

export async function processREGRL002Report(
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
            workbook.getWorksheet("Loan by range and region") ||
            workbook.getWorksheet("NBE") ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "Invalid REGRL002 Excel structure: No worksheet found."
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

        // 85 rows total: 84 regional sub-rows (Rows 17..100) + 1 Total Amount row (Row 101)
        // 24 columns (Cols C..Z)
        const grid: string[][] = [];

        // Read 14 Regions x 6 sub-rows (Rows 17..100)
        for (let regIndex = 0; regIndex < 14; regIndex++) {
            const startRow = 17 + regIndex * 6;
            for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
                const excelRowIndex = startRow + subRowIndex;
                const row = worksheet.getRow(excelRowIndex);
                const rowArr: string[] = [];

                for (let colIndex = 0; colIndex < 24; colIndex++) {
                    const excelColIndex = 3 + colIndex;
                    const cell = row.getCell(excelColIndex);
                    rowArr.push(getDirectCellValue(cell));
                }
                grid.push(rowArr);
            }
        }

        // Read Total Amount Row (Row 101)
        const totalRow = worksheet.getRow(101);
        const totalRowArr: string[] = [];
        for (let colIndex = 0; colIndex < 24; colIndex++) {
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
            const termRowIdx = headRowIdx + 1;
            const odRowIdx = headRowIdx + 2;
            const merchRowIdx = headRowIdx + 3;
            const urbanRowIdx = headRowIdx + 4;
            const ruralRowIdx = headRowIdx + 5;

            for (let c = 0; c < 24; c++) {
                if (!grid[headRowIdx][c] || grid[headRowIdx][c] === "0") {
                    const termVal = parseNum(grid[termRowIdx][c]);
                    const odVal = parseNum(grid[odRowIdx][c]);
                    const merchVal = parseNum(grid[merchRowIdx][c]);
                    const subSum = termVal + odVal + merchVal;

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

        // 2. Evaluate Total Range Columns (cols 21, 22, 23: Range Total) for each row if empty
        for (let r = 0; r < 85; r++) {
            // Col 21: Amount Total (sum cols 0, 3, 6, 9, 12, 15, 18)
            if (!grid[r][21] || grid[r][21] === "0") {
                let amtSum = 0;
                for (let i = 0; i < 7; i++) {
                    amtSum += parseNum(grid[r][i * 3]);
                }
                if (amtSum !== 0) grid[r][21] = String(amtSum);
            }

            // Col 22: Borrowers Total (sum cols 1, 4, 7, 10, 13, 16, 19)
            if (!grid[r][22] || grid[r][22] === "0") {
                let borSum = 0;
                for (let i = 0; i < 7; i++) {
                    borSum += parseNum(grid[r][i * 3 + 1]);
                }
                if (borSum !== 0) grid[r][22] = String(borSum);
            }

            // Col 23: Accounts Total (sum cols 2, 5, 8, 11, 14, 17, 20)
            if (!grid[r][23] || grid[r][23] === "0") {
                let accSum = 0;
                for (let i = 0; i < 7; i++) {
                    accSum += parseNum(grid[r][i * 3 + 2]);
                }
                if (accSum !== 0) grid[r][23] = String(accSum);
            }
        }

        // 3. Evaluate Total Amount Row (Row 101, index 84 in grid) if empty
        for (let c = 0; c < 24; c++) {
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
        let codeCounter = 48782;

        // Write regional sub-rows (Rows 17..100)
        for (let regIndex = 0; regIndex < 14; regIndex++) {
            const startRow = 17 + regIndex * 6;
            for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
                const excelRowIndex = startRow + subRowIndex;
                const gridRowIdx = regIndex * 6 + subRowIndex;

                for (let colIndex = 0; colIndex < 24; colIndex++) {
                    const excelColIndex = 3 + colIndex;
                    const valStr = grid[gridRowIdx][colIndex];
                    const codeStr = `RL002_${codeCounter}`;
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

        // Write Total Amount Row (Row 101)
        for (let colIndex = 0; colIndex < 24; colIndex++) {
            const excelColIndex = 3 + colIndex;
            const valStr = grid[84][colIndex];
            const codeStr = `RL002_${codeCounter}`;
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

        const jsonOutput = REGRL002Format(
            "LOAN_RAN & REGRL002",
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
            itemCount: 2040
        };
    } catch (err: any) {
        console.error("Error in processREGRL002Report:", err);
        return {
            success: false,
            error: err.message || "Failed to process REGRL002 report format."
        };
    }
}
