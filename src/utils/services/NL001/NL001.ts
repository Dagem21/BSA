import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { NL001Format, NL001_ITEM_DEFINITIONS } from "./jsonFormat";

export async function processNL001Report(
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

        // Extract header values (Rows 8 to 11)
        const parsedInstCode =
            getCellValueAsString(worksheet.getCell("C8").value) ||
            getCellValueAsString(worksheet.getCell("B8").value) ||
            instCode;

        const finYearStr = getCellValueAsString(worksheet.getCell("C9").value);
        const sDateStr = getCellValueAsString(worksheet.getCell("C10").value);
        const eDateStr = getCellValueAsString(worksheet.getCell("C11").value);

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

        // Data grid mapping: Rows 15 to 36 (22 items), Column C (Col 3)
        const startRow = 15;
        const endRow = 36;
        const colNumber = 3; // Column C

        for (let r = startRow; r <= endRow; r++) {
            const itemIndex = r - startRow;
            if (itemIndex < NL001_ITEM_DEFINITIONS.length) {
                const code = NL001_ITEM_DEFINITIONS[itemIndex].code;
                const cellVal = worksheet.getRow(r).getCell(colNumber).value;
                itemValuesMap[code] = getCellValueAsString(cellVal);
            }
        }

        // Generate JSON payload
        const jsonPayload = NL001Format(
            "NPL&PRO_NL001",
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
        console.error("Error processing NL001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process NL001 report."
        };
    }
}
