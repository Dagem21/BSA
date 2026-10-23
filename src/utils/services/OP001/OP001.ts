import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const EXCEL_JSON_MAP: any = {
    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)":
        "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)",
    "Currency on hand": "Currency on hand",
    "Due from banks": "Due from banks",
    "Cheques and items in transit": "Cheques and items in transit",
    "Loans & advances": "Loans and Advances",
    "Accrued interest recivable": "Accrued interest receivables",
    "Other assets": "Other assets",
    "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)":
        "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)",
    "Undeliverd spot purchase": "Undelivered spot purchase",
    "Forward purchase": "Forward purchase",
    "Option, Swaps, Derivatives": "Option, Swaps, Derivatives",
    "Total Foreign Assets (Sum of 1.1 & 1.2)":
        "Total Foreign Assets (Sum 1.1 and 1.2)",
    "Foreign Currency Liabilities": "Foreign Currency Liabilities",
    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)":
        "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)",
    "Due to banks abroad": "Due to banks abroad",
    "Foreign currency deposits": "Foreign Currency Deposits",
    Borrowings: "Borrowings",
    "Accured interest payable": "Accrued Interest Payables",
    "Other liabilites": "Other Liabilities",
    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)":
        "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)",
    "Undeliverd spot sales": "Undeliverd spot sales",
    "Forward sales": "Forward sales",
    "Letter of credit": "Letter of credit",
    Guarantees: "Guarantees",
    "Other liabilities": "Other liabilities",
    "Total Foreign Liabilities (Sum of 2.1 & 2.2)":
        "Total Foreign Liablities (sum of 2.1and 2.2)",
    "Foreign Exhange Position in Single Currency":
        "Foreign Exhange Position in Single Currency",
    "Net long position (where assets less liabilities is +)":
        "Net long position (where assets less liabilities is +)",
    "Net short position (where assets less liabilities is -)":
        "Net short position (where assets less liabilities is -)",
    "Mid-exhange rate": "Mid-exchage rate",
    "Net long position in Birr (3.1*4)": "Net long position in Birr (3.1*4)",
    "Net short position in Birr (3.2*4)": "Net short position in Birr (3.2*4)",
    "Net open position ( Greater of 5 or 6)":
        "Net open position (Greater of 5 or 6)",
    "Net Open Positioin Ratio (7/8.4*100)":
        "Net open position Ratio (7/8.4*100)",
    "Overall Foreign Exhange Position": "Overall Foreign Exhange Position",
    "Total Long Position (Sum of row 5)": "Total long position (Sum of row 5)",
    "Total Short Position (Sum of row 6)":
        "Total short position (Sum of row 6)",
    "Overall open position  (Greater of 8.1 or 8.2)":
        "Overall open position (Greater of 8.1 or 8.2)",
    "Tire 1 Capital": "Tire 1 Capital",
    "Overall open position limit (18%*8.4)":
        "Overall open position limit (18%*8.4)",
    "Net Open Position Ratio (8.3/8.4*100)":
        "Net Open Position Ratio (8.3/8.4*100)"
};

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
        if (
            "result" in val &&
            val.result !== undefined &&
            val.result !== null
        ) {
            if (typeof val.result === "object" && "error" in val.result) {
                return "";
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText
                .map((t) => t.text)
                .join("")
                .trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }

        if (cell.type === ExcelJS.ValueType.Date || val instanceof Date) {
            return new Date(val.toString()).toISOString().split("T")[0];
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

export async function processOP001Report(
    instCode: string,
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputJsonPath: string
) {
    try {
        if (!inputFilePath) {
            return {
                success: false
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);

        const worksheet = workbook.getWorksheet("Open Position");
        if (!worksheet) {
            throw new Error("Sheet 'Open Position' not found in the template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./OP001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        const cols = [
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W"
        ];

        const columnHeaders = cols.map((col) => ({
            col,
            currency:
                getDirectCellValue(worksheet.getRow(15).getCell(col)).trim() ||
                getDirectCellValue(worksheet.getRow(14).getCell(col)).trim()
        }));

        const itemMap = new Map();

        json.ReturnItemsList?.forEach((item: any, index: number) => {
            const desc = item?._description?.trim();
            if (desc) {
                if (!itemMap.has(desc)) {
                    itemMap.set(desc, []);
                }
                itemMap.get(desc).push(index);
            }
        });

        const skipRows = [30, 45, 53];
        for (let i = 17; i < 60; i++) {
            if (skipRows.includes(i)) continue;
            const esec = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();
            if (!esec) continue;

            for (const header of columnHeaders) {
                if (i < 54 && header.col === "W") continue;
                else if (i > 53 && header.col !== "W") continue;

                const jsonKey = EXCEL_JSON_MAP[esec];
                const idn = `${jsonKey}_${header.currency}`;
                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell(header.col)
                ).trim();

                // Get the list of indices for this key
                const availableIndices = itemMap.get(idn);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
                    json.ReturnItemsList[itemIndex].Value = value || "0";
                } else {
                    console.warn(
                        `Warning: Key '${idn}' has no remaining unused entries in template.json ${i} ${esec}`
                    );
                }
            }
        }

        const jsonString = JSON.stringify(json, null, 2);
        await writeFile(outputJsonPath, jsonString, "utf8");

        await toExcel(outputJsonPath, outputExcelPath);

        return {
            success: true,
            jsonPath: outputJsonPath,
            excelPath: outputExcelPath
        };
    } catch (error) {
        throw error;
    }
}

async function toExcel(jsonFileName: string, outputExcelPath: string) {
    try {
        if (!jsonFileName) {
            return {
                success: false
            };
        }

        const templateDir = path.join(process.cwd(), "templates");
        const filePath = path.join(templateDir, "OP001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("Open Position");
        if (!worksheet) {
            throw new Error("Sheet 'Open Position' not found in the template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;

        const cols = [
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W"
        ];
        const formulas = [17, 24, 29, 30, 31, 37, 44, 45, 46, 47];

        const columnHeaders = cols.map((col) => ({
            col,
            currency: getDirectCellValue(
                worksheet.getRow(15).getCell(col)
            ).trim()
        }));

        const itemMap = new Map();

        json.ReturnItemsList?.forEach((item: any, index: number) => {
            const desc = item?._description;
            if (desc) {
                if (!itemMap.has(desc)) {
                    itemMap.set(desc, []);
                }
                itemMap.get(desc).push(index);
            }
        });

        for (let i = 17; i < 49; i++) {
            if (formulas.includes(i)) continue;

            const esec = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();
            if (!esec) continue;

            for (const header of columnHeaders) {
                if (i < 54 && header.col === "W") continue;
                else if (i > 53 && header.col !== "W") continue;

                const jsonKey = EXCEL_JSON_MAP[esec];
                const idn = `${jsonKey}_${header.currency}`;
                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell(header.col)
                ).trim();

                // Get the list of indices for this key
                const availableIndices = itemMap.get(idn);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
                    worksheet.getCell(`${header.col}${i}`).value = parseFloat(
                        json.ReturnItemsList[itemIndex].Value
                    );
                }
            }
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
