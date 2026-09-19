import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { EE002Format, EE002_REGIONS, EE002_METRIC_SUFFIXES } from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return "";
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

export function getDirectCellValue(cell: any): string {
    if (!cell || cell.value === null || cell.value === undefined) {
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
    let val = cell.value;
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "[object Object]" ? "" : trimmed;
    }
    if (val instanceof Date) {
        return formatIsoString(val);
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && val.result !== null && "error" in val.result) {
                return "";
            }
            if (typeof val.result === "number") return String(val.result);
            if (typeof val.result === "string") {
                const s = val.result.trim();
                return s === "[object Object]" ? "" : s;
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t: any) => (t && t.text ? t.text : "")).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
    }
    if (cell.result !== undefined && cell.result !== null) {
        if (typeof cell.result === "object" && "error" in cell.result) return "";
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

export function processEE002(
    worksheet: ExcelJS.Worksheet,
    options?: { instCode?: string; startDate?: string; endDate?: string }
) {
    let instCode = options?.instCode || "0000001";
    let finYear = 2026;
    let startDate = options?.startDate || "2026-04-01T00:00:00";
    let endDate = options?.endDate || "2026-06-30T00:00:00";

    // Scan metadata block
    for (let r = 1; r <= 15; r++) {
        const row = worksheet.getRow(r);
        const colAText = getDirectCellValue(row.getCell(1)).toLowerCase();
        const colBText = getDirectCellValue(row.getCell(2)).toLowerCase();
        const colCText = getDirectCellValue(row.getCell(3)).toLowerCase();
        const combined = `${colAText} ${colBText} ${colCText}`;

        if (combined.includes("inst") && (combined.includes("code") || combined.includes("tion"))) {
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

    // Locate start row (Addis Ababa)
    let startRowOffset = 17;
    for (let r = 10; r <= 25; r++) {
        const row = worksheet.getRow(r);
        const col1 = getDirectCellValue(row.getCell(1)).toLowerCase();
        const col2 = getDirectCellValue(row.getCell(2)).toLowerCase();
        if (col1.includes("addis ababa") || col2.includes("addis ababa")) {
            startRowOffset = r;
            break;
        }
    }

    const startCol = 3; // Column C

    // 14 regions x 6 sub-rows = 84 rows
    const grid: string[][] = [];
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const startRow = startRowOffset + regIndex * 6;
        for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
            const excelRowIndex = startRow + subRowIndex;
            const row = worksheet.getRow(excelRowIndex);
            const rowArr: string[] = [];

            for (let colIndex = 0; colIndex < 24; colIndex++) {
                const excelColIndex = startCol + colIndex;
                const cell = row.getCell(excelColIndex);
                rowArr.push(getDirectCellValue(cell));
            }
            grid.push(rowArr);
        }
    }

    // Total Amount row (row 85 in grid / row 101 in Excel)
    const totalRowIndex = startRowOffset + 14 * 6;
    const totalRow = worksheet.getRow(totalRowIndex);
    const totalRowArr: string[] = [];
    for (let colIndex = 0; colIndex < 24; colIndex++) {
        const excelColIndex = startCol + colIndex;
        const cell = totalRow.getCell(excelColIndex);
        totalRowArr.push(getDirectCellValue(cell));
    }
    grid.push(totalRowArr);

    const parseNum = (v: string): number => {
        if (!v) return 0;
        const n = parseFloat(v.replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
    };

    // Auto-calculate empty regional head rows (sub-row 0) from Term loan (1) + Overdraft (2) + Merch. loan (3)
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const headRowIdx = regIndex * 6;
        const termRowIdx = headRowIdx + 1;
        const overRowIdx = headRowIdx + 2;
        const merchRowIdx = headRowIdx + 3;

        for (let c = 0; c < 24; c++) {
            if (!grid[headRowIdx][c] || grid[headRowIdx][c] === "0") {
                const tVal = parseNum(grid[termRowIdx][c]);
                const oVal = parseNum(grid[overRowIdx][c]);
                const mVal = parseNum(grid[merchRowIdx][c]);
                const subSum = tVal + oVal + mVal;
                if (subSum !== 0) {
                    grid[headRowIdx][c] = String(subSum);
                }
            }
        }
    }

    // Auto-calculate empty total columns (Cols 21, 22, 23 in 0-indexed data cols / columns X, Y, Z in Excel)
    for (let r = 0; r < grid.length; r++) {
        // Amount total (col 21) = cols 0, 3, 6, 9, 12, 15, 18
        if (!grid[r][21] || grid[r][21] === "0") {
            const sumAmt =
                parseNum(grid[r][0]) +
                parseNum(grid[r][3]) +
                parseNum(grid[r][6]) +
                parseNum(grid[r][9]) +
                parseNum(grid[r][12]) +
                parseNum(grid[r][15]) +
                parseNum(grid[r][18]);
            if (sumAmt !== 0) grid[r][21] = String(sumAmt);
        }
        // Borrowers total (col 22) = cols 1, 4, 7, 10, 13, 16, 19
        if (!grid[r][22] || grid[r][22] === "0") {
            const sumBor =
                parseNum(grid[r][1]) +
                parseNum(grid[r][4]) +
                parseNum(grid[r][7]) +
                parseNum(grid[r][10]) +
                parseNum(grid[r][13]) +
                parseNum(grid[r][16]) +
                parseNum(grid[r][19]);
            if (sumBor !== 0) grid[r][22] = String(sumBor);
        }
        // Accounts total (col 23) = cols 2, 5, 8, 11, 14, 17, 20
        if (!grid[r][23] || grid[r][23] === "0") {
            const sumAcc =
                parseNum(grid[r][2]) +
                parseNum(grid[r][5]) +
                parseNum(grid[r][8]) +
                parseNum(grid[r][11]) +
                parseNum(grid[r][14]) +
                parseNum(grid[r][17]) +
                parseNum(grid[r][20]);
            if (sumAcc !== 0) grid[r][23] = String(sumAcc);
        }
    }

    // Auto-calculate Total Amount row (row index 84 in grid) from the 14 regional head rows if empty
    const totGridIdx = 84;
    for (let c = 0; c < 24; c++) {
        if (!grid[totGridIdx][c] || grid[totGridIdx][c] === "0") {
            let colSum = 0;
            for (let reg = 0; reg < 14; reg++) {
                colSum += parseNum(grid[reg * 6][c]);
            }
            if (colSum !== 0) grid[totGridIdx][c] = String(colSum);
        }
    }

    // Map into valuesMap (EE002_44192 to EE002_46231)
    const valuesMap: Record<string, string> = {};
    let codeCounter = 44192;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < 24; c++) {
            const codeStr = `EE002_${codeCounter}`;
            valuesMap[codeStr] = grid[r][c] || "0";
            codeCounter++;
        }
    }

    return EE002Format("INT_LON_R&R_EE002", instCode, finYear, startDate, endDate, valuesMap);
}

