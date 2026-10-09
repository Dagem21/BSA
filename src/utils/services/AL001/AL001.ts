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

export async function processAL001Report(
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

        const worksheet = workbook.getWorksheet("Sheet1");
        if (!worksheet) {
            throw new Error("Sheet 'Sheet1' not found in the template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./AL001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        const value_01 = getDirectCellValue(worksheet.getRow(16).getCell("C"));
        const value_02 = getDirectCellValue(worksheet.getRow(16).getCell("D"));
        const value_03 = getDirectCellValue(worksheet.getRow(17).getCell("C"));
        const value_04 = getDirectCellValue(worksheet.getRow(17).getCell("D"));
        const value_05 = getDirectCellValue(worksheet.getRow(18).getCell("C"));
        const value_06 = getDirectCellValue(worksheet.getRow(18).getCell("D"));

        const itemIndex_01 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00001";
        });
        const itemIndex_02 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00002";
        });
        const itemIndex_03 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00003";
        });
        const itemIndex_04 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00004";
        });
        const itemIndex_05 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00005";
        });
        const itemIndex_06 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00006";
        });

        if (itemIndex_01 !== undefined && itemIndex_01 !== -1) {
            json.ReturnItemsList[itemIndex_01].Value = value_01 || "0";
        }
        if (itemIndex_02 !== undefined && itemIndex_02 !== -1) {
            json.ReturnItemsList[itemIndex_02].Value = value_02 || "0";
        }
        if (itemIndex_03 !== undefined && itemIndex_03 !== -1) {
            json.ReturnItemsList[itemIndex_03].Value = value_03 || "0";
        }
        if (itemIndex_04 !== undefined && itemIndex_04 !== -1) {
            json.ReturnItemsList[itemIndex_04].Value = value_04 || "0";
        }
        if (itemIndex_05 !== undefined && itemIndex_05 !== -1) {
            json.ReturnItemsList[itemIndex_05].Value = value_05 || "0";
        }
        if (itemIndex_06 !== undefined && itemIndex_06 !== -1) {
            json.ReturnItemsList[itemIndex_06].Value = value_06 || "0";
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
        const filePath = path.join(templateDir, "AL001.xlsx");
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

        const itemIndex_01 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00001";
        });
        const itemIndex_02 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00002";
        });
        const itemIndex_03 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00003";
        });
        const itemIndex_04 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00004";
        });
        const itemIndex_05 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00005";
        });
        const itemIndex_06 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "150_00006";
        });

        if (itemIndex_01 !== undefined && itemIndex_01 !== -1) {
            worksheet.getCell(`C16`).value = parseFloat(
                json.ReturnItemsList[itemIndex_01].Value
            );
        }
        if (itemIndex_02 !== undefined && itemIndex_02 !== -1) {
            worksheet.getCell(`D16`).value = parseFloat(
                json.ReturnItemsList[itemIndex_02].Value
            );
        }
        if (itemIndex_03 !== undefined && itemIndex_03 !== -1) {
            worksheet.getCell(`C17`).value = parseFloat(
                json.ReturnItemsList[itemIndex_03].Value
            );
        }
        if (itemIndex_04 !== undefined && itemIndex_04 !== -1) {
            worksheet.getCell(`D17`).value = parseFloat(
                json.ReturnItemsList[itemIndex_04].Value
            );
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
