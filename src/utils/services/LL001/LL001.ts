// @ts-nocheck

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

import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

export function processLL001(worksheet, instCode, startDate, endDate) {
    const formatCellVal = (cellVal: any): string => getDirectCellValue(cellVal);

    const getNum = (cellVal) => {
        if (cellVal === null || cellVal === undefined) return 0;
        if (typeof cellVal === "number") return cellVal;
        if (typeof cellVal === "object" && "result" in cellVal && typeof cellVal.result === "number") {
            return cellVal.result;
        }
        const parsed = parseFloat(formatCellVal(cellVal).replace(/,/g, ""));
        return isNaN(parsed) ? 0 : parsed;
    };

    const formatDateNoShift = (val, fallback) => {
        if (!val) return fallback;
        if (val instanceof Date) {
            if (isNaN(val.getTime())) return fallback;
            const pad = (n) => n.toString().padStart(2, "0");
            return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T00:00:00`;
        }
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
                }
            }
            if (trimmed.includes("T")) return trimmed.split(".")[0];
            if (trimmed.length >= 10) return `${trimmed.substring(0, 10)}T00:00:00`;
            return fallback;
        }
        return fallback;
    };

    const parsedInstCode = formatCellVal(worksheet.getCell("C8").value) || formatCellVal(worksheet.getCell("B8").value) || instCode || "0000001";
    const finYearStr = formatCellVal(worksheet.getCell("C9").value);
    const sDateRaw = worksheet.getCell("C10").value;
    const eDateRaw = worksheet.getCell("C11").value;

    const formattedStartDate = formatDateNoShift(startDate || sDateRaw, "2026-04-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || eDateRaw, "2026-06-30T00:00:00");
    const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

    const borrowerRows = [];
    let calcPrincipal = 0;
    let calcInterest = 0;
    let calcSalesValue = 0;
    let calcDisposalExpenses = 0;
    let calcNetRealizedValue = 0;

    for (let rowNum = 16; rowNum <= 165; rowNum++) {
        const row = worksheet.getRow(rowNum);
        const borrowerName = formatCellVal(row.getCell(2).value);

        if (borrowerName.toLowerCase() === "total") break;
        if (!borrowerName) continue;

        const principalVal = row.getCell(3).value;
        const interestVal = row.getCell(4).value;
        const propertyType = formatCellVal(row.getCell(5).value);
        const estimatedValueVal = row.getCell(6).value;
        const dateSold = formatCellVal(row.getCell(7).value);
        const salesValueVal = row.getCell(8).value;
        const disposalExpensesVal = row.getCell(9).value;
        const netRealizedValueVal = row.getCell(10).value;

        calcPrincipal += getNum(principalVal);
        calcInterest += getNum(interestVal);
        calcSalesValue += getNum(salesValueVal);
        calcDisposalExpenses += getNum(disposalExpensesVal);
        calcNetRealizedValue += getNum(netRealizedValueVal);

        borrowerRows.push({
            borrowerName,
            principal: formatCellVal(principalVal),
            interest: formatCellVal(interestVal),
            propertyType,
            estimatedValue: formatCellVal(estimatedValueVal),
            dateSold,
            salesValue: formatCellVal(salesValueVal),
            disposalExpenses: formatCellVal(disposalExpensesVal),
            netRealizedValue: formatCellVal(netRealizedValueVal)
        });
    }

    const totalsRow = worksheet.getRow(166);
    const rowPrincipalTotal = formatCellVal(totalsRow.getCell(3).value) || (calcPrincipal ? calcPrincipal.toString() : "");
    const rowInterestTotal = formatCellVal(totalsRow.getCell(4).value) || (calcInterest ? calcInterest.toString() : "");
    const rowSalesValueTotal = formatCellVal(totalsRow.getCell(8).value) || (calcSalesValue ? calcSalesValue.toString() : "");
    const rowDisposalExpensesTotal = formatCellVal(totalsRow.getCell(9).value) || (calcDisposalExpenses ? calcDisposalExpenses.toString() : "");
    const rowNetRealizedValueTotal = formatCellVal(totalsRow.getCell(10).value) || (calcNetRealizedValue ? calcNetRealizedValue.toString() : "");

    const returnItemsList = [
        { Code: "94_00001", Value: rowInterestTotal, _description: "Total Outstanding balance_Interest", _dataType: "NUMERIC", _required: false },
        { Code: "94_00002", Value: rowSalesValueTotal, _description: "Total Collateral_Sales value", _dataType: "NUMERIC", _required: false },
        { Code: "94_00003", Value: rowDisposalExpensesTotal, _description: "Total Collateral_Expenses related to Disposal", _dataType: "NUMERIC", _required: false },
        { Code: "94_00004", Value: rowNetRealizedValueTotal, _description: "Total Collateral_Net realized value", _dataType: "NUMERIC", _required: false },
        { Code: "94_00005", Value: rowPrincipalTotal, _description: "Total Outstanding foreclosed balance_Principal", _dataType: "NUMERIC", _required: false }
    ];

    const dynamicItemsList = borrowerRows.map((row) => ({
        Area: 187,
        _areaName: "Foreclosed Properties",
        DynamicItems: [
            { Code: "1.1", Value: row.borrowerName, _description: "Name of Borrower", _dataType: "TEXT", _required: true },
            { Code: "1.2", Value: row.principal, _description: "Outstanding Balance[A] Principal", _dataType: "NUMERIC", _required: false },
            { Code: "1.3", Value: row.interest, _description: "Outstanding Balance[A] Interest", _dataType: "NUMERIC", _required: false },
            { Code: "1.4", Value: row.propertyType, _description: "Type of property/collateral [B]", _dataType: "TEXT", _required: false },
            { Code: "1.5", Value: row.estimatedValue, _description: "Estimated Value at the time of loan extension [C]", _dataType: "NUMERIC", _required: false },
            { Code: "1.6", Value: row.dateSold, _description: "Date of foreclosure & sold[D]", _dataType: "TEXT", _required: false },
            { Code: "1.7", Value: row.salesValue, _description: "Sales value[E]", _dataType: "NUMERIC", _required: false },
            { Code: "1.8", Value: row.disposalExpenses, _description: "Expenses related to Disposal*[F]", _dataType: "NUMERIC", _required: false },
            { Code: "1.9", Value: row.netRealizedValue, _description: "Net realized value [G=E-F]", _dataType: "NUMERIC", _required: false }
        ]
    }));

    return {
        ReturnKey: "COL_SOL_18M_LL001",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: dynamicItemsList
    };
}

export async function jsonToExcelLL001(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Foreclosed Sold Properties");

    // Title Merged Banner A4:J6
    sheet.mergeCells("A4:J6");
    const titleCell = sheet.getCell("A4");
    titleCell.value = "Collateralized Properties Foreclosed and Sold during the last 18 Consecutive Months";
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFF0000" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2DCDB" } };

    // Metadata Header Block (Rows 8 to 11)
    sheet.getCell("A8").value = "Instituion code";
    sheet.getCell("C8").value = jsonPayload.InstCode || "0000001";

    sheet.getCell("A9").value = "Financial Year";
    sheet.getCell("C9").value = jsonPayload.FinYear || 2026;

    const cleanDate = (isoStr) => isoStr ? isoStr.split("T")[0] : "";

    sheet.getCell("A10").value = "Start Date";
    sheet.getCell("C10").value = cleanDate(jsonPayload.StartDate) || "2026-04-01";

    sheet.getCell("A11").value = "End Date";
    sheet.getCell("C11").value = cleanDate(jsonPayload.EndDate) || "2026-06-30";

    // Table Header Banner Row 13
    sheet.mergeCells("A13:J13");
    const banner13 = sheet.getCell("A13");
    banner13.value = "Amount in Millions of Birr";
    banner13.alignment = { horizontal: "right" };
    banner13.font = { bold: true };
    banner13.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } };

    // Table Headers (Row 14 & 15)
    sheet.getCell("A14").value = "S.No.";
    sheet.getCell("B14").value = "Name of Borrower";
    sheet.getCell("C14").value = "Outstanding balance[A] Principal";
    sheet.getCell("D14").value = "Outstanding balance[A] Interest";
    sheet.getCell("E14").value = "Type of property/collateral [B]";
    sheet.getCell("F14").value = "Estimated Value at the time of loan extension [C]";
    sheet.getCell("G14").value = "Date Sold [D]";
    sheet.getCell("H14").value = "Sales value[E]";
    sheet.getCell("I14").value = "Expenses related to Disposal*[F]";
    sheet.getCell("J14").value = "Net realized value [G=E-F]";
    sheet.getRow(14).font = { bold: true };

    const parseNum = (v) => (v !== "" && v !== undefined && !isNaN(parseFloat(v))) ? parseFloat(v) : (v || "");

    // Track dynamic sum for Estimated Value (Col F)
    let sumEstVal = 0;

    // DynamicItemsList (Area 187)
    if (jsonPayload.DynamicItemsList && Array.isArray(jsonPayload.DynamicItemsList)) {
        jsonPayload.DynamicItemsList.forEach((group, idx) => {
            const r = 16 + idx;
            const row = sheet.getRow(r);
            row.getCell(1).value = idx + 1; // S.No in Col A

            if (group.DynamicItems && Array.isArray(group.DynamicItems)) {
                group.DynamicItems.forEach(item => {
                    if (item.Code === "1.1") row.getCell(2).value = item.Value || ""; // Borrower Name Col B
                    if (item.Code === "1.2") row.getCell(3).value = parseNum(item.Value); // Principal Col C
                    if (item.Code === "1.3") row.getCell(4).value = parseNum(item.Value); // Interest Col D
                    if (item.Code === "1.4") row.getCell(5).value = item.Value || ""; // Property Type Col E
                    if (item.Code === "1.5") {
                        const val = parseNum(item.Value);
                        row.getCell(6).value = val; // Est Value Col F
                        if (typeof val === "number") sumEstVal += val;
                    }
                    if (item.Code === "1.6") row.getCell(7).value = cleanDate(item.Value) || item.Value || ""; // Date Sold Col G
                    if (item.Code === "1.7") row.getCell(8).value = parseNum(item.Value); // Sales Value Col H
                    if (item.Code === "1.8") row.getCell(9).value = parseNum(item.Value); // Disposal Exp Col I
                    if (item.Code === "1.9") row.getCell(10).value = parseNum(item.Value); // Net Realized Col J
                });
            }
        });
    }

    // Totals Row (Row 166)
    const totalsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            totalsMap[item.Code] = item.Value;
        });
    }

    const totalsRow = sheet.getRow(166);
    totalsRow.getCell(2).value = "Total";
    totalsRow.getCell(3).value = parseNum(totalsMap["94_00005"]); // Principal Total
    totalsRow.getCell(4).value = parseNum(totalsMap["94_00001"]); // Interest Total
    totalsRow.getCell(6).value = sumEstVal ? parseFloat(sumEstVal.toFixed(2)) : ""; // Estimated Value Total
    totalsRow.getCell(8).value = parseNum(totalsMap["94_00002"]); // Sales Value Total
    totalsRow.getCell(9).value = parseNum(totalsMap["94_00003"]); // Disposal Expenses Total
    totalsRow.getCell(10).value = parseNum(totalsMap["94_00004"]); // Net Realized Value Total
    totalsRow.font = { bold: true };

    return workbook;
}




function sanitizeJsonPayload(payload: any): any {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => {
            if (!item) return item;
            let val = item.Value;
            if (val && typeof val === "object") {
                val = getDirectCellValue(val);
            }
            const strVal = (val === null || val === undefined) ? "" : String(val).trim();
            const isZero = strVal === "" || strVal === "[object Object]";
            return {
                ...item,
                Value: isZero ? "0" : strVal
            };
        });
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    let val = subItem.Value;
                    if (val && typeof val === "object") {
                        val = getDirectCellValue(val);
                    }
                    const strVal = (val === null || val === undefined) ? "" : String(val).trim();
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const isZero = strVal === "" || strVal === "[object Object]";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (isZero && !isNumeric ? "" : strVal)
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    let val = entry[k];
                    if (val && typeof val === "object") {
                        val = getDirectCellValue(val);
                    }
                    const strVal = (val === null || val === undefined) ? "" : String(val).trim();
                    if (strVal === "" || strVal === "[object Object]") {
                        entry[k] = "0";
                    } else {
                        entry[k] = strVal;
                    }
                });
            }
            return entry;
        });
    }
    return payload;
}



export async function processLL001Report(
    instCode: string = "0000001",
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string; jsonPath?: string; excelPath?: string }> {
    try {
        if (!inputFilePath || !fs.existsSync(inputFilePath)) {
            return {
                success: false,
                error: "Input file '${inputFilePath}' not found."
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const rawJson = processLL001(worksheet, instCode, startDateStr, endDateStr);
        const jsonPayload = sanitizeJsonPayload(rawJson);

        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputPathJson, JSON.stringify(jsonPayload, null, 4), "utf8");

        if (outputExcelPath) {
            const excelDir = path.dirname(outputExcelPath);
            if (!fs.existsSync(excelDir)) {
                fs.mkdirSync(excelDir, { recursive: true });
            }
            const outWorkbook = await jsonToExcelLL001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing LL001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process LL001 report."
        };
    }
}


