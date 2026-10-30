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

export async function process8E001Report(
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

        const worksheet = workbook.getWorksheet("7. Market Risk Equity");
        if (!worksheet) {
            throw new Error(
                "Sheet '7. Market Risk Equity' not found in the template."
            );
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./8E001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        const value_01 = getDirectCellValue(worksheet.getRow(14).getCell("B"));
        const value_02 = getDirectCellValue(worksheet.getRow(14).getCell("C"));
        const value_03 = getDirectCellValue(worksheet.getRow(14).getCell("D"));
        const value_04 = getDirectCellValue(worksheet.getRow(14).getCell("E"));
        const value_05 = getDirectCellValue(worksheet.getRow(14).getCell("F"));
        const value_06 = getDirectCellValue(worksheet.getRow(14).getCell("G"));
        const value_07 = getDirectCellValue(worksheet.getRow(15).getCell("F"));
        const value_08 = getDirectCellValue(worksheet.getRow(16).getCell("G"));
        const value_09 = getDirectCellValue(worksheet.getRow(17).getCell("G"));
        const value_10 = getDirectCellValue(worksheet.getRow(18).getCell("G"));

        const itemIndex_01 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00001";
        });
        const itemIndex_02 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00002";
        });
        const itemIndex_03 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00003";
        });
        const itemIndex_04 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00004";
        });
        const itemIndex_05 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00005";
        });
        const itemIndex_06 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00006";
        });
        const itemIndex_07 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00007";
        });
        const itemIndex_08 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00008";
        });
        const itemIndex_09 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00009";
        });
        const itemIndex_10 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "173_00010";
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
        if (itemIndex_07 !== undefined && itemIndex_07 !== -1) {
            json.ReturnItemsList[itemIndex_07].Value = value_07 || "0";
        }
        if (itemIndex_08 !== undefined && itemIndex_08 !== -1) {
            json.ReturnItemsList[itemIndex_08].Value = value_08 || "0";
        }
        if (itemIndex_09 !== undefined && itemIndex_09 !== -1) {
            json.ReturnItemsList[itemIndex_09].Value = value_09 || "0";
        }
        if (itemIndex_10 !== undefined && itemIndex_10 !== -1) {
            json.ReturnItemsList[itemIndex_10].Value = value_10 || "0";
        }

        const dynamicItems = [];

        for (let i = 23; i < worksheet.rowCount; i++) {
            if (!getDirectCellValue(worksheet.getRow(i).getCell("A"))) continue;
            const col1 = {
                Code: `${i - 22}.1`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("A")),
                _description: "Equity Instruments",
                _dataType: "TEXT",
                _required: true
            };
            const col2 = {
                Code: `${i - 22}.2`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("B")),
                _description: "Gross Long",
                _dataType: "NUMERIC",
                _required: false
            };
            const col3 = {
                Code: `${i - 22}.3`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("C")),
                _description: "Gross Short",
                _dataType: "NUMERIC",
                _required: false
            };
            const col4 = {
                Code: `${i - 22}.4`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("D")),
                _description: "Gross Open Position ",
                _dataType: "NUMERIC",
                _required: false
            };
            const col5 = {
                Code: `${i - 22}.5`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("E")),
                _description: "Net Open Position ",
                _dataType: "NUMERIC",
                _required: false
            };
            const col6 = {
                Code: `${i - 22}.6`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("F")),
                _description: "11% of Gross Open Position",
                _dataType: "NUMERIC",
                _required: false
            };
            const col7 = {
                Code: `${i - 22}.7`,
                Value: getDirectCellValue(worksheet.getRow(i).getCell("G")),
                _description: "11% of Net Open Position",
                _dataType: "NUMERIC",
                _required: false
            };

            dynamicItems.push(col1, col2, col3, col4, col5, col6, col7);
        }

        json.DynamicItemsList[0].DynamicItems = dynamicItems;

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
        const filePath = path.join(templateDir, "8E001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("7. Market Risk Equity");
        if (!worksheet) {
            throw new Error(
                "Sheet '7. Market Risk Equity' not found in the template."
            );
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;
        const cols = ["A", "B", "C"];

        for (let item of json?.DynamicItemsList?.[0]?.DynamicItems || []) {
            const code = item?.Code;
            const row = parseInt(code.split(".")[0]);
            const colNum = parseInt(code.split(".")[1]);

            if (colNum > 3) continue;
            const col = cols[colNum - 1];

            const value =
                item?._dataType === "NUMERIC"
                    ? parseFloat(item?.Value)
                    : item?.Value;

            worksheet.getCell(`${col}${22 + row}`).value = value;
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
