import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { MK001Format, MK001SummaryTotals } from "./jsonFormat";

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

export async function processMK001Report(
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
        workbook.getWorksheet("BSD Monthly  Key Balance Sheet") ||
        workbook.getWorksheet("BSD Monthly Key Balance Sheet") ||
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

    // Read Balance Sheet cells from Row 15 to 22
    const totalAssets = getCellValue(worksheet.getCell("B15"));
    const totalLoansBonds = getCellValue(worksheet.getCell("B16"));
    const ofWhichBonds = getCellValue(worksheet.getCell("B17"));
    const totalDeposits = getCellValue(worksheet.getCell("B18"));
    const demandDeposits = getCellValue(worksheet.getCell("B19"));
    const savingDeposits = getCellValue(worksheet.getCell("B20"));
    const timeDeposits = getCellValue(worksheet.getCell("B21"));
    const totalCapitalReserves = getCellValue(worksheet.getCell("B22"));

    const totals: MK001SummaryTotals = {
        totalAssets,
        totalLoansBonds,
        ofWhichBonds,
        demandDeposits,
        savingDeposits,
        timeDeposits,
        totalCapitalReserves,
        totalDeposits
    };

    const jsonOutput = MK001Format(
        "Key Balance SheetMK001",
        instCode,
        finYear,
        formattedStartDate,
        formattedEndDate,
        totals
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
        summary: totals
    };
}
