import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { MA001Format } from "./jsonFormat";

function getDirectCellValue(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) return "";
    const val = cell.value;
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        return val.trim();
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && "error" in val.result) {
                return "";
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t) => t.text).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
    }
    if (cell.result !== undefined && cell.result !== null) {
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

export async function processMA001Report(
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

        const isMA001 =
            cellA1.includes("NBE_MAT_ANL_MA001") ||
            cellA1.includes("MA001") ||
            cellA4.includes("maturity of assets");

        if (!isMA001) {
            return {
                success: false,
                error: "This is not the exact MA001 Excel template file."
            };
        }

        const itemValues: Record<string, string> = {};
        let itemCodeNum = 1;

        // Iterate rows 16 to 43 and columns 3 (Amount) to 14 (Total)
        for (let r = 16; r <= 43; r++) {
            const row = worksheet.getRow(r);
            for (let c = 3; c <= 14; c++) {
                const codeStr = `20_${itemCodeNum.toString().padStart(5, "0")}`;
                const valStr = getDirectCellValue(row.getCell(c));
                itemValues[codeStr] = valStr;
                itemCodeNum++;
            }
        }

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

        // Format JSON payload directly from Excel values
        const jsonPayload = MA001Format(
            "NBE_MAT_ANL_MA001",
            instCode,
            finYear,
            formattedStartDate,
            formattedEndDate,
            itemValues
        );

        // Save output JSON file
        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputPathJson, JSON.stringify(jsonPayload, null, 4));

        // Save output Excel file
        const excelDir = path.dirname(outputPathExcel);
        if (!fs.existsSync(excelDir)) {
            fs.mkdirSync(excelDir, { recursive: true });
        }
        await workbook.xlsx.writeFile(outputPathExcel);

        return { success: true };
    } catch (err: any) {
        console.error("Error processing MA001 report:", err);
        return {
            success: false,
            error: err?.message || "Failed to process MA001 report template."
        };
    }
}
