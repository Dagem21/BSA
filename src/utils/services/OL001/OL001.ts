import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { OL001Format, OL001RowData, OL001SummaryTotals } from "./jsonFormat";

export async function processOL001Report(
    instCode: string = "0000001",
    uploadedExcelPath: string,
    startDate: Date | string,
    endDate: Date | string,
    outputPathExcel: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const sDate = startDate instanceof Date ? startDate : new Date(startDate);
        const eDate = endDate instanceof Date ? endDate : new Date(endDate);
        const validSDate = isNaN(sDate.getTime()) ? new Date() : sDate;
        const validEDate = isNaN(eDate.getTime()) ? new Date() : eDate;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(uploadedExcelPath);

        const worksheet =
            workbook.getWorksheet("NBE") ||
            workbook.getWorksheet("Sheet1") ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        // Validate template identity
        const cellA1 = worksheet.getCell("A1").value?.toString().trim().toUpperCase() || "";
        const cellA4 = worksheet.getCell("A4").value?.toString().trim().toLowerCase() || "";
        const cellB14 = worksheet.getCell("B14").value?.toString().trim().toLowerCase() || "";
        const cellB15 = worksheet.getCell("B15").value?.toString().trim().toLowerCase() || "";

        const isOL001 =
            cellA1.includes("COL_ACQ_18M_OL001") ||
            cellA1.includes("OL001") ||
            cellA4.includes("collateralized properties") ||
            cellB14.includes("name of borrower") ||
            cellB15.includes("name of borrower");

        if (!isOL001) {
            return {
                success: false,
                error: "This is not the exact OL001 Excel template file."
            };
        }

        const getNum = (cellVal: any): number => {
            if (cellVal === null || cellVal === undefined) return 0;
            if (typeof cellVal === "number") return cellVal;
            if (typeof cellVal === "object" && "result" in cellVal && typeof cellVal.result === "number") {
                return cellVal.result;
            }
            const parsed = parseFloat(cellVal.toString().replace(/,/g, ""));
            return isNaN(parsed) ? 0 : parsed;
        };

        const getStr = (cellVal: any): string => {
            if (cellVal === null || cellVal === undefined) return "";
            if (typeof cellVal === "object" && cellVal) {
                if ("result" in cellVal && cellVal.result !== undefined) {
                    return cellVal.result.toString().trim();
                }
                if ("richText" in cellVal && Array.isArray(cellVal.richText)) {
                    return cellVal.richText.map((t: any) => t.text).join("").trim();
                }
            }
            return cellVal.toString().trim();
        };

        const getDateStr = (cellVal: any): string => {
            if (cellVal === null || cellVal === undefined) return "";
            if (cellVal instanceof Date) {
                return cellVal.toISOString().split("T")[0];
            }
            return getStr(cellVal);
        };

        const borrowerRows: OL001RowData[] = [];
        let accumulatedPrincipal = 0;
        let accumulatedInterest = 0;
        let accumulatedAskedReservePrice = 0;
        let accumulatedHighestOfferedBid = 0;
        let accumulatedAverageMarketValue = 0;
        let accumulatedExpensesAcquisition = 0;
        let accumulatedNetMarketValue = 0;

        // Iterate data rows starting at row 16 up to 165
        for (let rowNum = 16; rowNum <= 165; rowNum++) {
            const row = worksheet.getRow(rowNum);
            const borrowerName = getStr(row.getCell(2).value);

            if (borrowerName.toLowerCase() === "total") break;
            if (!borrowerName) continue;

            const principal = getNum(row.getCell(3).value);
            const interest = getNum(row.getCell(4).value);
            const collateralType = getStr(row.getCell(5).value);
            const askedReservePrice = getNum(row.getCell(6).value);
            const highestOfferedBid = getNum(row.getCell(7).value);
            const averageMarketValue = getNum(row.getCell(8).value);
            const dateAcquired = getDateStr(row.getCell(9).value);
            const dateReevaluated = getDateStr(row.getCell(10).value);
            const expensesAcquisition = getNum(row.getCell(11).value);
            const netMarketValue = getNum(row.getCell(12).value);

            accumulatedPrincipal += principal;
            accumulatedInterest += interest;
            accumulatedAskedReservePrice += askedReservePrice;
            accumulatedHighestOfferedBid += highestOfferedBid;
            accumulatedAverageMarketValue += averageMarketValue;
            accumulatedExpensesAcquisition += expensesAcquisition;
            accumulatedNetMarketValue += netMarketValue;

            borrowerRows.push({
                borrowerName,
                principal,
                interest,
                collateralType,
                askedReservePrice,
                highestOfferedBid,
                averageMarketValue,
                dateAcquired,
                dateReevaluated,
                expensesAcquisition,
                netMarketValue
            });
        }

        // Totals row (Row 166 or accumulated totals)
        const totalsRow = worksheet.getRow(166);
        const principalTotal = getNum(totalsRow.getCell(3).value) || accumulatedPrincipal;
        const interestTotal = getNum(totalsRow.getCell(4).value) || accumulatedInterest;
        const askedReservePriceTotal = getNum(totalsRow.getCell(6).value) || accumulatedAskedReservePrice;
        const highestOfferedBidTotal = getNum(totalsRow.getCell(7).value) || accumulatedHighestOfferedBid;
        const averageMarketValueTotal = getNum(totalsRow.getCell(8).value) || accumulatedAverageMarketValue;
        const expensesAcquisitionTotal = getNum(totalsRow.getCell(11).value) || accumulatedExpensesAcquisition;
        const netMarketValueTotal = getNum(totalsRow.getCell(12).value) || accumulatedNetMarketValue;

        const summaryTotals: OL001SummaryTotals = {
            principalTotal,
            interestTotal,
            askedReservePriceTotal,
            highestOfferedBidTotal,
            averageMarketValueTotal,
            expensesAcquisitionTotal,
            netMarketValueTotal
        };

        const formatIsoString = (dateInput: Date | string): string => {
            if (typeof dateInput === "string" && dateInput.includes("T")) {
                return dateInput.split(".")[0];
            }
            const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
            if (isNaN(d.getTime())) return new Date().toISOString().split(".")[0];
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            const seconds = String(d.getSeconds()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const finYear = validSDate.getFullYear();
        const formattedStartDate = formatIsoString(startDate);
        const formattedEndDate = formatIsoString(endDate);

        // Format JSON payload
        const jsonPayload = OL001Format(
            "COL_ACQ_18M_OL001",
            instCode,
            finYear,
            formattedStartDate,
            formattedEndDate,
            summaryTotals,
            borrowerRows
        );

        // Ensure JSON output directory exists and save JSON
        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputPathJson, JSON.stringify(jsonPayload, null, 4), "utf8");

        return { success: true };
    } catch (err: any) {
        console.error("Error processing OL001 report:", err);
        return { success: false, error: err.message || "Failed to process OL001 report." };
    }
}
