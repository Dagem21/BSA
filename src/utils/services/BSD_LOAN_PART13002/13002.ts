import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { PART13002Format, PART13002RowData } from "./jsonFormat";

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

function formatDateOnly(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) {
        return str.split("T")[0];
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
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

export async function process13002Report(
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
        workbook.getWorksheet("13002") ||
        workbook.getWorksheet("BSD_LOAN_PART13002") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    const rowsData: PART13002RowData[] = [];

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

    const isInvalidCounterparty = (cpName: string, nature: string = "") => {
        const cpTrim = cpName.trim();
        if (!cpTrim || cpTrim === "0") return true;
        if (/^\d+$/.test(cpTrim) || cpTrim === "0000001") return true;
        if (cpTrim.includes("T00:00:00") || /^\d{4}-\d{2}-\d{2}/.test(cpTrim)) return true;

        const str = (cpName + " " + nature).toLowerCase();
        return (
            str.includes("end date") ||
            str.includes("start date") ||
            str.includes("institution code") ||
            str.includes("financial year") ||
            str.includes("national bank") ||
            str.includes("s/n") ||
            str.includes("name of counterparty") ||
            str.includes("nature of counterparty") ||
            str.includes("type of exposure") ||
            str.includes("sector of exposure") ||
            str.includes("approved limit") ||
            str.includes("maturity date") ||
            str.includes("in millions of birr") ||
            str.includes("collateral") ||
            str.includes("capital") ||
            str.includes("status (classification)") ||
            str.includes("related party")
        );
    };

    let hasStarted = false;

    for (let r = 1; r <= 500; r++) {
        const row = worksheet.getRow(r);
        const counterpartyName = getDirectCellValue(row.getCell(colOffset));
        const counterpartyNature = getDirectCellValue(row.getCell(colOffset + 1));

        if (isInvalidCounterparty(counterpartyName, counterpartyNature)) {
            continue;
        }

        const cpLower = counterpartyName.toLowerCase();
        if (!hasStarted) {
            hasStarted = true;
        }

        if (cpLower.includes("total") || counterpartyNature.toLowerCase().includes("total")) {
            break;
        }

        const exposureType = getDirectCellValue(row.getCell(colOffset + 2));
        const exposureSector = getDirectCellValue(row.getCell(colOffset + 3));
        const approvedLimit = getNumValue(row.getCell(colOffset + 4));
        const onBalanceExposure = getNumValue(row.getCell(colOffset + 5));
        const offBalanceExposure = getNumValue(row.getCell(colOffset + 6));
        const totalOutstanding = getNumValue(row.getCell(colOffset + 7));
        const rawMaturity = row.getCell(colOffset + 8).value;
        const maturityDate = formatDateOnly(rawMaturity) || getDirectCellValue(row.getCell(colOffset + 8));
        const capital = getNumValue(row.getCell(colOffset + 9));
        const exposurePctCapital = getNumValue(row.getCell(colOffset + 10));
        const status = getDirectCellValue(row.getCell(colOffset + 11));
        const collateralType = getDirectCellValue(row.getCell(colOffset + 12));
        const collateralValue = getNumValue(row.getCell(colOffset + 13));

        rowsData.push({
            counterpartyName,
            counterpartyNature,
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

    // Update Header Metadata cells in template
    worksheet.getCell("B2").value = instCode;
    worksheet.getCell("B3").value = finYear;
    worksheet.getCell("B4").value = formattedStartDate;
    worksheet.getCell("B5").value = formattedEndDate;

    const jsonOutput = PART13002Format(
        "BSD_LOAN_PART13002",
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
