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
    if (!raw || raw === "-" || raw === "—" || raw === "–" || raw === "--" || raw.toLowerCase() === "n/a" || raw.toLowerCase() === "nil") {
        return "0";
    }
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

    const rowsData: LB002RowData[] = [];

    // Dynamically detect column offset for Counterparty Name
    let colOffset = 1;
    for (let r = 1; r <= 20; r++) {
        const row = worksheet.getRow(r);
        const c1 = getDirectCellValue(row.getCell(1)).toLowerCase();
        const c2 = getDirectCellValue(row.getCell(2)).toLowerCase();
        const c3 = getDirectCellValue(row.getCell(3)).toLowerCase();

        if (c3.includes("counterparty") || c3.includes("name of")) {
            colOffset = 3;
            break;
        } else if (c2.includes("counterparty") || c2.includes("name of")) {
            colOffset = 2;
            break;
        } else if (c1.includes("counterparty") || c1.includes("name of")) {
            colOffset = 1;
            break;
        }
    }

    // Helper to identify invalid/header/metadata counterparty rows
    const isInvalidCounterparty = (cpName: string, expType: string = "") => {
        const cpTrim = cpName.trim();
        if (!cpTrim || cpTrim === "0") return true;

        // Pure numbers, single digits or institution codes (like "1", "2026", "0000001")
        if (/^\d+$/.test(cpTrim) || cpTrim === "0000001") return true;

        // Dates or ISO strings (like "2026-07-31T00:00:00", "2026-08-01")
        if (cpTrim.includes("T00:00:00") || /^\d{4}-\d{2}-\d{2}/.test(cpTrim)) return true;

        const str = (cpName + " " + expType).toLowerCase();
        return (
            str.includes("end date") ||
            str.includes("start date") ||
            str.includes("institution code") ||
            str.includes("financial year") ||
            str.includes("national bank") ||
            str.includes("s/n") ||
            str.includes("name of counterparty") ||
            str.includes("type of exposure") ||
            str.includes("sector of exposure") ||
            str.includes("approved limit") ||
            str.includes("maturity date") ||
            str.includes("in millions of birr") ||
            str.includes("collateral") ||
            str.includes("capital") ||
            str.includes("status (classification)") ||
            str.includes("exceed ten percent") ||
            str.includes("list of counterparties") ||
            str.includes("on-balance sheet") ||
            str.includes("off-balance sheet") ||
            str.includes("c=a+b")
        );
    };

    let hasStarted = false;

    // Scan table rows up to row 500
    for (let r = 1; r <= 500; r++) {
        const row = worksheet.getRow(r);
        const counterpartyName = getDirectCellValue(row.getCell(colOffset));
        const exposureType = getDirectCellValue(row.getCell(colOffset + 1));

        // Skip invalid counterparty, metadata or header rows
        if (isInvalidCounterparty(counterpartyName, exposureType)) {
            continue;
        }

        const cpUpper = counterpartyName.toUpperCase();
        const cpLower = counterpartyName.toLowerCase();

        // Start scanning data from AMG STEEL FACTORY or first valid counterparty
        if (!hasStarted) {
            if (cpUpper.includes("AMG STEEL") || cpUpper.includes("ABDULHAKIM") || cpUpper.includes("STEEL FACTORY")) {
                hasStarted = true;
            } else if (!isInvalidCounterparty(counterpartyName, exposureType)) {
                hasStarted = true;
            } else {
                continue;
            }
        }

        // Stop scanning on total row
        if (cpLower.includes("total") || exposureType.toLowerCase().includes("total")) {
            break;
        }

        const exposureSector = getDirectCellValue(row.getCell(colOffset + 2));
        const approvedLimit = getNumValue(row.getCell(colOffset + 3));
        const onBalanceExposure = getNumValue(row.getCell(colOffset + 4));
        const offBalanceExposure = getNumValue(row.getCell(colOffset + 5));
        const totalOutstanding = getNumValue(row.getCell(colOffset + 6));
        const maturityDate = getDirectCellValue(row.getCell(colOffset + 7));
        const capital = getNumValue(row.getCell(colOffset + 8));
        const exposurePctCapital = getNumValue(row.getCell(colOffset + 9));
        const status = getDirectCellValue(row.getCell(colOffset + 10));
        const collateralType = getDirectCellValue(row.getCell(colOffset + 11));
        const collateralValue = getNumValue(row.getCell(colOffset + 12));

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

        // If we hit AFRICAN OIL PLC, stop after adding it
        if (cpUpper.includes("AFRICAN OIL")) {
            break;
        }
    }

    // Update Header Metadata cells in template after row scanning
    worksheet.getCell("B2").value = instCode;
    worksheet.getCell("B3").value = finYear;
    worksheet.getCell("B4").value = formattedStartDate;
    worksheet.getCell("B5").value = formattedEndDate;

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
