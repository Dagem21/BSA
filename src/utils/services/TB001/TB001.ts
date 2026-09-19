import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { TB001Format, TB001RowData } from "./jsonFormat";

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

export function processTB001(
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

    // Locate data start row: Borrower 1 (Row 18)
    let startRow = 18;
    for (let r = 14; r <= 22; r++) {
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

    const dynamicRows: TB001RowData[] = [];
    const returnItemsMap: Record<string, string> = {};

    // 1. Process top 10 borrowers (rows 18 to 27)
    for (let i = 1; i <= 10; i++) {
        const rowNum = startRow + (i - 1);
        const row = worksheet.getRow(rowNum);

        const sNo = getDirectCellValue(row.getCell(1)) || String(i);
        const nameOfBorrower = getDirectCellValue(row.getCell(2));
        const collateralValue = getDirectCellValue(row.getCell(3)) || "0";
        const banksCapital = getDirectCellValue(row.getCell(4)) || "0";
        const approvedLoan = getDirectCellValue(row.getCell(5)) || "0";
        const outstandingBalance = getDirectCellValue(row.getCell(6)) || "0";
        const offBalanceSheet = getDirectCellValue(row.getCell(7)) || "0";

        let totalOutstandingExposure = getDirectCellValue(row.getCell(8));
        if (!totalOutstandingExposure || totalOutstandingExposure === "0") {
            const computed = parseNum(outstandingBalance) + parseNum(offBalanceSheet);
            totalOutstandingExposure = String(computed);
        }

        let pctCapital = getDirectCellValue(row.getCell(9));
        if (!pctCapital || pctCapital.includes("#DIV") || pctCapital === "0") {
            const cap = parseNum(banksCapital);
            const exp = parseNum(totalOutstandingExposure);
            pctCapital = cap !== 0 ? String((exp / cap) * 100) : "0";
        }

        const status = getDirectCellValue(row.getCell(10));

        dynamicRows.push({
            sNo,
            nameOfBorrower,
            collateralValue,
            banksCapital,
            approvedLoan,
            outstandingBalance,
            offBalanceSheet,
            totalOutstandingExposure,
            pctCapital,
            status
        });

        // Populate ReturnItems
        if (i === 1) returnItemsMap["14_00001"] = nameOfBorrower;
        else if (i === 2) returnItemsMap["14_00088"] = nameOfBorrower;
        else {
            const codeStr = `14_${(i - 1).toString().padStart(5, "0")}`;
            returnItemsMap[codeStr] = nameOfBorrower;
        }

        returnItemsMap[`14_${(27 + i).toString().padStart(5, "0")}`] = outstandingBalance;
        returnItemsMap[`14_${(47 + i).toString().padStart(5, "0")}`] = offBalanceSheet;
        returnItemsMap[`14_${(67 + i).toString().padStart(5, "0")}`] = totalOutstandingExposure;
    }

    // 2. Process Sub total top ten(10) borrowers (row 28)
    const subTotalRowNum = startRow + 10;
    const subTotalRow = worksheet.getRow(subTotalRowNum);
    let subAppr = getDirectCellValue(subTotalRow.getCell(5));
    let subOut = getDirectCellValue(subTotalRow.getCell(6));
    let subOff = getDirectCellValue(subTotalRow.getCell(7));
    let subTot = getDirectCellValue(subTotalRow.getCell(8));

    if (!subAppr || subAppr === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].approvedLoan.toString());
        subAppr = String(sum);
    }
    if (!subOut || subOut === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].outstandingBalance.toString());
        subOut = String(sum);
    }
    if (!subOff || subOff === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].offBalanceSheet.toString());
        subOff = String(sum);
    }
    if (!subTot || subTot === "0") {
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += parseNum(dynamicRows[i].totalOutstandingExposure.toString());
        subTot = String(sum);
    }

    returnItemsMap["14_00020"] = subAppr;
    returnItemsMap["14_00021"] = subOut;
    returnItemsMap["14_00022"] = subOff;
    returnItemsMap["14_00023"] = subTot;

    // 3. Process borrowers 11 to 20 (rows 29 to 38)
    for (let i = 11; i <= 20; i++) {
        const rowNum = subTotalRowNum + (i - 10);
        const row = worksheet.getRow(rowNum);

        const sNo = getDirectCellValue(row.getCell(1)) || String(i);
        const nameOfBorrower = getDirectCellValue(row.getCell(2));
        const collateralValue = getDirectCellValue(row.getCell(3)) || "0";
        const banksCapital = getDirectCellValue(row.getCell(4)) || "0";
        const approvedLoan = getDirectCellValue(row.getCell(5)) || "0";
        const outstandingBalance = getDirectCellValue(row.getCell(6)) || "0";
        const offBalanceSheet = getDirectCellValue(row.getCell(7)) || "0";

        let totalOutstandingExposure = getDirectCellValue(row.getCell(8));
        if (!totalOutstandingExposure || totalOutstandingExposure === "0") {
            const computed = parseNum(outstandingBalance) + parseNum(offBalanceSheet);
            totalOutstandingExposure = String(computed);
        }

        let pctCapital = getDirectCellValue(row.getCell(9));
        if (!pctCapital || pctCapital.includes("#DIV") || pctCapital === "0") {
            const cap = parseNum(banksCapital);
            const exp = parseNum(totalOutstandingExposure);
            pctCapital = cap !== 0 ? String((exp / cap) * 100) : "0";
        }

        const status = getDirectCellValue(row.getCell(10));

        dynamicRows.push({
            sNo,
            nameOfBorrower,
            collateralValue,
            banksCapital,
            approvedLoan,
            outstandingBalance,
            offBalanceSheet,
            totalOutstandingExposure,
            pctCapital,
            status
        });

        const codeStr = `14_${(i - 1).toString().padStart(5, "0")}`;
        returnItemsMap[codeStr] = nameOfBorrower;

        returnItemsMap[`14_${(27 + i).toString().padStart(5, "0")}`] = outstandingBalance;
        returnItemsMap[`14_${(47 + i).toString().padStart(5, "0")}`] = offBalanceSheet;
        returnItemsMap[`14_${(67 + i).toString().padStart(5, "0")}`] = totalOutstandingExposure;
    }

    // 4. Process Grand total top twenty (20) borrowers (row 39)
    const grandTotalRowNum = subTotalRowNum + 11;
    const grandTotalRow = worksheet.getRow(grandTotalRowNum);
    let grandAppr = getDirectCellValue(grandTotalRow.getCell(5));
    let grandOut = getDirectCellValue(grandTotalRow.getCell(6));
    let grandOff = getDirectCellValue(grandTotalRow.getCell(7));
    let grandTot = getDirectCellValue(grandTotalRow.getCell(8));

    if (!grandAppr || grandAppr === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].approvedLoan.toString());
        grandAppr = String(sum);
    }
    if (!grandOut || grandOut === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].outstandingBalance.toString());
        grandOut = String(sum);
    }
    if (!grandOff || grandOff === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].offBalanceSheet.toString());
        grandOff = String(sum);
    }
    if (!grandTot || grandTot === "0") {
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += parseNum(dynamicRows[i].totalOutstandingExposure.toString());
        grandTot = String(sum);
    }

    returnItemsMap["14_00024"] = grandAppr;
    returnItemsMap["14_00025"] = grandOut;
    returnItemsMap["14_00026"] = grandOff;
    returnItemsMap["14_00027"] = grandTot;

    return TB001Format(
        "TOP_20_BOR_TB001",
        instCode,
        finYear,
        startDate,
        endDate,
        returnItemsMap,
        dynamicRows
    );
}

