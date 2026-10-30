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

export async function process8S001Report(
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

        const worksheet = workbook.getWorksheet("8S001_Capital Summary");
        if (!worksheet) {
            throw new Error(
                "Sheet '8S001_Capital Summary' not found in the template."
            );
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./8S001.json");
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
        const value_02 = getDirectCellValue(worksheet.getRow(17).getCell("C"));
        const value_03 = getDirectCellValue(worksheet.getRow(18).getCell("C"));
        const value_04 = getDirectCellValue(worksheet.getRow(19).getCell("C"));
        const value_05 = getDirectCellValue(worksheet.getRow(20).getCell("C"));
        const value_06 = getDirectCellValue(worksheet.getRow(22).getCell("C"));
        const value_07 = getDirectCellValue(worksheet.getRow(22).getCell("D"));
        const value_08 = getDirectCellValue(worksheet.getRow(23).getCell("C"));
        const value_09 = getDirectCellValue(worksheet.getRow(23).getCell("D"));
        const value_10 = getDirectCellValue(worksheet.getRow(24).getCell("C"));
        const value_11 = getDirectCellValue(worksheet.getRow(24).getCell("D"));
        const value_12 = getDirectCellValue(worksheet.getRow(26).getCell("C"));
        const value_13 = getDirectCellValue(worksheet.getRow(26).getCell("D"));
        const value_14 = getDirectCellValue(worksheet.getRow(29).getCell("C"));
        const value_15 = getDirectCellValue(worksheet.getRow(29).getCell("D"));
        const value_16 = getDirectCellValue(worksheet.getRow(30).getCell("C"));
        const value_17 = getDirectCellValue(worksheet.getRow(31).getCell("C"));
        const value_18 = getDirectCellValue(worksheet.getRow(32).getCell("C"));
        const value_19 = getDirectCellValue(worksheet.getRow(32).getCell("D"));
        const value_20 = getDirectCellValue(worksheet.getRow(33).getCell("C"));
        const value_21 = getDirectCellValue(worksheet.getRow(34).getCell("C"));
        const value_22 = getDirectCellValue(worksheet.getRow(35).getCell("C"));
        const value_23 = getDirectCellValue(worksheet.getRow(35).getCell("D"));
        const value_24 = getDirectCellValue(worksheet.getRow(36).getCell("C"));
        const value_25 = getDirectCellValue(worksheet.getRow(36).getCell("D"));
        const value_26 = getDirectCellValue(worksheet.getRow(37).getCell("C"));
        const value_27 = getDirectCellValue(worksheet.getRow(38).getCell("C"));
        const value_28 = getDirectCellValue(worksheet.getRow(39).getCell("C"));
        const value_29 = getDirectCellValue(worksheet.getRow(39).getCell("D"));
        const value_30 = getDirectCellValue(worksheet.getRow(41).getCell("D"));
        const value_31 = getDirectCellValue(worksheet.getRow(42).getCell("C"));
        const value_32 = getDirectCellValue(worksheet.getRow(43).getCell("C"));
        const value_33 = getDirectCellValue(worksheet.getRow(44).getCell("C"));

        const itemIndex_01 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00001";
        });
        const itemIndex_02 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00002";
        });
        const itemIndex_03 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00003";
        });
        const itemIndex_04 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00004";
        });
        const itemIndex_05 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00005";
        });
        const itemIndex_06 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00006";
        });
        const itemIndex_07 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00007";
        });
        const itemIndex_08 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00008";
        });
        const itemIndex_09 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00009";
        });
        const itemIndex_10 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00010";
        });
        const itemIndex_11 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00011";
        });
        const itemIndex_12 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00012";
        });
        const itemIndex_13 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00013";
        });
        const itemIndex_14 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00014";
        });
        const itemIndex_15 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00015";
        });
        const itemIndex_16 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00016";
        });
        const itemIndex_17 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00017";
        });
        const itemIndex_18 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00018";
        });
        const itemIndex_19 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00019";
        });
        const itemIndex_20 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00020";
        });
        const itemIndex_21 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00021";
        });
        const itemIndex_22 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00022";
        });
        const itemIndex_23 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00023";
        });
        const itemIndex_24 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00024";
        });
        const itemIndex_25 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00025";
        });
        const itemIndex_26 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00026";
        });
        const itemIndex_27 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00027";
        });
        const itemIndex_28 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00028";
        });
        const itemIndex_29 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00029";
        });
        const itemIndex_30 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00030";
        });
        const itemIndex_31 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00031";
        });
        const itemIndex_32 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00032";
        });
        const itemIndex_33 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00033";
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
        if (itemIndex_11 !== undefined && itemIndex_11 !== -1) {
            json.ReturnItemsList[itemIndex_11].Value = value_11 || "0";
        }
        if (itemIndex_12 !== undefined && itemIndex_12 !== -1) {
            json.ReturnItemsList[itemIndex_12].Value = value_12 || "0";
        }
        if (itemIndex_13 !== undefined && itemIndex_13 !== -1) {
            json.ReturnItemsList[itemIndex_13].Value = value_13 || "0";
        }
        if (itemIndex_14 !== undefined && itemIndex_14 !== -1) {
            json.ReturnItemsList[itemIndex_14].Value = value_14 || "0";
        }
        if (itemIndex_15 !== undefined && itemIndex_15 !== -1) {
            json.ReturnItemsList[itemIndex_15].Value = value_15 || "0";
        }
        if (itemIndex_16 !== undefined && itemIndex_16 !== -1) {
            json.ReturnItemsList[itemIndex_16].Value = value_16 || "0";
        }
        if (itemIndex_17 !== undefined && itemIndex_17 !== -1) {
            json.ReturnItemsList[itemIndex_17].Value = value_17 || "0";
        }
        if (itemIndex_18 !== undefined && itemIndex_18 !== -1) {
            json.ReturnItemsList[itemIndex_18].Value = value_18 || "0";
        }
        if (itemIndex_19 !== undefined && itemIndex_19 !== -1) {
            json.ReturnItemsList[itemIndex_19].Value = value_19 || "0";
        }
        if (itemIndex_20 !== undefined && itemIndex_20 !== -1) {
            json.ReturnItemsList[itemIndex_20].Value = value_20 || "0";
        }
        if (itemIndex_21 !== undefined && itemIndex_21 !== -1) {
            json.ReturnItemsList[itemIndex_21].Value = value_21 || "0";
        }
        if (itemIndex_22 !== undefined && itemIndex_22 !== -1) {
            json.ReturnItemsList[itemIndex_22].Value = value_22 || "0";
        }
        if (itemIndex_23 !== undefined && itemIndex_23 !== -1) {
            json.ReturnItemsList[itemIndex_23].Value = value_23 || "0";
        }
        if (itemIndex_24 !== undefined && itemIndex_24 !== -1) {
            json.ReturnItemsList[itemIndex_24].Value = value_24 || "0";
        }
        if (itemIndex_25 !== undefined && itemIndex_25 !== -1) {
            json.ReturnItemsList[itemIndex_25].Value = value_25 || "0";
        }
        if (itemIndex_26 !== undefined && itemIndex_26 !== -1) {
            json.ReturnItemsList[itemIndex_26].Value = value_26 || "0";
        }
        if (itemIndex_27 !== undefined && itemIndex_27 !== -1) {
            json.ReturnItemsList[itemIndex_27].Value = value_27 || "0";
        }
        if (itemIndex_28 !== undefined && itemIndex_28 !== -1) {
            json.ReturnItemsList[itemIndex_28].Value = value_28 || "0";
        }
        if (itemIndex_29 !== undefined && itemIndex_29 !== -1) {
            json.ReturnItemsList[itemIndex_29].Value = value_29 || "0";
        }
        if (itemIndex_30 !== undefined && itemIndex_30 !== -1) {
            json.ReturnItemsList[itemIndex_30].Value = value_30 || "0";
        }
        if (itemIndex_31 !== undefined && itemIndex_31 !== -1) {
            json.ReturnItemsList[itemIndex_31].Value = value_31 || "0";
        }
        if (itemIndex_32 !== undefined && itemIndex_32 !== -1) {
            json.ReturnItemsList[itemIndex_32].Value = value_32 || "0";
        }
        if (itemIndex_33 !== undefined && itemIndex_33 !== -1) {
            json.ReturnItemsList[itemIndex_33].Value = value_33 || "0";
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
        const filePath = path.join(templateDir, "8S001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("8S001_Capital Summary");
        if (!worksheet) {
            throw new Error(
                "Sheet '8S001_Capital Summary' not found in the template."
            );
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;

        const itemIndex_01 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00001";
        });
        const itemIndex_02 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00002";
        });
        const itemIndex_03 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00003";
        });
        const itemIndex_04 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00004";
        });
        const itemIndex_05 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00005";
        });
        const itemIndex_06 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00006";
        });
        const itemIndex_07 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00007";
        });
        const itemIndex_08 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00008";
        });
        const itemIndex_09 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00009";
        });
        const itemIndex_10 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00010";
        });
        const itemIndex_11 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00011";
        });
        const itemIndex_12 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00012";
        });
        const itemIndex_13 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00013";
        });
        const itemIndex_14 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00014";
        });
        const itemIndex_15 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00015";
        });
        const itemIndex_16 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00016";
        });
        const itemIndex_17 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00017";
        });
        const itemIndex_18 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00018";
        });
        const itemIndex_19 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00019";
        });
        const itemIndex_20 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00020";
        });
        const itemIndex_21 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00021";
        });
        const itemIndex_22 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00022";
        });
        const itemIndex_23 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00023";
        });
        const itemIndex_24 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00024";
        });
        const itemIndex_25 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00025";
        });
        const itemIndex_26 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00026";
        });
        const itemIndex_27 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00027";
        });
        const itemIndex_28 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00028";
        });
        const itemIndex_29 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00029";
        });
        const itemIndex_30 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00030";
        });
        const itemIndex_31 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00031";
        });
        const itemIndex_32 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00032";
        });
        const itemIndex_33 = json?.ReturnItemsList?.findIndex((item: any) => {
            const itemCode = item?.Code?.trim();
            return itemCode === "174_00033";
        });

        if (itemIndex_01 !== undefined && itemIndex_01 !== -1) {
            worksheet.getRow(16).getCell("C").value =
                json.ReturnItemsList[itemIndex_01].Value;
        }
        if (itemIndex_02 !== undefined && itemIndex_02 !== -1) {
            worksheet.getRow(17).getCell("C").value =
                json.ReturnItemsList[itemIndex_02].Value;
        }
        if (itemIndex_03 !== undefined && itemIndex_03 !== -1) {
            worksheet.getRow(18).getCell("C").value =
                json.ReturnItemsList[itemIndex_03].Value;
        }
        if (itemIndex_04 !== undefined && itemIndex_04 !== -1) {
            worksheet.getRow(19).getCell("C").value =
                json.ReturnItemsList[itemIndex_04].Value;
        }
        if (itemIndex_05 !== undefined && itemIndex_05 !== -1) {
            worksheet.getRow(20).getCell("C").value =
                json.ReturnItemsList[itemIndex_05].Value;
        }
        if (itemIndex_06 !== undefined && itemIndex_06 !== -1) {
            worksheet.getRow(22).getCell("C").value =
                json.ReturnItemsList[itemIndex_06].Value;
        }
        if (itemIndex_07 !== undefined && itemIndex_07 !== -1) {
            worksheet.getRow(22).getCell("D").value =
                json.ReturnItemsList[itemIndex_07].Value;
        }
        if (itemIndex_08 !== undefined && itemIndex_08 !== -1) {
            worksheet.getRow(23).getCell("C").value =
                json.ReturnItemsList[itemIndex_08].Value;
        }
        if (itemIndex_09 !== undefined && itemIndex_09 !== -1) {
            worksheet.getRow(23).getCell("D").value =
                json.ReturnItemsList[itemIndex_09].Value;
        }
        if (itemIndex_10 !== undefined && itemIndex_10 !== -1) {
            worksheet.getRow(24).getCell("C").value =
                json.ReturnItemsList[itemIndex_10].Value;
        }
        if (itemIndex_11 !== undefined && itemIndex_11 !== -1) {
            worksheet.getRow(24).getCell("D").value =
                json.ReturnItemsList[itemIndex_11].Value;
        }
        if (itemIndex_12 !== undefined && itemIndex_12 !== -1) {
            worksheet.getRow(26).getCell("C").value =
                json.ReturnItemsList[itemIndex_12].Value;
        }
        if (itemIndex_13 !== undefined && itemIndex_13 !== -1) {
            worksheet.getRow(26).getCell("D").value =
                json.ReturnItemsList[itemIndex_13].Value;
        }
        if (itemIndex_14 !== undefined && itemIndex_14 !== -1) {
            worksheet.getRow(29).getCell("C").value =
                json.ReturnItemsList[itemIndex_14].Value;
        }
        if (itemIndex_15 !== undefined && itemIndex_15 !== -1) {
            worksheet.getRow(29).getCell("D").value =
                json.ReturnItemsList[itemIndex_15].Value;
        }
        if (itemIndex_16 !== undefined && itemIndex_16 !== -1) {
            worksheet.getRow(30).getCell("C").value =
                json.ReturnItemsList[itemIndex_16].Value;
        }
        if (itemIndex_17 !== undefined && itemIndex_17 !== -1) {
            worksheet.getRow(31).getCell("C").value =
                json.ReturnItemsList[itemIndex_17].Value;
        }
        if (itemIndex_18 !== undefined && itemIndex_18 !== -1) {
            worksheet.getRow(32).getCell("C").value =
                json.ReturnItemsList[itemIndex_18].Value;
        }
        if (itemIndex_19 !== undefined && itemIndex_19 !== -1) {
            worksheet.getRow(32).getCell("D").value =
                json.ReturnItemsList[itemIndex_19].Value;
        }
        if (itemIndex_20 !== undefined && itemIndex_20 !== -1) {
            worksheet.getRow(33).getCell("C").value =
                json.ReturnItemsList[itemIndex_20].Value;
        }
        if (itemIndex_21 !== undefined && itemIndex_21 !== -1) {
            worksheet.getRow(34).getCell("C").value =
                json.ReturnItemsList[itemIndex_21].Value;
        }
        if (itemIndex_22 !== undefined && itemIndex_22 !== -1) {
            worksheet.getRow(35).getCell("C").value =
                json.ReturnItemsList[itemIndex_22].Value;
        }
        if (itemIndex_23 !== undefined && itemIndex_23 !== -1) {
            worksheet.getRow(35).getCell("D").value =
                json.ReturnItemsList[itemIndex_23].Value;
        }
        if (itemIndex_24 !== undefined && itemIndex_24 !== -1) {
            worksheet.getRow(36).getCell("C").value =
                json.ReturnItemsList[itemIndex_24].Value;
        }
        if (itemIndex_25 !== undefined && itemIndex_25 !== -1) {
            worksheet.getRow(36).getCell("D").value =
                json.ReturnItemsList[itemIndex_25].Value;
        }
        if (itemIndex_26 !== undefined && itemIndex_26 !== -1) {
            worksheet.getRow(37).getCell("C").value =
                json.ReturnItemsList[itemIndex_26].Value;
        }
        if (itemIndex_27 !== undefined && itemIndex_27 !== -1) {
            worksheet.getRow(38).getCell("C").value =
                json.ReturnItemsList[itemIndex_27].Value;
        }
        if (itemIndex_28 !== undefined && itemIndex_28 !== -1) {
            worksheet.getRow(39).getCell("C").value =
                json.ReturnItemsList[itemIndex_28].Value;
        }
        if (itemIndex_29 !== undefined && itemIndex_29 !== -1) {
            worksheet.getRow(39).getCell("D").value =
                json.ReturnItemsList[itemIndex_29].Value;
        }
        if (itemIndex_30 !== undefined && itemIndex_30 !== -1) {
            worksheet.getRow(41).getCell("D").value =
                json.ReturnItemsList[itemIndex_30].Value;
        }
        if (itemIndex_31 !== undefined && itemIndex_31 !== -1) {
            worksheet.getRow(42).getCell("C").value =
                json.ReturnItemsList[itemIndex_31].Value;
        }
        if (itemIndex_32 !== undefined && itemIndex_32 !== -1) {
            worksheet.getRow(43).getCell("C").value =
                json.ReturnItemsList[itemIndex_32].Value;
        }
        if (itemIndex_33 !== undefined && itemIndex_33 !== -1) {
            worksheet.getRow(44).getCell("C").value =
                json.ReturnItemsList[itemIndex_33].Value;
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
