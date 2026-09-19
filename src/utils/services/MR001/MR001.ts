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

export async function processMR001Report(
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
        const filePath = path.join(templateDir, "./MR001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

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

        for (const row of [26, 37]) {
            for (const col of ["C", "D", "E", "F", "G"]) {
                const nameOfDepositor = getDirectCellValue(
                    worksheet.getRow(row).getCell("B")
                ).trim();

                const colDesc = getDirectCellValue(
                    worksheet.getRow(15).getCell(col)
                ).trim();

                const value = getDirectCellValue(
                    worksheet.getRow(row).getCell(col)
                ).trim();

                const idn = `${nameOfDepositor}_${colDesc}`;
                const availableIndices = itemMap.get(idn);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
                    json.ReturnItemsList[itemIndex].Value = value || "0";
                } else {
                    console.warn(
                        `Warning: Key '${idn}' has no remaining unused entries in template.json`
                    );
                }
            }
        }

        const dataType = [
            {
                _description: "S.No.",
                _dataType: "TEXT",
                _required: true
            },
            {
                _description: "Name of Depositor",
                _dataType: "TEXT",
                _required: false
            },
            {
                _description: "Type of Deposit - Demand/Current",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                _description: "Type of Deposit - Saving",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                _description: "Type of Deposit - Time/Fixed",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                _description: "Days Left for Maturity",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                _description: "Total per depositor",
                _dataType: "NUMERIC",
                _required: false
            }
        ];

        const colsDy = ["A", "B", "C", "D", "E", "F", "G"];

        for (let i = 16; i < 37; i++) {
            if (i === 26) continue;
            for (const col of colsDy) {
                const j = colsDy.indexOf(col);
                let value = getDirectCellValue(
                    worksheet.getRow(i).getCell(col)
                ).trim();

                const dtype = dataType[j]._dataType;
                value =
                    value ||
                    (dtype === "NUMERIC" ? "0" : dtype === "TEXT" ? "-" : "");

                const dataItem = {
                    Code: `${i - (i < 26 ? 15 : 26)}.${j + 1}`,
                    Value: value,
                    ...dataType[j]
                };

                const dynamicIndex = i < 26 ? 0 : 1;
                json.DynamicItemsList[dynamicIndex].DynamicItems.push(dataItem);
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
        const filePath = path.join(templateDir, "MR001.xlsx");
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

        const formulas = [26, 37];

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

        const colsDy = ["A", "B", "C", "D", "E", "F", "G"];
        const dlist0 = json.DynamicItemsList[0].DynamicItems;
        const dlist1 = json.DynamicItemsList[1].DynamicItems;

        for (const item of dlist0) {
            const code = item.Code;

            const row = parseInt(code.split(".")[0]) + 15;
            const col = parseInt(code.split(".")[1]) - 1;
            const colCode = colsDy[col];

            if (formulas.includes(row) || colCode === "A") continue;
            const dtype = item._dataType;
            const value =
                dtype === "NUMERIC" ? parseFloat(item.Value) : item.Value;

            worksheet.getCell(`${colCode}${row}`).value = value;
        }

        for (const item of dlist1) {
            const code = item.Code;

            const row = parseInt(code.split(".")[0]) + 26;
            const col = parseInt(code.split(".")[1]) - 1;
            const colCode = colsDy[col];

            if (formulas.includes(row) || colCode === "A") continue;
            const dtype = item._dataType;
            const value =
                dtype === "NUMERIC" ? parseFloat(item.Value) : item.Value;

            worksheet.getCell(`${colCode}${row}`).value = value;
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