export async function jsonToExcelTB001(jsonPayload: any, outputPath?: string): Promise<Buffer> {
    const templatePath = path.join(process.cwd(), "templates", "TB001.xlsx");
    let workbook = new ExcelJS.Workbook();

    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        const ws = workbook.addWorksheet("TOP_20_BOR_TB001");
        ws.views = [{ showGridLines: true }];
    }

    let worksheet = workbook.getWorksheet("TOP_20_BOR_TB001") || workbook.worksheets[0];
    if (!worksheet) {
        worksheet = workbook.addWorksheet("TOP_20_BOR_TB001");
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

    // Extract dynamic items or fallback to return items map
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

    const startRow = 18;

    // Populate rows 1 to 10
    for (let i = 1; i <= 10; i++) {
        const rowNum = startRow + (i - 1);
        const row = worksheet.getRow(rowNum);
        const dyn = dynamicRows[i - 1] || {};

        let borrowerName = dyn["2"];
        if (!borrowerName) {
            if (i === 1) borrowerName = returnItemsMap["14_00001"];
            else if (i === 2) borrowerName = returnItemsMap["14_00088"];
            else borrowerName = returnItemsMap[`14_${(i - 1).toString().padStart(5, "0")}`];
        }

        row.getCell(1).value = i;
        row.getCell(2).value = borrowerName || "";
        row.getCell(3).value = dyn["3"] ? parseFloat(dyn["3"]) || 0 : 0;
        row.getCell(4).value = dyn["4"] ? parseFloat(dyn["4"]) || 0 : 0;
        row.getCell(5).value = dyn["5"] ? parseFloat(dyn["5"]) || 0 : 0;

        const outVal = dyn["6"] || returnItemsMap[`14_${(27 + i).toString().padStart(5, "0")}`];
        row.getCell(6).value = outVal ? parseFloat(outVal) || 0 : 0;

        const offVal = dyn["7"] || returnItemsMap[`14_${(47 + i).toString().padStart(5, "0")}`];
        row.getCell(7).value = offVal ? parseFloat(offVal) || 0 : 0;

        const totVal = dyn["8"] || returnItemsMap[`14_${(67 + i).toString().padStart(5, "0")}`];
        row.getCell(8).value = totVal ? parseFloat(totVal) || 0 : { formula: `F${rowNum}+G${rowNum}`, result: 0 };

        const pctVal = dyn["9"];
        if (pctVal && pctVal !== "0") {
            row.getCell(9).value = parseFloat(pctVal) || 0;
        }

        row.getCell(10).value = dyn["10"] || "";
    }

    // Populate Sub total (row 28)
    const subTotRow = worksheet.getRow(28);
    subTotRow.getCell(5).value = returnItemsMap["14_00020"] ? parseFloat(returnItemsMap["14_00020"]) || 0 : { formula: "SUM(E18:E27)", result: 0 };
    subTotRow.getCell(6).value = returnItemsMap["14_00021"] ? parseFloat(returnItemsMap["14_00021"]) || 0 : { formula: "SUM(F18:F27)", result: 0 };
    subTotRow.getCell(7).value = returnItemsMap["14_00022"] ? parseFloat(returnItemsMap["14_00022"]) || 0 : { formula: "SUM(G18:G27)", result: 0 };
    subTotRow.getCell(8).value = returnItemsMap["14_00023"] ? parseFloat(returnItemsMap["14_00023"]) || 0 : { formula: "SUM(H18:H27)", result: 0 };

    // Populate rows 11 to 20 (rows 29 to 38)
    for (let i = 11; i <= 20; i++) {
        const rowNum = 18 + i; // 29 to 38
        const row = worksheet.getRow(rowNum);
        const dyn = dynamicRows[i - 1] || {};

        let borrowerName = dyn["2"] || returnItemsMap[`14_${(i - 1).toString().padStart(5, "0")}`];

        row.getCell(1).value = i;
        row.getCell(2).value = borrowerName || "";
        row.getCell(3).value = dyn["3"] ? parseFloat(dyn["3"]) || 0 : 0;
        row.getCell(4).value = dyn["4"] ? parseFloat(dyn["4"]) || 0 : 0;
        row.getCell(5).value = dyn["5"] ? parseFloat(dyn["5"]) || 0 : 0;

        const outVal = dyn["6"] || returnItemsMap[`14_${(27 + i).toString().padStart(5, "0")}`];
        row.getCell(6).value = outVal ? parseFloat(outVal) || 0 : 0;

        const offVal = dyn["7"] || returnItemsMap[`14_${(47 + i).toString().padStart(5, "0")}`];
        row.getCell(7).value = offVal ? parseFloat(offVal) || 0 : 0;

        const totVal = dyn["8"] || returnItemsMap[`14_${(67 + i).toString().padStart(5, "0")}`];
        row.getCell(8).value = totVal ? parseFloat(totVal) || 0 : { formula: `F${rowNum}+G${rowNum}`, result: 0 };

        const pctVal = dyn["9"];
        if (pctVal && pctVal !== "0") {
            row.getCell(9).value = parseFloat(pctVal) || 0;
        }

        row.getCell(10).value = dyn["10"] || "";
    }

    // Populate Grand total (row 39)
    const grandTotRow = worksheet.getRow(39);
    grandTotRow.getCell(5).value = returnItemsMap["14_00024"] ? parseFloat(returnItemsMap["14_00024"]) || 0 : { formula: "SUM(E18:E27,E29:E38)", result: 0 };
    grandTotRow.getCell(6).value = returnItemsMap["14_00025"] ? parseFloat(returnItemsMap["14_00025"]) || 0 : { formula: "SUM(F18:F27,F29:F38)", result: 0 };
    grandTotRow.getCell(7).value = returnItemsMap["14_00026"] ? parseFloat(returnItemsMap["14_00026"]) || 0 : { formula: "SUM(G18:G27,G29:G38)", result: 0 };
    grandTotRow.getCell(8).value = returnItemsMap["14_00027"] ? parseFloat(returnItemsMap["14_00027"]) || 0 : { formula: "SUM(H18:H27,H29:H38)", result: 0 };

    if (outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await workbook.xlsx.writeFile(outputPath);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}

export async function processTB001Report(
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
            workbook.getWorksheet("TOP_20_BOR_TB001") ||
            workbook.getWorksheet("Top Twenty (20) Borrowers") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "No valid worksheet found in input template."
            };
        }

        const jsonData = processTB001(worksheet, {
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
        await jsonToExcelTB001(jsonData, excelPath);

        return {
            success: true,
            jsonData,
            jsonPath,
            excelPath
        };
    } catch (err: any) {
        console.error("Error processing TB001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process TB001 report."
        };
    }
}
