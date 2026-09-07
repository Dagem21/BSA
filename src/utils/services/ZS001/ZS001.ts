import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { ZS001Format } from "./jsonFormat";

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

function getCellValue(cell: ExcelJS.Cell): string {
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
            if (typeof val.result === "object") {
                if ("error" in val.result) return "";
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
        if (typeof cell.result === "object") return "";
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

export async function processZS001Report(
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
        workbook.getWorksheet("ZS001 ") ||
        workbook.getWorksheet("ZS001") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Detect day header start column (where 'Thu' or 'Thursday' is placed)
    let startCol = 4;
    for (let r = 1; r <= 20; r++) {
        const row = worksheet.getRow(r);
        for (let c = 1; c <= 15; c++) {
            const val = getCellValue(row.getCell(c)).toLowerCase();
            if (val === "thu" || val === "thursday") {
                startCol = c;
                break;
            }
        }
    }

    // Update Header Metadata cells dynamically or fallback to D9-D12 / C9-C12
    let instCodeCell = worksheet.getCell(`${startCol === 3 ? 'C' : 'D'}9`);
    let finYearCell = worksheet.getCell(`${startCol === 3 ? 'C' : 'D'}10`);
    let startDateCell = worksheet.getCell(`${startCol === 3 ? 'C' : 'D'}11`);
    let endDateCell = worksheet.getCell(`${startCol === 3 ? 'C' : 'D'}12`);

    for (let r = 1; r <= 16; r++) {
        const row = worksheet.getRow(r);
        const colAText = getCellValue(row.getCell(1)).toLowerCase();
        const colBText = getCellValue(row.getCell(2)).toLowerCase();
        const colCText = getCellValue(row.getCell(3)).toLowerCase();
        const combined = `${colAText} ${colBText} ${colCText}`;

        if (combined.includes("instiution code") || combined.includes("institution code")) {
            instCodeCell = row.getCell(startCol);
        } else if (combined.includes("financial year")) {
            finYearCell = row.getCell(startCol);
        } else if (combined.includes("start date")) {
            startDateCell = row.getCell(startCol);
        } else if (combined.includes("end date")) {
            endDateCell = row.getCell(startCol);
        }
    }

    instCodeCell.value = instCode;
    finYearCell.value = finYear;
    startDateCell.value = formattedStartDate;
    endDateCell.value = formattedEndDate;

    // Layout-agnostic category row matchers
    const matchers = [
        (t: string) => t.includes("net current liabilities") && !t.includes("15%") && !t.includes("% of"),
        (t: string) => t.includes("cash - local") || (t.includes("cash") && t.includes("foreign")),
        (t: string) => t.includes("deposits with nbe"),
        (t: string) => t.includes("deposits with other"),
        (t: string) => t.includes("treasury bills"),
        (t: string) => t.includes("net due from domestic"),
        (t: string) => t.includes("net due from foreign"),
        (t: string) => t.includes("total liquid assets"),
        (t: string) => (t.includes("excess/deficit") || t.includes("excess") || t.includes("deficit")) && !t.includes("3.1")
    ];

    const categoryRows: Array<number | null> = new Array(9).fill(null);
    const fallbackRows = startCol === 3 ? [16, 19, 20, 21, 22, 23, 24, 25, 26] : [17, 20, 21, 22, 23, 24, 25, 26, 27];

    for (let r = 1; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const colAText = getCellValue(row.getCell(1)).toLowerCase();
        const colBText = getCellValue(row.getCell(2)).toLowerCase();
        const colCText = getCellValue(row.getCell(3)).toLowerCase();
        const rowText = `${colAText} ${colBText} ${colCText}`;

        matchers.forEach((m, idx) => {
            if (categoryRows[idx] === null && m(rowText)) {
                categoryRows[idx] = r;
            }
        });
    }

    const finalCategoryRows = categoryRows.map((r, i) => r ?? fallbackRows[i]);

    const valuesMap: Record<string, string> = {};
    let codeCounter = 1;

    for (const excelRow of finalCategoryRows) {
        for (let colIndex = 0; colIndex < 8; colIndex++) {
            const excelCol = startCol + colIndex;
            const cell = worksheet.getRow(excelRow).getCell(excelCol);
            const valStr = getCellValue(cell);

            const codeStr = `109_${codeCounter.toString().padStart(5, "0")}`;
            valuesMap[codeStr] = valStr;
            codeCounter++;
        }
    }

    const jsonOutput = ZS001Format(
        "LSR-Statutory ZS001",
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
        itemCount: 72
    };
}
