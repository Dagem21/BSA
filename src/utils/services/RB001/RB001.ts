import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { RB001Format } from "./jsonFormat";

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

function getCellValue(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) return "";
    const val = cell.value;
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t) => t.text).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
        return "";
    }
    return String(val).trim();
}

export async function processRB001Report(
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
        workbook.getWorksheet("NBE") ||
        workbook.getWorksheet("Reserve Base") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells
    worksheet.getCell("B8").value = instCode;
    worksheet.getCell("B9").value = finYear;
    worksheet.getCell("B10").value = formattedStartDate;
    worksheet.getCell("B11").value = formattedEndDate;

    // Read Rows 14 to 21, Cols 3 to 34 (256 items)
    const valuesMap: Record<string, string> = {};
    let codeCounter = 1;

    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
        const excelRow = 14 + rowIndex;
        for (let colIndex = 0; colIndex < 32; colIndex++) {
            const excelCol = 3 + colIndex; // Col C is 3
            const cell = worksheet.getRow(excelRow).getCell(excelCol);
            const valStr = getCellValue(cell);

            const codeStr = `166_${codeCounter.toString().padStart(5, "0")}`;
            valuesMap[codeStr] = valStr;
            codeCounter++;
        }
    }

    const jsonOutput = RB001Format(
        "Reserve BaseRB001",
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
        itemCount: 256
    };
}