export async function jsonToExcelEE002(jsonPayload: any, outputPath?: string): Promise<Buffer> {
    const templatePath = path.join(process.cwd(), "templates", "EE002.xlsx");
    let workbook = new ExcelJS.Workbook();

    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        // Fallback: build workbook programmatically
        const ws = workbook.addWorksheet("INT_LON_R&R_EE002");
        ws.views = [{ showGridLines: true }];
    }

    let worksheet = workbook.getWorksheet("INT_LON_R&R_EE002") || workbook.worksheets[0];
    if (!worksheet) {
        worksheet = workbook.addWorksheet("INT_LON_R&R_EE002");
    }

    // Update metadata
    if (jsonPayload.InstCode) {
        worksheet.getCell("C8").value = String(jsonPayload.InstCode);
    }
    if (jsonPayload.FinYear) {
        worksheet.getCell("C9").value = Number(jsonPayload.FinYear);
    }
    if (jsonPayload.StartDate) {
        worksheet.getCell("C10").value = String(jsonPayload.StartDate).split("T")[0];
    }
    if (jsonPayload.EndDate) {
        worksheet.getCell("C11").value = String(jsonPayload.EndDate).split("T")[0];
    }

    // Build value lookup map from return items list
    const itemsMap: Record<string, number | string> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach((item: any) => {
            if (item && item.Code) {
                const strVal = String(item.Value || "0").trim();
                const numVal = parseFloat(strVal.replace(/,/g, ""));
                itemsMap[item.Code] = isNaN(numVal) ? strVal : numVal;
            }
        });
    }

    const startRow = 17;
    const startCol = 3;
    let codeIdx = 44192;

    // Populate 84 regional rows + 1 total amount row
    for (let r = 0; r < 85; r++) {
        const rowNum = startRow + r;
        const row = worksheet.getRow(rowNum);

        for (let c = 0; c < 24; c++) {
            const colNum = startCol + c;
            const codeStr = `EE002_${codeIdx}`;
            codeIdx++;

            const val = itemsMap[codeStr];
            const cell = row.getCell(colNum);

            if (val !== undefined && val !== null && val !== "") {
                if (typeof val === "number") {
                    cell.value = val;
                } else {
                    const parsed = parseFloat(String(val).replace(/,/g, ""));
                    cell.value = isNaN(parsed) ? val : parsed;
                }
            } else {
                cell.value = 0;
            }
            cell.numFmt = "0.00";
        }
    }

    if (outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await workbook.xlsx.writeFile(outputPath);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}

export async function processEE002Report(
    instCodeOrPath: string,
    inputFileOrInstCode?: string,
    startDateStr?: string,
    endDateStr?: string,
    outputExcelPath?: string,
    outputJsonPath?: string
): Promise<{ success: boolean; jsonData?: any; jsonPath?: string; excelPath?: string; error?: string }> {
    try {
        let instCode = "0000001";
        let filePath = "";
        let jsonPath = "";
        let excelPath = "";

        if (outputJsonPath && outputExcelPath) {
            instCode = instCodeOrPath || "0000001";
            filePath = inputFileOrInstCode || "";
            jsonPath = outputJsonPath;
            excelPath = outputExcelPath;
        } else {
            filePath = instCodeOrPath;
            instCode = inputFileOrInstCode || "0000001";
            const reportsDir = path.join(process.cwd(), "reports");
            const baseName = path.basename(filePath, path.extname(filePath));
            jsonPath = path.join(reportsDir, "json", `${baseName}.json`);
            excelPath = path.join(reportsDir, "excel", `${baseName}.xlsx`);
        }

        if (!filePath || !fs.existsSync(filePath)) {
            return {
                success: false,
                error: `Input file not found at path: ${filePath}`
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet =
            workbook.getWorksheet("INT_LON_R&R_EE002") ||
            workbook.getWorksheet("Quarterly Interest Free Loans") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "No valid worksheet found in input template."
            };
        }

        const jsonData = processEE002(worksheet, {
            instCode,
            startDate: startDateStr,
            endDate: endDateStr
        });

        // Ensure directories exist
        const jsonDir = path.dirname(jsonPath);
        const excelDir = path.dirname(excelPath);
        if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
        if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });

        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 4), "utf-8");
        await jsonToExcelEE002(jsonData, excelPath);

        return {
            success: true,
            jsonData,
            jsonPath,
            excelPath
        };
    } catch (err: any) {
        console.error("Error processing EE002 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process EE002 report."
        };
    }
}
