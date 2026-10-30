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

export async function process3O001Report(
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

        const worksheet = workbook.getWorksheet("3. Operational Risk");
        if (!worksheet) {
            throw new Error(
                "Sheet '3. Operational Risk' not found in the template."
            );
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./3O001.json");
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

        const skipRows = [
            ...Array.from({ length: 4 }, (_, i) => i + 31),
            54,
            81,
            ...Array.from({ length: 9 }, (_, i) => i + 91),
            100,
            102,
            104,
            ...Array.from({ length: 9 }, (_, i) => i + 107),
            ...Array.from({ length: 13 }, (_, i) => i + 121),
            143,
            144
        ];

        for (let i = 20; i < 149; i++) {
            if (skipRows.includes(i)) continue;

            if (i >= 20 && i <= 30) {
                const cols = ["C", "D", "E"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    year: getDirectCellValue(
                        worksheet.getRow(19).getCell(col)
                    ).trim()
                }));

                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const header of columnHeaders) {
                    if (!header.year) continue;

                    const idn = `${item}_${header.year}`;
                    const value = getDirectCellValue(
                        worksheet.getRow(i).getCell(header.col)
                    ).trim();

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
            } else if (i >= 35 && i <= 90) {
                const cols = ["C", "D", "E"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    year: getDirectCellValue(
                        worksheet.getRow(33).getCell(col)
                    ).trim()
                }));

                let item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();
                item = item === "Dividend income**" ? "Dividend income" : item;

                for (const header of columnHeaders) {
                    if (!header.year) continue;

                    const idn = `${item}_${header.year}`;
                    const value = getDirectCellValue(
                        worksheet.getRow(i).getCell(header.col)
                    ).trim();

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
            } else if (i >= 100 && i <= 105) {
                const cols = ["C", "D", "E", "F"];
                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const col of cols) {
                    const header = getDirectCellValue(
                        worksheet.getRow(i - 1).getCell(col)
                    ).trim();
                    if (!header) continue;
                    const idn = `${item}_${header}`;

                    const value = getDirectCellValue(
                        worksheet.getRow(i).getCell(col)
                    ).trim();

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
            } else if (i === 106) {
                const idn = "BI = ILDC + SC + FC_FC";

                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell("F")
                ).trim();

                const availableIndices = itemMap.get(idn);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
                    json.ReturnItemsList[itemIndex].Value = value || "0";
                } else {
                    console.warn(
                        `Warning: Key '${idn}' has no remaining unused entries in template.json`
                    );
                }
            } else if (i >= 117 && i <= 119) {
                const cols = ["C", "D", "E"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    type: getDirectCellValue(
                        worksheet.getRow(116).getCell(col)
                    ).trim()
                }));

                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const header of columnHeaders) {
                    if (!header.type) continue;

                    const headerType =
                        header.type === "Marginal Coefficient ( αi)"
                            ? "Marginal Coefficient ( ai)"
                            : header.type;
                    const idn = `${item}_${headerType}`;
                    const value = getDirectCellValue(
                        worksheet.getRow(i).getCell(header.col)
                    ).trim();

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
            } else if (i === 120) {
                const idn = "Total_BIC Value";
                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell("E")
                ).trim();

                const availableIndices = itemMap.get(idn);

                if (availableIndices && availableIndices.length > 0) {
                    const itemIndex = availableIndices.shift();
                    json.ReturnItemsList[itemIndex].Value = value || "0";
                } else {
                    console.warn(
                        `Warning: Key '${idn}' has no remaining unused entries in template.json`
                    );
                }
            } else if (i >= 134 && i <= 142) {
                const cols = ["C", "D", "E", "F", "G", "H"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    h1: getDirectCellValue(
                        worksheet.getRow(132).getCell(col)
                    ).trim(),
                    h2: getDirectCellValue(
                        worksheet.getRow(133).getCell(col)
                    ).trim()
                }));

                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const header of columnHeaders) {
                    const idn = `${item}_${header.h1}_${header.h2}`;
                    const value = getDirectCellValue(
                        worksheet.getRow(i).getCell(header.col)
                    ).trim();

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
            } else if (i >= 145 && i <= 148) {
                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();
                const idn = item;
                const value = getDirectCellValue(
                    worksheet.getRow(i).getCell("C")
                ).trim();

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
        const filePath = path.join(templateDir, "3O001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("3. Operational Risk");
        if (!worksheet) {
            throw new Error(
                "Sheet '3. Operational Risk' not found in the template."
            );
        }

        const data = await readFile(jsonFileName, "utf-8");
        const json = JSON.parse(data);

        worksheet.getCell("C8").value = json.InstCode;
        worksheet.getCell("C9").value = json.FinYear;
        worksheet.getCell("C10").value = json.StartDate;
        worksheet.getCell("C11").value = json.EndDate;

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

        const skipRows = [
            ...Array.from({ length: 5 }, (_, i) => i + 30),
            43,
            51,
            52,
            54,
            64,
            70,
            75,
            80,
            85,
            90,
            81,
            ...Array.from({ length: 134 - 91 }, (_, i) => i + 91)
        ];

        for (let i = 20; i < 142; i++) {
            if (skipRows.includes(i)) continue;

            if (i >= 20 && i <= 30) {
                const cols = ["C", "D", "E"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    year: getDirectCellValue(
                        worksheet.getRow(19).getCell(col)
                    ).trim()
                }));

                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const header of columnHeaders) {
                    if (!header.year) continue;

                    const idn = `${item}_${header.year}`;

                    const availableIndices = itemMap.get(idn);
                    if (availableIndices && availableIndices.length > 0) {
                        const itemIndex = availableIndices.shift();
                        worksheet.getRow(i).getCell(header.col).value =
                            parseFloat(json.ReturnItemsList[itemIndex].Value);
                    } else {
                        console.warn(
                            `Warning: Key '${idn}' has no remaining unused entries in template.json`
                        );
                    }
                }
            } else if (i >= 35 && i <= 90) {
                const cols = ["C", "D", "E"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    year: getDirectCellValue(
                        worksheet.getRow(33).getCell(col)
                    ).trim()
                }));

                let item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();
                item = item === "Dividend income**" ? "Dividend income" : item;

                for (const header of columnHeaders) {
                    if (!header.year) continue;

                    const idn = `${item}_${header.year}`;

                    const availableIndices = itemMap.get(idn);
                    if (availableIndices && availableIndices.length > 0) {
                        const itemIndex = availableIndices.shift();

                        worksheet.getRow(i).getCell(header.col).value =
                            parseFloat(json.ReturnItemsList[itemIndex].Value);
                    } else {
                        console.warn(
                            `Warning: Key '${idn}' has no remaining unused entries in template.json`
                        );
                    }
                }
            } else if (i >= 100 && i <= 105) {
                const cols = ["C", "D", "E", "F"];
                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const col of cols) {
                    const header = getDirectCellValue(
                        worksheet.getRow(i - 1).getCell(col)
                    ).trim();
                    if (!header) continue;
                    const idn = `${item}_${header}`;

                    const availableIndices = itemMap.get(idn);
                    if (availableIndices && availableIndices.length > 0) {
                        const itemIndex = availableIndices.shift();
                        worksheet.getRow(i).getCell(col).value = parseFloat(
                            json.ReturnItemsList[itemIndex].Value
                        );
                    } else {
                        console.warn(
                            `Warning: Key '${idn}' has no remaining unused entries in template.json`
                        );
                    }
                }
            } else if (i >= 117 && i <= 119) {
                const cols = ["C", "D", "E"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    type: getDirectCellValue(
                        worksheet.getRow(116).getCell(col)
                    ).trim()
                }));

                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const header of columnHeaders) {
                    if (!header.type) continue;

                    const headerType =
                        header.type === "Marginal Coefficient ( αi)"
                            ? "Marginal Coefficient ( ai)"
                            : header.type;
                    const idn = `${item}_${headerType}`;

                    const availableIndices = itemMap.get(idn);
                    if (availableIndices && availableIndices.length > 0) {
                        const itemIndex = availableIndices.shift();
                        worksheet.getRow(i).getCell(header.col).value =
                            parseFloat(json.ReturnItemsList[itemIndex].Value);
                    } else {
                        console.warn(
                            `Warning: Key '${idn}' has no remaining unused entries in template.json`
                        );
                    }
                }
            } else if (i >= 134 && i <= 142) {
                const cols = ["C", "D", "E", "F", "G", "H"];
                const columnHeaders = cols.map((col) => ({
                    col,
                    h1: getDirectCellValue(
                        worksheet.getRow(132).getCell(col)
                    ).trim(),
                    h2: getDirectCellValue(
                        worksheet.getRow(133).getCell(col)
                    ).trim()
                }));

                const item = getDirectCellValue(
                    worksheet.getRow(i).getCell("B")
                ).trim();

                for (const header of columnHeaders) {
                    const idn = `${item}_${header.h1}_${header.h2}`;

                    const availableIndices = itemMap.get(idn);

                    if (availableIndices && availableIndices.length > 0) {
                        const itemIndex = availableIndices.shift();
                        worksheet.getRow(i).getCell(header.col).value =
                            parseFloat(json.ReturnItemsList[itemIndex].Value);
                    } else {
                        console.warn(
                            `Warning: Key '${idn}' has no remaining unused entries in template.json`
                        );
                    }
                }
            }
        }

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputExcelPath);
    } catch (error) {
        throw error;
    }
}
