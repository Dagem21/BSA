import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { MB001Format, MB001_DESCRIPTIONS, MB001_ROW_CODE_MAP } from "./jsonFormat";

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

export async function processMB001Report(
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
        workbook.getWorksheet("BSD Monthly  Balance Sheet") ||
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

    // Explicit section code overrides in Excel Column A
    const EXCEL_CODE_OVERRIDE_MAP: Record<string, string> = {
        "4.2": "110_00149",      // Long-term Investments (4.2.1 + 4.2.2)
        "14.1.4": "110_00150",   // Domestic banks under Demand deposits
        "21.2": "110_00151",     // Shares premium under Capital
    };

    const valuesMap: Record<string, string> = {};

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 17) return;

        const colA = getDirectCellValue(row.getCell(1));
        const cellC = row.getCell(3);
        const cellVal = getDirectCellValue(cellC);

        let targetCode: string | null = null;
        if (colA && EXCEL_CODE_OVERRIDE_MAP[colA]) {
            targetCode = EXCEL_CODE_OVERRIDE_MAP[colA];
        } else if (rowNumber >= 17 && rowNumber <= 167) {
            targetCode = MB001_ROW_CODE_MAP[rowNumber - 17];
        }

        if (targetCode) {
            valuesMap[targetCode] = cellVal;
            if (cellVal && typeof cellC.value === "object") {
                cellC.value = parseFloat(cellVal) || cellVal;
            }
        }
    });

    const jsonOutput = MB001Format(
        "MB001MB001",
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
        itemCount: MB001_DESCRIPTIONS.length
    };
}
