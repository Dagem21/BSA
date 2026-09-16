import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { MWAC001Format, MWAC001RowData } from "./jsonFormat";

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
    if (!raw || raw === "-" || raw === "—" || raw === "–" || raw === "--" || raw.toLowerCase() === "n/a" || raw.toLowerCase() === "nil") {
        return "0";
    }
    const num = parseFloat(raw.replace(/,/g, ""));
    return isNaN(num) ? raw : num;
}

export async function processMWAC001Report(
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
        workbook.getWorksheet("WALIR") ||
        workbook.getWorksheet("MWAC001") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells in template
    worksheet.getCell("B5").value = instCode;
    worksheet.getCell("B6").value = finYear;
    worksheet.getCell("B7").value = formattedStartDate;
    worksheet.getCell("B8").value = formattedEndDate;

    const rowsData: MWAC001RowData[] = [];
    let hasStarted = false;

    // Scan table data starting from row 1 to 500
    for (let r = 1; r <= 500; r++) {
        const row = worksheet.getRow(r);
        const sector = getDirectCellValue(row.getCell(1));
        const loanCategory = getDirectCellValue(row.getCell(2));

        // Skip completely empty rows
        if (!sector && !loanCategory) {
            continue;
        }

        const sectorLower = sector.toLowerCase();
        const catLower = loanCategory.toLowerCase();

        // Skip metadata and header rows
        if (
            sectorLower.includes("end date") ||
            sectorLower.includes("start date") ||
            sectorLower.includes("instiution code") ||
            sectorLower.includes("institution code") ||
            sectorLower.includes("financial year") ||
            sectorLower.includes("national bank") ||
            sectorLower.includes("monthly weighted average") ||
            sectorLower === "sector" ||
            catLower.includes("loan category")
        ) {
            continue;
        }

        // Start scanning data from first data sector (e.g., Agriculture)
        if (!hasStarted) {
            if (sectorLower.includes("agricult") || sectorLower.includes("manufactur") || sectorLower.includes("trade") || sectorLower.includes("hotel") || sectorLower.includes("building") || sectorLower.includes("mining") || sectorLower.includes("financial") || sectorLower.includes("transport") || sectorLower.includes("health") || sectorLower.includes("consumer") || sectorLower.includes("staff") || sectorLower.includes("other")) {
                hasStarted = true;
            } else {
                continue;
            }
        }

        // If we hit a total row, stop scanning
        if (sectorLower.includes("total") || catLower.includes("total")) {
            break;
        }

        const outstandingLoan = getNumValue(row.getCell(3));
        const noOfLoanAccounts = getNumValue(row.getCell(4));
        const minimumRate = getNumValue(row.getCell(5));
        const maximumRate = getNumValue(row.getCell(6));
        const weightedAverageLoanCategory = getNumValue(row.getCell(7));
        const weightedAverageSector = getNumValue(row.getCell(8));

        rowsData.push({
            sector,
            loanCategory,
            outstandingLoan,
            noOfLoanAccounts,
            minimumRate,
            maximumRate,
            weightedAverageLoanCategory,
            weightedAverageSector
        });
    }

    const jsonOutput = MWAC001Format(
        "LCMWAC001",
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
