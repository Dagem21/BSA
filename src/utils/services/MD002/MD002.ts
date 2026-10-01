import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { MD002Format } from "./jsonFormat";

function formatIsoString(dateVal: any, fallback: string = ""): string {
    if (!dateVal) return fallback;
    if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return fallback;
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) return str.split(".")[0];
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    return fallback || str;
}

function getDirectCellValue(cell: any): string {
    if (!cell || cell === null || cell === undefined) return "";
    let val = cell;
    if (cell && typeof cell === "object" && "value" in cell && ("type" in cell || "address" in cell || "worksheet" in cell)) {
        val = cell.value;
    }
    if (val === null || val === undefined) {
        if (cell && typeof cell === "object") {
            if (cell.result !== undefined && cell.result !== null) {
                if (typeof cell.result === "object" && "error" in cell.result) return "";
                return String(cell.result).trim();
            }
            if (cell.text !== undefined && cell.text !== null) {
                return String(cell.text).trim();
            }
        }
        return "";
    }
    if (typeof val === "number") return String(val);
    if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "[object Object]") return "";
        return trimmed;
    }
    if (Array.isArray(val)) {
        return val.map((item: any) => {
            if (!item) return "";
            if (typeof item === "string") return item;
            if (typeof item === "object") {
                if ("text" in item && item.text) return item.text;
                if ("result" in item && item.result !== undefined && item.result !== null) return String(item.result);
            }
            return "";
        }).join("").trim();
    }
    if (val instanceof Date) {
        if (isNaN(val.getTime())) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`;
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && val.result !== null && "error" in val.result) return "";
            if (typeof val.result === "number") return String(val.result);
            if (typeof val.result === "string") {
                const s = val.result.trim();
                return s === "[object Object]" ? "" : s;
            }
            if (Array.isArray(val.result)) {
                return val.result.map((item: any) => (item && typeof item === "object" && "text" in item ? item.text : String(item))).join("").trim();
            }
            if (val.result instanceof Date) {
                if (isNaN(val.result.getTime())) return "";
                const pad = (n: number) => String(n).padStart(2, "0");
                return `${val.result.getFullYear()}-${pad(val.result.getMonth() + 1)}-${pad(val.result.getDate())}`;
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t: any) => (t && t.text ? t.text : "")).join("").trim();
        }
        if ("text" in val && val.text) return String(val.text).trim();
        if (cell && cell.result !== undefined && cell.result !== null) {
            if (typeof cell.result === "object" && "error" in cell.result) return "";
            return String(cell.result).trim();
        }
        if (cell && cell.text !== undefined && cell.text !== null) return String(cell.text).trim();
        return "";
    }
    return "";
}

function parseNum(v: string): number {
    if (!v) return 0;
    const n = parseFloat(v.replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
}

export function processMD002(
    worksheet: ExcelJS.Worksheet,
    instCode?: string,
    startDate?: string,
    endDate?: string
) {
    // Dynamically locate start row for "Addis Ababa" in Col 2 (B)
    let startRow = 16;
    for (let r = 1; r <= 30; r++) {
        const rowVal = getDirectCellValue(worksheet.getRow(r).getCell(2));
        if (rowVal.toLowerCase().includes("addis ababa")) {
            startRow = r;
            break;
        }
    }

    let parsedInstCode = instCode || "0000001";
    if (startRow > 10) {
        const c8Val = getDirectCellValue(worksheet.getCell("C8"));
        if (c8Val) parsedInstCode = c8Val;
    }

    const finYearRaw = startRow > 10 ? getDirectCellValue(worksheet.getCell("C9")) : "";
    const sDateRaw = startRow > 10 ? worksheet.getCell("C10").value : null;
    const eDateRaw = startRow > 10 ? worksheet.getCell("C11").value : null;

    const formattedStartDate = formatIsoString(startDate || sDateRaw, "2026-08-01T00:00:00");
    const formattedEndDate = formatIsoString(endDate || eDateRaw, "2026-08-31T00:00:00");
    const finYear = startDate ? new Date(startDate).getFullYear() : (finYearRaw ? parseInt(finYearRaw, 10) : 2026);

    // 85 rows total: 84 regional sub-rows (14 regions x 6 sub-rows) + 1 Total Deposits row
    // 18 columns (Cols C..T -> col indices 3..20)
    const grid: string[][] = [];

    // Read 14 Regions x 6 sub-rows
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const regionStartRow = startRow + regIndex * 6;
        for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
            const excelRowIndex = regionStartRow + subRowIndex;
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

    // Read Total Deposits Row (startRow + 84)
    const totalRowIndex = startRow + 84;
    const totalRow = worksheet.getRow(totalRowIndex);
    const totalRowArr: string[] = [];
    for (let colIndex = 0; colIndex < 18; colIndex++) {
        const excelColIndex = 3 + colIndex;
        const cell = totalRow.getCell(excelColIndex);
        totalRowArr.push(getDirectCellValue(cell));
    }
    grid.push(totalRowArr);

    // 1. Evaluate Regional Header Rows (sub-row 0 in each region) if empty/0
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

    // 2. Evaluate Total Sector Columns (cols 15, 16, 17: Sector Total) for each row if empty/0
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

    // 3. Evaluate Total Deposits Row (Row index 84 in grid) if empty/0
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

    // Build valuesMap: MD002_47252 to MD002_48781 (1,530 items)
    const valuesMap: Record<string, string> = {};
    let codeCounter = 47252;

    for (let r = 0; r < 85; r++) {
        for (let colIndex = 0; colIndex < 18; colIndex++) {
            const valStr = grid[r][colIndex];
            const codeStr = `MD002_${codeCounter}`;
            valuesMap[codeStr] = (valStr === undefined || valStr === null || valStr.trim() === "" || valStr.trim() === "[object Object]") ? "0" : valStr.trim();
            codeCounter++;
        }
    }

    const jsonOutput = MD002Format(
        "CDby Sector and RegMD002",
        parsedInstCode,
        finYear,
        formattedStartDate,
        formattedEndDate,
        valuesMap
    );

    // Enforce NBE zero-padding across all return items
    if (jsonOutput && Array.isArray(jsonOutput.ReturnItemsList)) {
        jsonOutput.ReturnItemsList = jsonOutput.ReturnItemsList.map((item: any) => ({
            ...item,
            Value: (!item.Value || item.Value === "[object Object]") ? "0" : item.Value
        }));
    }

    return jsonOutput;
}

export async function jsonToExcelMD002(jsonPayload: any): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(process.cwd(), "templates", "CDby Sector and RegMD002.xlsx");

    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        workbook.addWorksheet("Deposit by sector and region");
    }

    const worksheet =
        workbook.getWorksheet("Deposit by sector and region") ||
        workbook.getWorksheet("CDby Sector and RegMD002") ||
        workbook.worksheets[0];

    if (worksheet) {
        worksheet.getCell("C8").value = jsonPayload.InstCode || "0000001";
        worksheet.getCell("C9").value = jsonPayload.FinYear || 2026;
        worksheet.getCell("C10").value = jsonPayload.StartDate || "2026-08-01T00:00:00";
        worksheet.getCell("C11").value = jsonPayload.EndDate || "2026-08-31T00:00:00";

        // Map values back to grid
        const valuesMap: Record<string, string> = {};
        if (Array.isArray(jsonPayload.ReturnItemsList)) {
            for (const item of jsonPayload.ReturnItemsList) {
                valuesMap[item.Code] = item.Value;
            }
        }

        let codeCounter = 47252;
        let startRow = 16;
        for (let r = 1; r <= 30; r++) {
            const rowVal = getDirectCellValue(worksheet.getRow(r).getCell(2));
            if (rowVal.toLowerCase().includes("addis ababa")) {
                startRow = r;
                break;
            }
        }

        // Write 84 regional rows + 1 total row
        for (let regIndex = 0; regIndex < 14; regIndex++) {
            const regionStart = startRow + regIndex * 6;
            for (let sub = 0; sub < 6; sub++) {
                const row = worksheet.getRow(regionStart + sub);
                for (let col = 0; col < 18; col++) {
                    const code = `MD002_${codeCounter}`;
                    codeCounter++;
                    const val = valuesMap[code] ?? "0";
                    const numVal = parseFloat(val);
                    row.getCell(3 + col).value = isNaN(numVal) ? val : numVal;
                }
            }
        }

        // Total row
        const totalRow = worksheet.getRow(startRow + 84);
        for (let col = 0; col < 18; col++) {
            const code = `MD002_${codeCounter}`;
            codeCounter++;
            const val = valuesMap[code] ?? "0";
            const numVal = parseFloat(val);
            totalRow.getCell(3 + col).value = isNaN(numVal) ? val : numVal;
        }
    }

    return workbook;
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
        if (!inputFilePath || !fs.existsSync(inputFilePath)) {
            return {
                success: false,
                error: `Input file '${inputFilePath}' not found.`
            };
        }

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

        const jsonOutput = processMD002(worksheet, instCode, startDate, endDate);

        const jsonDir = path.dirname(outputJsonPath);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputJsonPath, JSON.stringify(jsonOutput, null, 4));

        if (outputExcelPath) {
            const excelDir = path.dirname(outputExcelPath);
            if (!fs.existsSync(excelDir)) {
                fs.mkdirSync(excelDir, { recursive: true });
            }
            const outWorkbook = await jsonToExcelMD002(jsonOutput);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

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
