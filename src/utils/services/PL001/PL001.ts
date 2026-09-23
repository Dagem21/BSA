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

export async function processPL001Report(
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

        const worksheet = workbook.getWorksheet("PRO&LOS_PL001");
        if (!worksheet) {
            throw new Error("Sheet 'PRO&LOS_PL001' not found in the template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./PL001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        for (let i = 16; i < 45; i++) {
            const value = getDirectCellValue(worksheet.getRow(i).getCell("C"));

            const code = `3_${(i - 15).toString().padStart(5, "0")}`;

            const itemIndex = json?.ReturnItemsList?.findIndex((item: any) => {
                const itemCode = item?.Code?.trim();
                return itemCode === code;
            });

            // Guard against missing items (-1)
            if (itemIndex !== undefined && itemIndex !== -1) {
                json.ReturnItemsList[itemIndex].Value = value || "0";
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
        const filePath = path.join(templateDir, "PL001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("PRO&LOS_PL001");
        if (!worksheet) {
            throw new Error("Sheet 'PRO&LOS_PL001' not found in the template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;

        const formulas = [
            17, 18, 21, 22, 27, 30, 33, 34, 38, 39, 42, 48, 49, 55, 56, 57, 60,
            70, 73, 76, 79, 83, 84, 85, 94, 98, 100, 101, 102, 117, 125, 133,
            134, 135, 139, 143, 147, 155, 159, 166, 167
        ];

        for (let i = 16; i < 45; i++) {
            if (formulas.includes(i)) continue;
            const code = `3_${(i - 15).toString().padStart(5, "0")}`;

            const itemIndex = json?.ReturnItemsList?.findIndex((item: any) => {
                const itemCode = item?.Code?.trim();
                return itemCode === code;
            });

            // Guard against missing items (-1)
            if (itemIndex !== undefined && itemIndex !== -1) {
                worksheet.getCell(`C${i}`).value = parseFloat(
                    json.ReturnItemsList[itemIndex].Value
                );
            } else {
                console.warn(
                    `Warning: Code '${code}' from row ${i} not found in template.json`
                );
            }
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
