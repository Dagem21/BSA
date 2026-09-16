import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";

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
    return val.toString();
}

export async function processEP001Report(
    inputFilePath: string,
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

        const worksheet = workbook.getWorksheet("Sheet1");
        if (!worksheet) {
            throw new Error("Sheet 'Sheet1' not found in the template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./EP001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        const cols = ["C", "D", "E", "F"];

        for (let i = 16; i < 26; i++) {
            const catagory = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();

            for (const col of cols) {
                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell(col)
                );
                let itemCatType = getDirectCellValue(
                    worksheet.getRow(14).getCell(col)
                );
                let itemValType = getDirectCellValue(
                    worksheet.getRow(15).getCell(col)
                ).trim();

                switch (itemCatType) {
                    case "Disbursement":
                        itemCatType = "Disbursement in the month";
                        break;
                    case " Outstanding loans and advances":
                        itemCatType = "Outstanding Loans and Advances";
                        break;
                    default:
                        break;
                }
                const itemDesc = `${catagory}_${itemCatType}_${itemValType}`;

                const itemIndex = json?.ReturnItemsList?.findIndex(
                    (item: any) => {
                        return itemDesc === item?._description;
                    }
                );

                if (itemIndex !== undefined && itemIndex !== -1) {
                    json.ReturnItemsList[itemIndex].Value = value || "0";
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
        const filePath = path.join(templateDir, "EP001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("Sheet1");
        if (!worksheet) {
            throw new Error("Sheet 'Sheet1' not found in the template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;

        const formulas = [22, 25];
        const cols = ["C", "E"];

        for (let i = 16; i < 26; i++) {
            if (formulas.includes(i)) continue;
            const catagory = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();

            for (const col of cols) {
                const itemIndex = json?.ReturnItemsList?.findIndex(
                    (item: any) => {
                        let itemCatType = getDirectCellValue(
                            worksheet.getRow(14).getCell(col)
                        );
                        let itemValType = getDirectCellValue(
                            worksheet.getRow(15).getCell(col)
                        );

                        switch (itemCatType) {
                            case "Disbursement":
                                itemCatType = "Disbursement in the month";
                                break;
                            case " Outstanding loans and advances":
                                itemCatType = "Outstanding Loans and Advances";
                                break;
                            default:
                                break;
                        }

                        const itemDesc = `${catagory}_${itemCatType}_${itemValType}`;
                        return itemDesc === item?._description?.trim();
                    }
                );

                if (itemIndex !== undefined && itemIndex !== -1) {
                    worksheet.getCell(`${col}${i}`).value = parseFloat(
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
