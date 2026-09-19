import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { GS001Format, GS001_ITEM_DEFINITIONS } from "./jsonFormat";

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

export function processGS001(worksheet: ExcelJS.Worksheet, options?: { instCode?: string; startDate?: string; endDate?: string }) {
    let instCode = options?.instCode || "0000001";
    let finYear = 2026;
    let startDate = options?.startDate || "2026-04-01T00:00:00";
    let endDate = options?.endDate || "2026-06-30T00:00:00";

    // Header metadata extraction
    for (let r = 1; r <= 15; r++) {
        const row = worksheet.getRow(r);
        const colAText = getCellValue(row.getCell(1)).toLowerCase();
        const colBText = getCellValue(row.getCell(2)).toLowerCase();
        const colCText = getCellValue(row.getCell(3)).toLowerCase();
        const combined = `${colAText} ${colBText} ${colCText}`;

        if (combined.includes("institution code") || combined.includes("instiution code")) {
            const val = getCellValue(row.getCell(3)) || getCellValue(row.getCell(2)) || getCellValue(row.getCell(4));
            if (val) instCode = val;
        } else if (combined.includes("financial year")) {
            const val = getCellValue(row.getCell(3)) || getCellValue(row.getCell(2)) || getCellValue(row.getCell(4));
            if (val && !isNaN(Number(val))) finYear = Number(val);
        } else if (combined.includes("start date")) {
            const val = getCellValue(row.getCell(3)) || getCellValue(row.getCell(2)) || getCellValue(row.getCell(4));
            if (val) startDate = formatIsoString(val);
        } else if (combined.includes("end date")) {
            const val = getCellValue(row.getCell(3)) || getCellValue(row.getCell(2)) || getCellValue(row.getCell(4));
            if (val) endDate = formatIsoString(val);
        }
    }

    // Find Table Layout
    // Look for category rows: Demand, Saving, Time, Total
    const categories = ["demand", "saving", "time", "total"];
    const categoryRows: Record<string, number> = {};

    let startColAmount = 3;
    let startColAccounts = 4;
    let startColDepositors = 5;

    // Detect column header row
    for (let r = 1; r <= 20; r++) {
        const row = worksheet.getRow(r);
        for (let c = 1; c <= 10; c++) {
            const text = getCellValue(row.getCell(c)).toLowerCase();
            if (text.includes("deposit amount") || text.includes("amount")) {
                startColAmount = c;
            }
            if (text.includes("accounts") || text.includes("number of depositors accounts") || text.includes("# of depositors accounts")) {
                startColAccounts = c;
            }
            if (text.includes("# of depositors") && !text.includes("accounts")) {
                startColDepositors = c;
            }
        }
    }

    for (let r = 1; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const col1 = getCellValue(row.getCell(1)).toLowerCase();
        const col2 = getCellValue(row.getCell(2)).toLowerCase();
        const combined = `${col1} ${col2}`;

        categories.forEach((cat) => {
            if (!categoryRows[cat] && combined.includes(cat)) {
                categoryRows[cat] = r;
            }
        });
    }

    const valuesMap: Record<string, string> = {};

    const categoryMap: Record<string, { amtCode: string; accCode: string; depCode: string }> = {
        demand: { amtCode: "163_00001", accCode: "163_00002", depCode: "163_00003" },
        saving: { amtCode: "163_00004", accCode: "163_00005", depCode: "163_00006" },
        time: { amtCode: "163_00007", accCode: "163_00008", depCode: "163_00009" },
        total: { amtCode: "163_00010", accCode: "163_00011", depCode: "163_00012" }
    };

    categories.forEach((cat) => {
        const r = categoryRows[cat];
        const codes = categoryMap[cat];
        if (r) {
            const row = worksheet.getRow(r);
            valuesMap[codes.amtCode] = getCellValue(row.getCell(startColAmount));
            valuesMap[codes.accCode] = getCellValue(row.getCell(startColAccounts));
            valuesMap[codes.depCode] = getCellValue(row.getCell(startColDepositors));
        } else {
            // Check standard item list or fallback
            valuesMap[codes.amtCode] = "";
            valuesMap[codes.accCode] = "";
            valuesMap[codes.depCode] = "";
        }
    });

    // Also check if worksheet is a key-value or code-list format (Code, Description, Value)
    for (let r = 1; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const codeVal = getCellValue(row.getCell(1));
        const itemVal = getCellValue(row.getCell(3)) || getCellValue(row.getCell(2));
        if (codeVal && codeVal.startsWith("163_")) {
            valuesMap[codeVal] = itemVal;
        }
    }

    return GS001Format(
        "Digital SavingGS001",
        instCode,
        finYear,
        startDate,
        endDate,
        valuesMap
    );
}

export async function processGS001Report(
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
        workbook.getWorksheet("GS001") ||
        workbook.getWorksheet("Digital SavingGS001") ||
        workbook.worksheets[0];

    const jsonOutput = processGS001(worksheet, {
        instCode,
        startDate,
        endDate
    });

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
        itemCount: 12
    };
}
