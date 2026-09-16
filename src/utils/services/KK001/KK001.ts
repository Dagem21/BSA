import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { KK001Format, KK001_DESCRIPTIONS } from "./jsonFormat";

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
    if (!cell || cell.value === null || cell.value === undefined) return "0";
    const val = cell.value;
    let str = "";
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && "error" in val.result) {
                return "0";
            }
            str = String(val.result).trim();
        } else if ("richText" in val && Array.isArray(val.richText)) {
            str = val.richText.map((t) => t.text).join("").trim();
        } else if ("text" in val && val.text) {
            str = String(val.text).trim();
        }
    } else {
        str = String(val).trim();
    }
    if (!str || str === "-" || str === "—" || str === "–" || str === "--" || str.toLowerCase() === "n/a" || str.toLowerCase() === "nil") {
        return "0";
    }
    return str;
}

export async function processKK001Report(
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
        workbook.getWorksheet("M_CC-On & OffKK001") ||
        workbook.getWorksheet("NBE") ||
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

    // Read Column C cells from Row 15 to 27 (13 items)
    const valuesMap: Record<string, string> = {};

    KK001_DESCRIPTIONS.forEach((item, idx) => {
        const rowNum = 15 + idx;
        const cellVal = getCellValue(worksheet.getCell(`C${rowNum}`));
        valuesMap[item.code] = cellVal;
    });

    const jsonOutput = KK001Format(
        "M_CC-On & OffKK001",
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
        itemCount: KK001_DESCRIPTIONS.length
    };
}
