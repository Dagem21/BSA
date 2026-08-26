import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { NN001Format, NN001RowData, NN001SummaryTotals } from "./jsonFormat";
import { createNN001Record } from "@/dal/sql/nn001";

export async function processNN001Report(
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
            workbook.getWorksheet("NBE") || workbook.worksheets[0];
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

        const isNN001 =
            cellA1.includes("NACNN001") ||
            cellA1.includes("NN001") ||
            cellA4.includes("non-accrual") ||
            cellB14.includes("counterparty");

        if (!isNN001) {
            return {
                success: false,
                error: "This is not the exact NN001 Excel template file."
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
            if (typeof cellVal === "object" && "result" in cellVal && cellVal.result) {
                return cellVal.result.toString().trim();
            }
            return cellVal.toString().trim();
        };

        const borrowerRows: NN001RowData[] = [];
        let totalLoanAmount = 0;
        let totalCollateralValue = 0;
        let totalPctCapital = 0;

        // Iterate data rows starting at row 16 up to 165
        for (let rowNum = 16; rowNum <= 165; rowNum++) {
            const row = worksheet.getRow(rowNum);
            const counterpartyName = getStr(row.getCell(2).value);
            
            // If row contains "Total" label or is empty, stop or skip
            if (counterpartyName.toLowerCase() === "total") break;
            if (!counterpartyName) continue;

            const loanType = getStr(row.getCell(3).value);
            const sector = getStr(row.getCell(4).value);
            const loanAmount = getNum(row.getCell(5).value);
            const recategorizationDate = getStr(row.getCell(6).value);
            const status = getStr(row.getCell(7).value);
            const collateralType = getStr(row.getCell(8).value);
            const collateralValue = getNum(row.getCell(9).value);
            const pctCapital = getNum(row.getCell(10).value);

            totalLoanAmount += loanAmount;
            totalCollateralValue += collateralValue;
            totalPctCapital += pctCapital;

            borrowerRows.push({
                counterpartyName,
                loanType,
                sector,
                loanAmount,
                recategorizationDate,
                status,
                collateralType,
                collateralValue,
                pctCapital
            });
        }

        // Totals row (Row 166 or accumulated totals)
        const totalsRow = worksheet.getRow(166);
        const rowLoanTotal = getNum(totalsRow.getCell(5).value) || getNum(totalsRow.getCell(3).value) || totalLoanAmount;
        const rowCollateralTotal = getNum(totalsRow.getCell(9).value) || totalCollateralValue;
        const rowPctCapitalTotal = getNum(totalsRow.getCell(10).value) || totalPctCapital;

        const summaryTotals: NN001SummaryTotals = {
            loansAdvanceAmount: rowLoanTotal,
            collateralValue: rowCollateralTotal,
            pctCapital: rowPctCapitalTotal
        };

        const finYear = validSDate.getFullYear();
        const formattedStartDate = validSDate.toISOString().split(".")[0]; // YYYY-MM-DDTHH:mm:ss
        const formattedEndDate = validEDate.toISOString().split(".")[0];

        // Format JSON payload
        const jsonPayload = NN001Format(
            "NACNN001",
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

        // Insert into MySQL via Prisma DAL
        await createNN001Record({
            RETURN_KEY: "NACNN001",
            INST_CODE: instCode,
            FIN_YEAR: finYear,
            START_DATE: validSDate,
            END_DATE: validEDate,
            LOANS_ADVANCE_AMOUNT: rowLoanTotal,
            COLLATERAL_VALUE: rowCollateralTotal,
            LOANS_ADVANCE_PCT_CAPITAL: rowPctCapitalTotal,
            RETURN_ITEMS: jsonPayload.ReturnItemsList,
            DYNAMIC_ITEMS: jsonPayload.DynamicItemsList,
            dynamicAreas: [
                {
                    AREA: 194,
                    AREA_NAME: "Non-Accrual to Accrual",
                    rows: borrowerRows.map((row, index) => ({
                        rowIndex: index + 1,
                        counterpartyName: row.counterpartyName,
                        loanType: row.loanType,
                        sector: row.sector,
                        loanAmount: typeof row.loanAmount === "number" ? row.loanAmount : parseFloat(row.loanAmount) || 0,
                        recategorizationDate: row.recategorizationDate,
                        status: row.status,
                        collateralType: row.collateralType,
                        collateralValue: typeof row.collateralValue === "number" ? row.collateralValue : parseFloat(row.collateralValue) || 0,
                        pctCapital: typeof row.pctCapital === "number" ? row.pctCapital : parseFloat(row.pctCapital) || 0
                    }))
                }
            ]
        });

        return { success: true };
    } catch (err: any) {
        console.error("Error processing NN001 report:", err);
        return { success: false, error: err.message || "Failed to process NN001 report." };
    }
}
