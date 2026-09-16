import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { BP001Format, BP001ValuesMap } from "./jsonFormat";

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

export async function processBP001Report(
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
        workbook.getWorksheet("BP001") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Default metadata headers (C8..C11)
    worksheet.getCell("C8").value = instCode;
    worksheet.getCell("C9").value = finYear;
    worksheet.getCell("C10").value = formattedStartDate;
    worksheet.getCell("C11").value = formattedEndDate;

    const valuesMap: BP001ValuesMap = {};

    const snoToCode: Record<string, string> = {
        "1": "29_00001",
        "1.1": "29_00002",
        "1.2": "29_00003",
        "1.3": "29_00004",
        "1.4": "29_00005",
        "1.5": "29_00006",
        "1.5.1": "29_00007",
        "1.5.2": "29_00008",
        "1.6": "29_00009",
        "1.7": "29_00010",
        "1.8": "29_00011",
        "1.9": "29_00012",
        "1.10": "29_00013",
        "2": "29_00014",
        "2.1": "29_00015",
        "2.2": "29_00016",
        "2.3": "29_00017",
        "2.4": "29_00018",
        "2.5": "29_00019",
        "2.6": "29_00020",
        "2.7": "29_00021",
        "2.8": "29_00022",
        "2.9": "29_00023",
        "3": "29_00023"
    };

    const emptyFormat = BP001Format("temp", "temp", 2026, "", "");
    const descToCode = new Map<string, string>();

    const normalizeDesc = (str: string) => {
        return str
            .toLowerCase()
            .replace(/_amount$/i, "")
            .replace(/\([^)]*\)/g, "")
            .replace(/\[[^\]]*\]/g, "")
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]/g, "");
    };

    for (const item of emptyFormat.ReturnItemsList) {
        descToCode.set(normalizeDesc(item._description), item.Code);
    }

    // List of ordered codes for row index fallback (Row 15 to 37 map to 29_00001 to 29_00023)
    const codeOrder = emptyFormat.ReturnItemsList.map(item => item.Code);

    // Scan table rows from row 12 to 100
    for (let r = 12; r <= 100; r++) {
        const row = worksheet.getRow(r);
        const colA = getDirectCellValue(row.getCell(1)); // S.No
        const colB = getDirectCellValue(row.getCell(2)); // Description
        const colC = getDirectCellValue(row.getCell(3)); // Amount/Value

        if (!colA && !colB && !colC) continue;

        let matchedCode: string | undefined;

        // 1. Try matching by S.No (Col A)
        if (colA && snoToCode[colA]) {
            matchedCode = snoToCode[colA];
        }

        // 2. Try matching by normalized description (Col B)
        if (!matchedCode && colB) {
            const normDesc = normalizeDesc(colB);
            if (descToCode.has(normDesc)) {
                matchedCode = descToCode.get(normDesc);
            }
        }

        // 3. Positional fallback if within Row 15 to 37 range
        if (!matchedCode && r >= 15 && r <= 37) {
            matchedCode = codeOrder[r - 15];
        }

        if (matchedCode) {
            valuesMap[matchedCode] = colC;
        }
    }

    const jsonOutput = BP001Format(
        "INT_FRE_SP_BP001",
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
        excelPath: outputExcelPath
    };
}
