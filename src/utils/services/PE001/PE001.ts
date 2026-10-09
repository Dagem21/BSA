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
    return "";
}

export async function processPE001Report(
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

        const worksheet = workbook.getWorksheet("Sheet1 ");
        if (!worksheet) {
            throw new Error("Sheet 'Sheet1' not found in the template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./PE001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        const cols = ["C", "D", "E", "F", "G", "H", "I", "J", "K"];

        const itemMap = new Map();

        json.ReturnItemsList?.forEach((item: any, index: number) => {
            const code = item?.Code?.trim();
            if (code) {
                if (!itemMap.has(code)) {
                    itemMap.set(code, []);
                }
                itemMap.get(code).push(index);
            }
        });

        let itemCodeNum = 1;
        for (let i = 17; i < 24; i++) {
            for (const col of cols) {
                const code = `153_${itemCodeNum.toString().padStart(5, "0")}`;
                itemCodeNum++;
                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell(col)
                ).trim();

                // Get the list of indices for this key
                const availableIndices = itemMap.get(code);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
                    json.ReturnItemsList[itemIndex].Value = value || "0";
                } else {
                    console.warn(
                        `Warning: Code '${code}' has no remaining unused entries in template.json`
                    );
                }
            }
        }

        const code = `153_${itemCodeNum.toString().padStart(5, "0")}`;
        const availableIndices = itemMap.get(code);

        const value = getDirectCellValue(
            worksheet.getRow(24).getCell("J")
        ).trim();

        if (availableIndices && availableIndices.length > 0) {
            const itemIndex = availableIndices.shift();
            json.ReturnItemsList[itemIndex].Value = value || "0";
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
        const filePath = path.join(templateDir, "PE001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("Sheet1 ");
        if (!worksheet) {
            throw new Error("Sheet 'Sheet1' not found in the template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;

        const cols = ["C", "D", "E", "F", "G", "H", "I", "J", "K"];
        const formulas = [17, 23];
        const formulasCols = ["D", "F", "H", "I", "K"];

        const itemMap = new Map();

        json.ReturnItemsList?.forEach((item: any, index: number) => {
            const code = item?.Code;
            if (code) {
                if (!itemMap.has(code)) {
                    itemMap.set(code, []);
                }
                itemMap.get(code).push(index);
            }
        });

        let itemCodeNum = 1;
        for (let i = 17; i < 24; i++) {
            for (const col of cols) {
                const codeNum = itemCodeNum++;
                const code = `153_${codeNum.toString().padStart(5, "0")}`;

                if (formulas.includes(i) || formulasCols.includes(col))
                    continue;

                // Get the list of indices for this key
                const availableIndices = itemMap.get(code);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
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
