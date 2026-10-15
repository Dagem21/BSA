import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const snoToCode: Record<string, string> = {
    "1C": "SD01001_00001",
    "2C": "SD01001_00003",
    "2.1C": "SD01001_00005",
    "2.2C": "SD01001_00007",
    "2.3C": "SD01001_00009",
    "2.4C": "SD01001_00011",
    "2.5C": "SD01001_00013",
    "2.6C": "SD01001_00015",
    "2.7C": "SD01001_00017",
    "2.8C": "SD01001_00019",
    "2.9C": "SD01001_00021",
    "3C": "SD01001_00023",
    "3.1C": "SD01001_00025",
    "3.1.1C": "SD01001_00027",
    "3.1.2C": "SD01001_00029",
    "3.2C": "SD01001_00031",
    "3.2.1C": "SD01001_00033",
    "3.2.2C": "SD01001_00035",

    "1D": "SD01001_00002",
    "2D": "SD01001_00004",
    "2.1D": "SD01001_00006",
    "2.2D": "SD01001_00008",
    "2.3D": "SD01001_00010",
    "2.4D": "SD01001_00012",
    "2.5D": "SD01001_00014",
    "2.6D": "SD01001_00016",
    "2.7D": "SD01001_00018",
    "2.8D": "SD01001_00020",
    "2.9D": "SD01001_00022",
    "3D": "SD01001_00024",
    "3.1D": "SD01001_00026",
    "3.1.1D": "SD01001_00028",
    "3.1.2D": "SD01001_00030",
    "3.2D": "SD01001_00032",
    "3.2.1D": "SD01001_00034",
    "3.2.2D": "SD01001_00036"
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

export async function processSD01001Report(
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

        const worksheet = workbook.getWorksheet("Banks");
        if (!worksheet) {
            throw new Error("Sheet 'Banks' not found in the template.");
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./SD01001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(3).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(4).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(5).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(6).getCell("C"));

        for (let i = 8; i < 26; i++) {
            const code = getDirectCellValue(
                worksheet.getRow(i).getCell("A")
            ).trim();
            const valueC = getDirectCellValue(worksheet.getRow(i).getCell("C"));
            const valueD = getDirectCellValue(worksheet.getRow(i).getCell("D"));

            const itemIndexC = json?.ReturnItemsList?.findIndex((item: any) => {
                const itemCode = (item?.Code || "").trim();
                return itemCode === snoToCode[`${code}C`];
            });

            const itemIndexD = json?.ReturnItemsList?.findIndex((item: any) => {
                const itemCode = (item?.Code || "").trim();
                return itemCode === snoToCode[`${code}D`];
            });

            // Guard against missing items (-1)
            if (itemIndexC !== undefined && itemIndexC !== -1) {
                json.ReturnItemsList[itemIndexC].Value = valueC || "0";
            }

            if (itemIndexD !== undefined && itemIndexD !== -1) {
                json.ReturnItemsList[itemIndexD].Value = valueD || "0";
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
        const filePath = path.join(templateDir, "SD01001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("Banks");
        if (!worksheet) {
            throw new Error("Sheet 'Banks' not found in the template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C3").value = json.InstCode;
        worksheet.getCell("C4").value = json.FinYear;
        worksheet.getCell("C5").value = json.StartDate;
        worksheet.getCell("C6").value = json.EndDate;

        const formulas = [9, 19, 20, 23];

        for (let i = 8; i < 26; i++) {
            if (formulas.includes(i)) continue;

            const code = getDirectCellValue(
                worksheet.getRow(i).getCell("A")
            ).trim();

            if (!code) continue; // Skip empty rows
            const itemIndexC = json?.ReturnItemsList?.findIndex((item: any) => {
                const itemCode = (item?.Code || "").trim();
                return itemCode === snoToCode[`${code}C`];
            });

            const itemIndexD = json?.ReturnItemsList?.findIndex((item: any) => {
                const itemCode = (item?.Code || "").trim();
                return itemCode === snoToCode[`${code}D`];
            });

            // Guard against missing items (-1)
            if (itemIndexC !== undefined && itemIndexC !== -1) {
                worksheet.getCell(`C${i}`).value = parseFloat(
                    json.ReturnItemsList[itemIndexC].Value
                );
            }

            if (itemIndexD !== undefined && itemIndexD !== -1) {
                worksheet.getCell(`D${i}`).value = parseFloat(
                    json.ReturnItemsList[itemIndexD].Value
                );
            }
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
