import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { LB002Format, LB002RowData } from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) {
        const datePart = str.split("T")[0];
        return `${datePart}T00:00:00`;
    }
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
        return "";
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

export async function processLB002Report(
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
        workbook.getWorksheet("LB002") ||
        workbook.getWorksheet("BOR_TEN_PER_LB002") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells in template
    worksheet.getCell("B2").value = instCode;
    worksheet.getCell("B3").value = finYear;
    worksheet.getCell("B4").value = formattedStartDate;
    worksheet.getCell("B5").value = formattedEndDate;

    const rowsData: LB002RowData[] = [];

    // Scan table data starting from row 8 (after headers)
    for (let r = 8; r <= 500; r++) {
        const row = worksheet.getRow(r);
        const counterpartyName = getDirectCellValue(row.getCell(1));
        const exposureType = getDirectCellValue(row.getCell(2));

        // Skip completely empty rows
        if (!counterpartyName && !exposureType) {
            continue;
        }

        // Stop on total row
        if (counterpartyName.toLowerCase().includes("total") || exposureType.toLowerCase().includes("total")) {
            break;
        }

        const exposureSector = getDirectCellValue(row.getCell(3));
        const approvedLimit = getNumValue(row.getCell(4));
        const onBalanceExposure = getNumValue(row.getCell(5));
        const offBalanceExposure = getNumValue(row.getCell(6));
        const totalOutstanding = getNumValue(row.getCell(7));
        const maturityDate = getDirectCellValue(row.getCell(8));
        const capital = getNumValue(row.getCell(9));
        const exposurePctCapital = getNumValue(row.getCell(10));
        const status = getDirectCellValue(row.getCell(11));
        const collateralType = getDirectCellValue(row.getCell(12));
        const collateralValue = getNumValue(row.getCell(13));

        rowsData.push({
            counterpartyName,
            exposureType,
            exposureSector,
            approvedLimit,
            onBalanceExposure,
            offBalanceExposure,
            totalOutstanding,
            maturityDate,
            capital,
            exposurePctCapital,
            status,
            collateralType,
            collateralValue
        });
    }

    const jsonOutput = LB002Format(
        "BOR_TEN_PER_LB002",
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
        excelPath: outputExcelPath
    };
}
