import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { LL001Format, LL001RowData, LL001SummaryTotals } from "./jsonFormat";

export async function processLL001Report(
    instCode: string = "0000001",
    uploadedExcelPath: string,
    startDate: string,
    endDate: string,
    outputExcelPath: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string; jsonPath?: string }> {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(uploadedExcelPath);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const formatCellVal = (cellVal: any): string => {
            if (cellVal === null || cellVal === undefined) return "";
            if (cellVal instanceof Date) {
                if (isNaN(cellVal.getTime())) return "";
                const pad = (n: number) => n.toString().padStart(2, "0");
                const yyyy = cellVal.getFullYear();
                const mm = pad(cellVal.getMonth() + 1);
                const dd = pad(cellVal.getDate());
                return `${yyyy}-${mm}-${dd}`;
            }
            if (typeof cellVal === "number") return cellVal.toString();
            if (typeof cellVal === "string") {
                const trimmed = cellVal.trim();
                if (
                    trimmed.includes("GMT") ||
                    trimmed.includes("Arabian Standard Time") ||
                    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)
                ) {
                    const d = new Date(trimmed);
                    if (!isNaN(d.getTime())) {
                        const pad = (n: number) =>
                            n.toString().padStart(2, "0");
                        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                    }
                }
                return trimmed;
            }
            if (typeof cellVal === "object") {
                if (
                    "result" in cellVal &&
                    cellVal.result !== null &&
                    cellVal.result !== undefined
                ) {
                    return formatCellVal(cellVal.result);
                }
                if ("text" in cellVal && cellVal.text) {
                    return formatCellVal(cellVal.text);
                }
            }
            return cellVal.toString().trim();
        };

        const getNum = (cellVal: any): number => {
            if (cellVal === null || cellVal === undefined) return 0;
            if (typeof cellVal === "number") return cellVal;
            if (
                typeof cellVal === "object" &&
                "result" in cellVal &&
                typeof cellVal.result === "number"
            ) {
                return cellVal.result;
            }
            const parsed = parseFloat(formatCellVal(cellVal).replace(/,/g, ""));
            return isNaN(parsed) ? 0 : parsed;
        };

        const formatDateNoShift = (
            val: Date | string | undefined | null
        ): string => {
            if (!val) return "";
            if (val instanceof Date) {
                if (isNaN(val.getTime())) return "";
                const pad = (n: number) => n.toString().padStart(2, "0");
                return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T00:00:00`;
            }
            if (typeof val === "string") {
                const trimmed = val.trim();
                if (
                    trimmed.includes("GMT") ||
                    trimmed.includes("Arabian Standard Time") ||
                    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)
                ) {
                    const d = new Date(trimmed);
                    if (!isNaN(d.getTime())) {
                        const pad = (n: number) =>
                            n.toString().padStart(2, "0");
                        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
                    }
                }
                if (trimmed.includes("T")) return trimmed.split(".")[0];
                if (trimmed.length >= 10)
                    return `${trimmed.substring(0, 10)}T00:00:00`;
                return "";
            }
            return "";
        };

        // Extract header values (Row 8 to 11)
        const parsedInstCode =
            formatCellVal(worksheet.getCell("C8").value) ||
            formatCellVal(worksheet.getCell("B8").value) ||
            instCode;

        const finYearStr = formatCellVal(worksheet.getCell("C9").value);
        const sDateRaw = worksheet.getCell("C10").value;
        const eDateRaw = worksheet.getCell("C11").value;

        const formattedStartDate = formatDateNoShift(
            startDate || sDateRaw?.toString()
        );
        const formattedEndDate = formatDateNoShift(
            endDate || eDateRaw?.toString()
        );
        const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

        const borrowerRows: LL001RowData[] = [];
        let calcPrincipal = 0;
        let calcInterest = 0;
        let calcSalesValue = 0;
        let calcDisposalExpenses = 0;
        let calcNetRealizedValue = 0;

        // Iterate data rows starting at Row 16 up to Row 165
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

            const numPrincipal = getNum(principalVal);
            const numInterest = getNum(interestVal);
            const numSalesValue = getNum(salesValueVal);
            const numDisposalExpenses = getNum(disposalExpensesVal);
            const numNetRealizedValue = getNum(netRealizedValueVal);

            calcPrincipal += numPrincipal;
            calcInterest += numInterest;
            calcSalesValue += numSalesValue;
            calcDisposalExpenses += numDisposalExpenses;
            calcNetRealizedValue += numNetRealizedValue;

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

        // Totals row (Row 166 or accumulated totals)
        const totalsRow = worksheet.getRow(166);
        const rowPrincipalTotal =
            formatCellVal(totalsRow.getCell(3).value) ||
            (calcPrincipal ? calcPrincipal.toString() : "");
        const rowInterestTotal =
            formatCellVal(totalsRow.getCell(4).value) ||
            (calcInterest ? calcInterest.toString() : "");
        const rowSalesValueTotal =
            formatCellVal(totalsRow.getCell(8).value) ||
            (calcSalesValue ? calcSalesValue.toString() : "");
        const rowDisposalExpensesTotal =
            formatCellVal(totalsRow.getCell(9).value) ||
            (calcDisposalExpenses ? calcDisposalExpenses.toString() : "");
        const rowNetRealizedValueTotal =
            formatCellVal(totalsRow.getCell(10).value) ||
            (calcNetRealizedValue ? calcNetRealizedValue.toString() : "");

        const summaryTotals: LL001SummaryTotals = {
            totalPrincipal: rowPrincipalTotal,
            totalInterest: rowInterestTotal,
            totalSalesValue: rowSalesValueTotal,
            totalDisposalExpenses: rowDisposalExpensesTotal,
            totalNetRealizedValue: rowNetRealizedValueTotal
        };

        // Format JSON payload
        const jsonPayload = LL001Format(
            "COL_SOL_18M_LL001",
            parsedInstCode,
            finYear,
            formattedStartDate,
            formattedEndDate,
            summaryTotals,
            borrowerRows
        );

        // Save JSON file
        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }

        fs.writeFileSync(
            outputPathJson,
            JSON.stringify(jsonPayload, null, 4),
            "utf8"
        );

        return {
            success: true,
            jsonPath: outputPathJson
        };
    } catch (err: any) {
        console.error("Error processing LL001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process LL001 report."
        };
    }
}
