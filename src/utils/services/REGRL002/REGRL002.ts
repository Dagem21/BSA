import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { REGRL002Format } from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
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

export async function processREGRL002Report(
    instCode: string,
    inputFilePath: string,
    startDate: string,
    endDate: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);

    const worksheet =
        workbook.getWorksheet("Loan by range and region") ||
        workbook.getWorksheet("NBE") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells
    worksheet.getCell("C8").value = instCode;
    worksheet.getCell("C9").value = finYear;
    worksheet.getCell("C10").value = formattedStartDate;
    worksheet.getCell("C11").value = formattedEndDate;

    const valuesMap: Record<string, string> = {};
    let codeCounter = 48782;

    // 14 Regions x 6 sub-rows = 84 rows starting from Row 17 to 100
    for (let regIndex = 0; regIndex < 14; regIndex++) {
        const startRow = 17 + regIndex * 6;
        for (let subRowIndex = 0; subRowIndex < 6; subRowIndex++) {
            const excelRowIndex = startRow + subRowIndex;
            const row = worksheet.getRow(excelRowIndex);

            for (let colIndex = 0; colIndex < 24; colIndex++) {
                const excelColIndex = 3 + colIndex; // Col C is 3
                const cell = row.getCell(excelColIndex);
                const cellVal = getDirectCellValue(cell);

                const codeStr = `RL002_${codeCounter}`;
                valuesMap[codeStr] = cellVal;
                codeCounter++;

                if (cellVal && typeof cell.value === "object") {
                    cell.value = parseFloat(cellVal) || cellVal;
                }
            }
        }
    }

    const jsonOutput = REGRL002Format(
        "LOAN_RAN & REGRL002",
        instCode,
        finYear,
        formattedStartDate,
        formattedEndDate,
        valuesMap
    );

    const jsonDir = path.dirname(outputJsonPath);
    if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir, { recursive: true });
    }
    fs.writeFileSync(outputJsonPath, JSON.stringify(jsonOutput, null, 4));

    const excelDir = path.dirname(outputExcelPath);
    if (!fs.existsSync(excelDir)) {
        fs.mkdirSync(excelDir, { recursive: true });
    }
    await workbook.xlsx.writeFile(outputExcelPath);

    return {
        success: true,
        jsonPath: outputJsonPath,
        excelPath: outputExcelPath,
        itemCount: 2016
    };
}
