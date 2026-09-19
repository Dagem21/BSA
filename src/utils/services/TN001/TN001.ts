import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { TN001Format, TN001RowData } from "./jsonFormat";

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

export function processTN001(
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

    // Locate data start row: Borrower 1 (Row 16)
    let startRow = 16;
    for (let r = 13; r <= 20; r++) {
        const row = worksheet.getRow(r);
        const col1 = getDirectCellValue(row.getCell(1)).trim();
        const col2 = getDirectCellValue(row.getCell(2)).trim().toLowerCase();
        if (col1 === "1" && !col2.includes("s.no")) {
            startRow = r;
            break;
        }
    }

    const parseNum = (v: string): number => {
        if (!v) return 0;
        const n = parseFloat(v.replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
    };

    const dynamicRows: TN001RowData[] = [];
    const returnItemsMap: Record<string, string> = {};

    // 1. Process top 10 borrowers (rows 16 to 25)
    for (let i = 1; i <= 10; i++) {
        const rowNum = startRow + (i - 1);
        const row = worksheet.getRow(rowNum);

        const sNo = getDirectCellValue(row.getCell(1)) || String(i);
        const nameOfBorrower = getDirectCellValue(row.getCell(2));
        const loansApproved = getDirectCellValue(row.getCell(3)) || "0";
        const loansOutstanding = getDirectCellValue(row.getCell(4)) || "0";
        const collateralValue = getDirectCellValue(row.getCell(5)) || "0";
        const provisionHeld = getDirectCellValue(row.getCell(6)) || "0";
        const loanStatus = getDirectCellValue(row.getCell(7));

        dynamicRows.push({
            sNo,
            nameOfBorrower,
            loansApproved,
            loansOutstanding,
            collateralValue,
            provisionHeld,
            loanStatus
        });
    }

    // 2. Process Sub total top ten (10) NPLs (row 26)
    const subTotalRowNum = startRow + 10;
    const subTotalRow = worksheet.getRow(subTotalRowNum);
    let subAppr = getDirectCellValue(subTotalRow.getCell(3));
    let subOut = getDirectCellValue(subTotalRow.getCell(4));
    let subCol = getDirectCellValue(subTotalRow.getCell(5));
    let subProv = getDirectCellValue(subTotalRow.getCell(6));

    if (!subAppr || subAppr === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].loansApproved.toString());
        subAppr = String(sum);
    }
    if (!subOut || subOut === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].loansOutstanding.toString());
        subOut = String(sum);
    }
    if (!subCol || subCol === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].collateralValue.toString());
        subCol = String(sum);
    }
    if (!subProv || subProv === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].provisionHeld.toString());
        subProv = String(sum);
    }

    returnItemsMap["10_00005"] = subAppr; // Sub total Loans Approved
    returnItemsMap["10_00001"] = subOut;  // Sub total Loans Outstanding
    returnItemsMap["10_00004"] = subCol;  // Sub total Collateral value
    returnItemsMap["10_00002"] = subProv; // Sub total Provision Held

    // 3. Process borrowers 11 to 20 (rows 27 to 36)
    for (let i = 11; i <= 20; i++) {
        const rowNum = subTotalRowNum + (i - 10);
        const row = worksheet.getRow(rowNum);

        const sNo = getDirectCellValue(row.getCell(1)) || String(i);
        const nameOfBorrower = getDirectCellValue(row.getCell(2));
        const loansApproved = getDirectCellValue(row.getCell(3)) || "0";
        const loansOutstanding = getDirectCellValue(row.getCell(4)) || "0";
        const collateralValue = getDirectCellValue(row.getCell(5)) || "0";
        const provisionHeld = getDirectCellValue(row.getCell(6)) || "0";
        const loanStatus = getDirectCellValue(row.getCell(7));

        dynamicRows.push({
            sNo,
            nameOfBorrower,
            loansApproved,
            loansOutstanding,
            collateralValue,
            provisionHeld,
            loanStatus
        });
    }

    // 4. Process Grand total top twenty (20) NPLs (row 37)
    const grandTotalRowNum = subTotalRowNum + 11;
    const grandTotalRow = worksheet.getRow(grandTotalRowNum);
    let grandAppr = getDirectCellValue(grandTotalRow.getCell(3));
    let grandOut = getDirectCellValue(grandTotalRow.getCell(4));
    let grandCol = getDirectCellValue(grandTotalRow.getCell(5));
    let grandProv = getDirectCellValue(grandTotalRow.getCell(6));

    if (!grandAppr || grandAppr === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].loansApproved.toString());
        grandAppr = String(sum);
    }
    if (!grandOut || grandOut === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].loansOutstanding.toString());
        grandOut = String(sum);
    }
    if (!grandCol || grandCol === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].collateralValue.toString());
        grandCol = String(sum);
    }
    if (!grandProv || grandProv === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].provisionHeld.toString());
        grandProv = String(sum);
    }

    returnItemsMap["10_00003"] = grandAppr; // Grand total Loans Approved
    returnItemsMap["10_00006"] = grandOut;  // Grand total Loans Outstanding
    returnItemsMap["10_00007"] = grandCol;  // Grand total Collateral value
    returnItemsMap["10_00008"] = grandProv; // Grand total Provision held

    return TN001Format(
        "TOP_20_NPLs_TN001",
        instCode,
        finYear,
        startDate,
        endDate,
        returnItemsMap,
        dynamicRows
    );
}

