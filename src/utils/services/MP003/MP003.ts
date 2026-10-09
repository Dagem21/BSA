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

export async function processMP003Report(
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
        const filePath = path.join(templateDir, "./MP003.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(4).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(5).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(6).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(7).getCell("C"));

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
            "P"
        ];
        const regs = [
            12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68
        ];

        // Optimization 1: Pre-cache column header information (Row 15 and 16)
        const columnHeaders = cols.map((col) => ({
            col,
            time: getDirectCellValue(worksheet.getRow(9).getCell(col)).trim(),
            duration: getDirectCellValue(
                worksheet.getRow(10).getCell(col)
            ).trim(),
            gender: getDirectCellValue(worksheet.getRow(11).getCell(col)).trim()
        }));

        const itemMap = new Map();

        json.ReturnItemsList?.forEach((item: any, index: number) => {
            const desc = item?._description;
            if (desc) {
                const descForm = desc
                    ?.split("_")
                    .map((it: string) => it.trim())
                    .join("_");
                if (!itemMap.has(descForm)) {
                    itemMap.set(descForm, []);
                }
                itemMap.get(descForm).push(index);
            }
        });

        let currReg = "";
        for (let i = 12; i < 73; i++) {
            const esec = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();
            if (!esec) continue;

            for (const header of columnHeaders) {
                let reg = "";
                if (regs.includes(i)) currReg = esec;
                else reg = `${currReg}_`;

                const idn =
                    esec === "Grand Total"
                        ? header.gender === "Grand Total"
                            ? `${esec}_${header.time}_${header.gender}`
                            : `${esec}_${header.time}_${header.duration}_${header.gender}`
                        : header.gender === "Grand Total"
                          ? `${reg}${esec}_${header.time}_${header.gender}`
                          : `${reg}${esec}_${header.time}_${header.duration}_${header.gender}`;
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
                        `Warning: Key '${idn}' has no remaining unused entries in template.json`
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
        const filePath = path.join(templateDir, "MP003.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("Sheet1");
        if (!worksheet) {
            throw new Error("Sheet 'Sheet1' not found in the template.");
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C4").value = json.InstCode;
        worksheet.getCell("C5").value = json.FinYear;
        worksheet.getCell("C6").value = json.StartDate;
        worksheet.getCell("C7").value = json.EndDate;

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
            "P"
        ];
        const formulas = [
            12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 73
        ];

        const columnHeaders = cols.map((col) => ({
            col,
            time: getDirectCellValue(worksheet.getRow(9).getCell(col)).trim(),
            duration: getDirectCellValue(
                worksheet.getRow(10).getCell(col)
            ).trim(),
            gender: getDirectCellValue(worksheet.getRow(11).getCell(col)).trim()
        }));

        const itemMap = new Map();

        json.ReturnItemsList?.forEach((item: any, index: number) => {
            const desc = item?._description;
            if (desc) {
                const descForm = desc
                    ?.split("_")
                    .map((it: string) => it.trim())
                    .join("_");
                if (!itemMap.has(descForm)) {
                    itemMap.set(descForm, []);
                }
                itemMap.get(descForm).push(index);
            }
        });

        let currReg = "";
        for (let i = 12; i < 73; i++) {
            const esec = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();
            if (!esec) continue;

            for (const header of columnHeaders) {
                let reg = "";
                if (formulas.includes(i)) {
                    currReg = esec;
                    continue;
                } else reg = `${currReg}_`;

                const idn =
                    esec === "Grand Total"
                        ? header.gender === "Grand Total"
                            ? `${esec}_${header.time}_${header.gender}`
                            : `${esec}_${header.time}_${header.duration}_${header.gender}`
                        : header.gender === "Grand Total"
                          ? `${reg}${esec}_${header.time}_${header.gender}`
                          : `${reg}${esec}_${header.time}_${header.duration}_${header.gender}`;

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
