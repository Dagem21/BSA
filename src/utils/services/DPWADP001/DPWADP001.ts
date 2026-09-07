import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { DPWADP001Format, DPWADP001RowData } from "./jsonFormat";

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

function getNumValue(cell: ExcelJS.Cell): number | string {
    const raw = getDirectCellValue(cell);
    if (!raw) return "";
    const num = parseFloat(raw.replace(/,/g, ""));
    return isNaN(num) ? raw : num;
}

export async function processDPWADP001Report(
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
        workbook.getWorksheet("IFB WADIR") ||
        workbook.getWorksheet("NBE") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells
    worksheet.getCell("B5").value = instCode;
    worksheet.getCell("B6").value = finYear;
    worksheet.getCell("B7").value = formattedStartDate;
    worksheet.getCell("B8").value = formattedEndDate;

    const rowsData: DPWADP001RowData[] = [];

    // Data rows starting from Row 11 to 100
    for (let r = 11; r <= 100; r++) {
        const row = worksheet.getRow(r);
        const depositType = getDirectCellValue(row.getCell(1));
        const depositCategory = getDirectCellValue(row.getCell(2));

        // Skip empty rows or summary text
        if (!depositType && !depositCategory) continue;
        if (depositType.toLowerCase() === "total" || depositCategory.toLowerCase() === "total") continue;

        const totalDepositAmount = getNumValue(row.getCell(3));
        const noOfAccounts = getNumValue(row.getCell(4));
        const minRate = getNumValue(row.getCell(5));
        const maxRate = getNumValue(row.getCell(6));
        const weightedAvgRateCategory = getNumValue(row.getCell(7));
        const weightedAvgRateType = getNumValue(row.getCell(8));

        rowsData.push({
            depositType,
            depositCategory,
            totalDepositAmount,
            noOfAccounts,
            minRate,
            maxRate,
            weightedAvgRateCategory,
            weightedAvgRateType
        });
    }

    const jsonOutput = DPWADP001Format(
        "DPWADP001",
        instCode,
        finYear,
        formattedStartDate,
        formattedEndDate,
        rowsData
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
        itemCount: rowsData.length
    };
}
