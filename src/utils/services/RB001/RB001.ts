import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { RB001Format } from "./jsonFormat";

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
        return "";
    }
    if (cell.result !== undefined && cell.result !== null) {
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

export async function processRB001Report(
    instCode: string,
    inputFilePath: string,
    startDate: string,
    endDate: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);

    const worksheet =
        workbook.getWorksheet("NBE") ||
        workbook.getWorksheet("Reserve Base") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells
    worksheet.getCell("B8").value = instCode;
    worksheet.getCell("B9").value = finYear;
    worksheet.getCell("B10").value = formattedStartDate;
    worksheet.getCell("B11").value = formattedEndDate;

    // Read 11 Rows (Rows 14..24) x 32 Cols (Cols C..AH) into 2D grid
    const grid: string[][] = [];
    for (let r = 0; r < 11; r++) {
        const rowArr: string[] = [];
        const excelRow = 14 + r;
        for (let c = 0; c < 32; c++) {
            const excelCol = 3 + c;
            const cell = worksheet.getRow(excelRow).getCell(excelCol);
            rowArr.push(getDirectCellValue(cell));
        }
        grid.push(rowArr);
    }

    const parseNum = (v: string): number => {
        if (!v) return 0;
        const n = parseFloat(v.replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
    };

    // Calculate formula rows for each column (Col 0..31)
    for (let c = 0; c < 32; c++) {
        const demand = parseNum(grid[1][c]);
        const saving = parseNum(grid[2][c]);
        const time = parseNum(grid[3][c]);

        // Row 14 (Reserve Base): index 0 = 1 + 2 + 3
        if (!grid[0][c] || grid[0][c] === "0") {
            const reserveBase = demand + saving + time;
            if (reserveBase !== 0) grid[0][c] = String(reserveBase);
        }

        // Row 19 (Un-cleared local): index 5
        // Row 20 (Un-cleared foreign): index 6
        const unclearedLocal = parseNum(grid[5][c]);
        const unclearedForeign = parseNum(grid[6][c]);

        // Row 18 (Deductions): index 4 = 5 + 6
        if (!grid[4][c] || grid[4][c] === "0") {
            const deductions = unclearedLocal + unclearedForeign;
            if (deductions !== 0) grid[4][c] = String(deductions);
        }

        // Row 21 (Net Reserve Base): index 7 = 0 - 4
        if (!grid[7][c] || grid[7][c] === "0") {
            const reserveBase = parseNum(grid[0][c]);
            const deductions = parseNum(grid[4][c]);
            const netReserveBase = reserveBase - deductions;
            if (netReserveBase !== 0) grid[7][c] = String(netReserveBase);
        }

        // Row 22 (Payment & Settlement): index 8
        // Row 23 (Currency Issue): index 9
        const paymentSettlement = parseNum(grid[8][c]);
        const currencyIssue = parseNum(grid[9][c]);

        // Row 24 (Deposit Balance with NBE): index 10 = 8 + 9
        if (!grid[10][c] || grid[10][c] === "0") {
            const depositBalance = paymentSettlement + currencyIssue;
            if (depositBalance !== 0) grid[10][c] = String(depositBalance);
        }
    }

    // Compute Monthly Average (column index 31) for each row if empty
    for (let r = 0; r < 11; r++) {
        if (!grid[r][31] || grid[r][31] === "0") {
            let daySum = 0;
            let activeDaysCount = 0;
            for (let c = 0; c < 31; c++) {
                const val = parseNum(grid[r][c]);
                if (val !== 0) {
                    daySum += val;
                    activeDaysCount++;
                }
            }
            if (activeDaysCount > 0) {
                const avg = daySum / activeDaysCount;
                grid[r][31] = String(Math.round(avg * 100) / 100);
            }
        }
    }

    // Build valuesMap and update Excel cell values
    const valuesMap: Record<string, string> = {};
    let codeCounter = 1;

    for (let r = 0; r < 11; r++) {
        const excelRow = 14 + r;
        for (let c = 0; c < 32; c++) {
            const excelCol = 3 + c;
            const valStr = grid[r][c];
            const codeStr = `166_${codeCounter.toString().padStart(5, "0")}`;
            valuesMap[codeStr] = valStr;
            codeCounter++;

            // Preserve numeric value into cell result if evaluated
            if (valStr) {
                const cell = worksheet.getRow(excelRow).getCell(excelCol);
                const numVal = parseFloat(valStr);
                if (typeof cell.value === "object" && cell.value !== null) {
                    (cell.value as any).result = isNaN(numVal) ? valStr : numVal;
                } else {
                    cell.value = isNaN(numVal) ? valStr : numVal;
                }
            }
        }
    }

    const jsonOutput = RB001Format(
        "Reserve BaseRB001",
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
        itemCount: 352
    };
}
