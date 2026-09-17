import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { LP001Format, LP001_ITEM_DEFINITIONS } from "./jsonFormat";

export interface ProcessLP001Options {
    instCode?: string;
    uploadedExcelPath: string;
    startDate?: Date | string;
    endDate?: Date | string;
    outputPathJson: string;
}

export async function processLP001Report(
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

        const getCellValueAsString = (cellVal: any): string => {
            if (cellVal === null || cellVal === undefined) return "";
            if (typeof cellVal === "number") return cellVal.toString();
            if (typeof cellVal === "string") return cellVal.trim();
            if (typeof cellVal === "object") {
                if (
                    "result" in cellVal &&
                    cellVal.result !== null &&
                    cellVal.result !== undefined
                ) {
                    return cellVal.result.toString().trim();
                }
                if ("text" in cellVal && cellVal.text) {
                    return cellVal.text.toString().trim();
                }
            }
            return cellVal.toString().trim();
        };

        const formatDateNoShift = (
            val: Date | string | undefined | null,
            fallback: string
        ): string => {
            if (!val) return fallback;
            if (typeof val === "string") {
                const trimmed = val.trim();
                if (trimmed.includes("T")) return trimmed.split(".")[0];
                if (trimmed.length >= 10)
                    return `${trimmed.substring(0, 10)}T00:00:00`;
                return fallback;
            }
            if (val instanceof Date && !isNaN(val.getTime())) {
                const pad = (n: number) => n.toString().padStart(2, "0");
                return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(val.getSeconds())}`;
            }
            return fallback;
        };

        // Extract header values
        const parsedInstCode =
            getCellValueAsString(worksheet.getCell("C4").value) ||
            getCellValueAsString(worksheet.getCell("B4").value) ||
            instCode;

        const finYearStr = getCellValueAsString(worksheet.getCell("C5").value);
        const sDateStr = getCellValueAsString(worksheet.getCell("C6").value);
        const eDateStr = getCellValueAsString(worksheet.getCell("C7").value);

        const formattedStartDate = formatDateNoShift(
            startDate || sDateStr,
            "2026-04-01T00:00:00"
        );
        const formattedEndDate = formatDateNoShift(
            endDate || eDateStr,
            "2026-06-30T00:00:00"
        );

        const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

        // Item values map: item code -> value
        const itemValuesMap: Record<string, string> = {};

        // Data grid mapping: 34 loan category rows (Row 16 to Row 49), 9 columns (Cols C=3 to K=11)
        let itemIndex = 0;
        const startRow = 16;
        const endRow = 49;
        const startCol = 3; // Column C
        const endCol = 11; // Column K

        for (let r = startRow; r <= endRow; r++) {
            const row = worksheet.getRow(r);
            for (let c = startCol; c <= endCol; c++) {
                if (itemIndex < LP001_ITEM_DEFINITIONS.length - 1) {
                    const code = LP001_ITEM_DEFINITIONS[itemIndex].code;
                    const val = getCellValueAsString(row.getCell(c).value);
                    itemValuesMap[code] = val;
                    itemIndex++;
                }
            }
        }

        // Summary item 21_00307 (Row 50, Column J / Col 10 or Col 9)
        const summaryCellVal =
            getCellValueAsString(worksheet.getCell("J50").value) ||
            getCellValueAsString(worksheet.getCell("I50").value) ||
            getCellValueAsString(worksheet.getCell("H50").value);

        itemValuesMap["21_00307"] = summaryCellVal;

        // Generate JSON payload
        const jsonPayload = LP001Format(
            "LOAN_CLA&PROV_LP001",
            parsedInstCode,
            finYear,
            formattedStartDate,
            formattedEndDate,
            itemValuesMap
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
        console.error("Error processing LP001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process LP001 report."
        };
    }
}