export async function jsonToExcelTN001(jsonPayload: any, outputPath?: string): Promise<Buffer> {
    const templatePath = path.join(process.cwd(), "templates", "TN001.xlsx");
    let workbook = new ExcelJS.Workbook();

    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        const ws = workbook.addWorksheet("TOP_20_NPLs_TN001");
        ws.views = [{ showGridLines: true }];
    }

    let worksheet = workbook.getWorksheet("TOP_20_NPLs_TN001") || workbook.worksheets[0];
    if (!worksheet) {
        worksheet = workbook.addWorksheet("TOP_20_NPLs_TN001");
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

    // Extract dynamic items
    const dynamicRows: any[] = [];
    if (Array.isArray(jsonPayload.DynamicItemsList) && jsonPayload.DynamicItemsList.length > 0) {
        jsonPayload.DynamicItemsList.forEach((areaObj: any) => {
            if (Array.isArray(areaObj.DynamicItems)) {
                const rowObj: any = {};
                areaObj.DynamicItems.forEach((item: any) => {
                    if (item && item.Code) {
                        const parts = item.Code.split(".");
                        const fieldIndex = parts[parts.length - 1];
                        rowObj[fieldIndex] = item.Value;
                    }
                });
                dynamicRows.push(rowObj);
            }
        });
    }

    const returnItemsMap: Record<string, string> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach((it: any) => {
            if (it && it.Code) returnItemsMap[it.Code] = it.Value;
        });
    }

    const startRow = 16;

    // Populate rows 1 to 10
    for (let i = 1; i <= 10; i++) {
        const rowNum = startRow + (i - 1);
        const row = worksheet.getRow(rowNum);
        const dyn = dynamicRows[i - 1] || {};

        row.getCell(1).value = i;
        row.getCell(2).value = dyn["2"] || "";
        row.getCell(3).value = dyn["3"] ? parseFloat(dyn["3"]) || 0 : 0;
        row.getCell(4).value = dyn["4"] ? parseFloat(dyn["4"]) || 0 : 0;
        row.getCell(5).value = dyn["5"] ? parseFloat(dyn["5"]) || 0 : 0;
        row.getCell(6).value = dyn["6"] ? parseFloat(dyn["6"]) || 0 : 0;
        row.getCell(7).value = dyn["7"] || "";
    }

    // Populate Sub total (row 26)
    const subTotRow = worksheet.getRow(26);
    subTotRow.getCell(3).value = returnItemsMap["10_00005"] ? parseFloat(returnItemsMap["10_00005"]) || 0 : { formula: "SUM(C16:C25)", result: 0 };
    subTotRow.getCell(4).value = returnItemsMap["10_00001"] ? parseFloat(returnItemsMap["10_00001"]) || 0 : { formula: "SUM(D16:D25)", result: 0 };
    subTotRow.getCell(5).value = returnItemsMap["10_00004"] ? parseFloat(returnItemsMap["10_00004"]) || 0 : { formula: "SUM(E16:E25)", result: 0 };
    subTotRow.getCell(6).value = returnItemsMap["10_00002"] ? parseFloat(returnItemsMap["10_00002"]) || 0 : { formula: "SUM(F16:F25)", result: 0 };

    // Populate rows 11 to 20 (rows 27 to 36)
    for (let i = 11; i <= 20; i++) {
        const rowNum = 16 + i; // 27 to 36
        const row = worksheet.getRow(rowNum);
        const dyn = dynamicRows[i - 1] || {};

        row.getCell(1).value = i;
        row.getCell(2).value = dyn["2"] || "";
        row.getCell(3).value = dyn["3"] ? parseFloat(dyn["3"]) || 0 : 0;
        row.getCell(4).value = dyn["4"] ? parseFloat(dyn["4"]) || 0 : 0;
        row.getCell(5).value = dyn["5"] ? parseFloat(dyn["5"]) || 0 : 0;
        row.getCell(6).value = dyn["6"] ? parseFloat(dyn["6"]) || 0 : 0;
        row.getCell(7).value = dyn["7"] || "";
    }

    // Populate Grand total (row 37)
    const grandTotRow = worksheet.getRow(37);
    grandTotRow.getCell(3).value = returnItemsMap["10_00003"] ? parseFloat(returnItemsMap["10_00003"]) || 0 : { formula: "SUM(C16:C25,C27:C36)", result: 0 };
    grandTotRow.getCell(4).value = returnItemsMap["10_00006"] ? parseFloat(returnItemsMap["10_00006"]) || 0 : { formula: "SUM(D16:D25,D27:D36)", result: 0 };
    grandTotRow.getCell(5).value = returnItemsMap["10_00007"] ? parseFloat(returnItemsMap["10_00007"]) || 0 : { formula: "SUM(E16:E25,E27:E36)", result: 0 };
    grandTotRow.getCell(6).value = returnItemsMap["10_00008"] ? parseFloat(returnItemsMap["10_00008"]) || 0 : { formula: "SUM(F16:F25,F27:F36)", result: 0 };

    if (outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await workbook.xlsx.writeFile(outputPath);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}

export async function processTN001Report(
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
            workbook.getWorksheet("TOP_20_NPLs_TN001") ||
            workbook.getWorksheet("Top Twenty (20) NPLs") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "No valid worksheet found in input template."
            };
        }

        const jsonData = processTN001(worksheet, {
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
        await jsonToExcelTN001(jsonData, excelPath);

        return {
            success: true,
            jsonData,
            jsonPath,
            excelPath
        };
    } catch (err: any) {
        console.error("Error processing TN001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process TN001 report."
        };
    }
}
