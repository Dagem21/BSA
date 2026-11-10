import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { MB001Format, MB001_DESCRIPTIONS, MB001_ROW_CODE_MAP } from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return "";
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) {
        const parts = str.split("T");
        return `${parts[0]}T00:00:00`;
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
    if (!cell || cell.value === null || cell.value === undefined) return "0";
    const val = cell.value;
    let str = "";
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        str = val.trim();
    } else if (typeof val === "object") {
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
    } else if (cell.result !== undefined && cell.result !== null) {
        str = String(cell.result).trim();
    } else if (cell.text !== undefined && cell.text !== null) {
        str = String(cell.text).trim();
    }
    str = str.replace(/,/g, "");
    if (!str || str === "-" || str === "—" || str === "–" || str === "--" || str.toLowerCase() === "n/a" || str.toLowerCase() === "nil") {
        return "0";
    }
    return str;
}

export async function processMB001Report(
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
        workbook.getWorksheet("MB001MB001") ||
        workbook.getWorksheet("MB001") ||
        workbook.getWorksheet("NBE") ||
        workbook.getWorksheet("BSD Monthly  Balance Sheet") ||
        workbook.getWorksheet("Sheet1") ||
        workbook.worksheets[0];

    const finYear = new Date(startDate).getFullYear();
    const formattedStartDate = formatIsoString(startDate);
    const formattedEndDate = formatIsoString(endDate);

    // Update Header Metadata cells (Column C holds the values)
    worksheet.getCell("C8").value = instCode;
    worksheet.getCell("C9").value = finYear;
    worksheet.getCell("C10").value = formattedStartDate;
    worksheet.getCell("C11").value = formattedEndDate;

    // Explicit section code overrides in Excel Column A
    const EXCEL_CODE_OVERRIDE_MAP: Record<string, string> = {
        "4.2": "110_00149",      // Long-term Investments (4.2.1 + 4.2.2)
        "14.1.4": "110_00150",   // Domestic banks under Demand deposits
        "21.2": "110_00151",     // Shares premium under Capital
    };

    const valuesMap: Record<string, string> = {};

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 17) return;

        const colA = getDirectCellValue(row.getCell(1));
        const cellC = row.getCell(3);
        const cellVal = getDirectCellValue(cellC);

        let targetCode: string | null = null;
        if (colA && EXCEL_CODE_OVERRIDE_MAP[colA]) {
            targetCode = EXCEL_CODE_OVERRIDE_MAP[colA];
        } else if (rowNumber >= 17 && rowNumber <= 167) {
            targetCode = MB001_ROW_CODE_MAP[rowNumber - 17];
        }

        if (targetCode) {
            valuesMap[targetCode] = cellVal;
            if (cellVal && typeof cellC.value === "object") {
                const num = parseFloat(cellVal);
                cellC.value = !isNaN(num) ? num : cellVal;
            }
        }
    });

    const jsonOutput = MB001Format(
        "MB001MB001",
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
        itemCount: MB001_DESCRIPTIONS.length
    };
}

export async function jsonToExcelMB001(
    jsonData: any,
    outputExcelPath?: string
): Promise<ExcelJS.Workbook> {
    const templatePath1 = path.join(process.cwd(), "templates", "MB001MB001.xlsx");
    const templatePath2 = path.join(process.cwd(), "templates", "MB001.xlsx");
    const templatePath = fs.existsSync(templatePath1) ? templatePath1 : templatePath2;

    const workbook = new ExcelJS.Workbook();
    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        workbook.addWorksheet("MB001MB001");
    }

    let worksheet =
        workbook.getWorksheet("MB001MB001") ||
        workbook.getWorksheet("MB001") ||
        workbook.getWorksheet("NBE") ||
        workbook.getWorksheet("BSD Monthly  Balance Sheet") ||
        workbook.worksheets[0];

    if (!worksheet) {
        worksheet = workbook.addWorksheet("MB001MB001");
    }

    // Set Header Metadata (C8..C11)
    if (jsonData.ReturnKey) worksheet.getCell("A1").value = jsonData.ReturnKey;
    if (jsonData.InstCode) worksheet.getCell("C8").value = jsonData.InstCode;
    if (jsonData.FinYear) worksheet.getCell("C9").value = Number(jsonData.FinYear);
    if (jsonData.StartDate) worksheet.getCell("C10").value = formatIsoString(jsonData.StartDate);
    if (jsonData.EndDate) worksheet.getCell("C11").value = formatIsoString(jsonData.EndDate);

    const safeSet = (cell: ExcelJS.Cell, rawVal: any) => {
        if (rawVal === undefined || rawVal === null || rawVal === "") return;
        if (
            cell.type === ExcelJS.ValueType.Formula ||
            (cell.value && typeof cell.value === "object" && ("formula" in cell.value || "sharedFormula" in cell.value))
        ) {
            return;
        }
        const num = parseFloat(rawVal);
        cell.value = isNaN(num) ? rawVal : num;
    };

    const EXCEL_CODE_OVERRIDE_MAP: Record<string, string> = {
        "4.2": "110_00149",
        "14.1.4": "110_00150",
        "21.2": "110_00151",
    };

    const itemsMap = new Map<string, string>();
    if (Array.isArray(jsonData.ReturnItemsList)) {
        for (const item of jsonData.ReturnItemsList) {
            if (item && item.Code) {
                itemsMap.set(item.Code, item.Value);
            }
        }
    }

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 17 || rowNumber > 167) return;

        const colA = getDirectCellValue(row.getCell(1));
        let targetCode: string | null = null;
        if (colA && EXCEL_CODE_OVERRIDE_MAP[colA]) {
            targetCode = EXCEL_CODE_OVERRIDE_MAP[colA];
        } else if (rowNumber >= 17 && rowNumber <= 167) {
            targetCode = MB001_ROW_CODE_MAP[rowNumber - 17];
        }

        if (targetCode && itemsMap.has(targetCode)) {
            const val = itemsMap.get(targetCode);
            safeSet(row.getCell(3), val);
        }
    });

    if (outputExcelPath) {
        const outDir = path.dirname(outputExcelPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    return workbook;
}
