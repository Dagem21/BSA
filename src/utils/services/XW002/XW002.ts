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

export async function processXW002Report(
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
        const filePath = path.join(templateDir, "./XW002.json");
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

        const dataType = [
            {
                _description: "Name of borrower",
                _dataType: "TEXT",
                _required: true
            },
            {
                _description: "Loan Type",
                _dataType: "TEXT",
                _required: false
            },
            {
                _description: "Outstanding balance",
                _dataType: "TEXT",
                _required: false
            },
            {
                _description: "Loan status",
                _dataType: "TEXT",
                _required: false
            },
            {
                _description: "Collateral Type",
                _dataType: "TEXT",
                _required: false
            },
            {
                _description: "Collateral Value",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                _description: "Provision held",
                _dataType: "NUMERIC",
                _required: false
            }
        ];

        const cols = ["B", "C", "D", "E", "F", "G", "H"];

        let startIndex = 15;
        let prevInd = "";

        for (let i = 16; i < worksheet.rowCount + 1; i++) {
            const sno = getDirectCellValue(
                worksheet.getRow(i).getCell("A")
            ).trim();
            const ind = sno?.split(".")?.[0] || "";

            const borrower = getDirectCellValue(
                worksheet.getRow(i).getCell("B")
            ).trim();

            if (!borrower) continue;

            if (ind === "1" || ind === "2") {
                for (const col of cols) {
                    let value = getDirectCellValue(
                        worksheet.getRow(i).getCell(col)
                    ).trim();
                    const j = cols.indexOf(col);

                    const dtype = dataType[j]._dataType;
                    value =
                        value ||
                        (dtype === "NUMERIC"
                            ? "0"
                            : dtype === "TEXT"
                              ? "-"
                              : "");

                    const dataItem = {
                        Code: `${i - startIndex}.${j + 1}`,
                        Value: value,
                        ...dataType[j]
                    };

                    json.DynamicItemsList[parseInt(ind) - 1].DynamicItems.push(
                        dataItem
                    );
                }
            } else if (ind === "") {
                startIndex = i;

                const loanType =
                    prevInd === "1"
                        ? "Real_Estate"
                        : prevInd === "2"
                          ? "Commercial Building"
                          : "";

                const outBal = `${loanType}_Sub Total_Outstanding Balance`;
                const colVal = `${loanType}_Collateral Value`;
                const proHel = `${loanType}_Provision Held`;

                const outBalVal = getDirectCellValue(
                    worksheet.getRow(i).getCell("D")
                ).trim();
                const colValVal = getDirectCellValue(
                    worksheet.getRow(i).getCell("G")
                ).trim();
                const proHelVal = getDirectCellValue(
                    worksheet.getRow(i).getCell("H")
                ).trim();

                const avInOutBal = itemMap.get(outBal);
                const avInColVal = itemMap.get(colVal);
                const avInProHel = itemMap.get(proHel);

                if (avInOutBal && avInOutBal.length > 0) {
                    const itemIndex = avInOutBal.shift();
                    json.ReturnItemsList[itemIndex].Value = parseFloat(
                        outBalVal || "0"
                    );
                } else {
                    console.warn(
                        `Warning: Key '${outBal}' has no remaining unused entries in template.json row ${i}`
                    );
                }

                if (avInColVal && avInColVal.length > 0) {
                    const itemIndex = avInColVal.shift();
                    json.ReturnItemsList[itemIndex].Value = parseFloat(
                        colValVal || "0"
                    );
                } else {
                    console.warn(
                        `Warning: Key '${colVal}' has no remaining unused entries in template.json row ${i}`
                    );
                }

                if (avInProHel && avInProHel.length > 0) {
                    const itemIndex = avInProHel.shift();
                    json.ReturnItemsList[itemIndex].Value = parseFloat(
                        proHelVal || "0"
                    );
                } else {
                    console.warn(
                        `Warning: Key '${proHel}' has no remaining unused entries in template.json row ${i}`
                    );
                }
            } else if (["3", "4", "5", "6", "7"].includes(ind)) {
                startIndex = i;

                let loanType = "";
                switch (ind) {
                    case "3":
                        loanType = "Residential building(total)";
                        break;
                    case "4":
                        loanType = "Sub Grand total(1+2+3)";
                        break;
                    case "5":
                        loanType = "Other construction sector(total)";
                        break;
                    case "6":
                        loanType = "Total construction loans(4+5)";
                        break;
                    case "7":
                        loanType = "Total loans & advance and Bonds";
                        break;
                    default:
                        break;
                }

                const outBal = `${loanType}_Outstanding Balance`;
                const colVal = `${loanType}_Collateral Value`;
                const proHel = `${loanType}_Provision Held`;

                const outBalVal = getDirectCellValue(
                    worksheet.getRow(i).getCell("D")
                ).trim();
                const colValVal = getDirectCellValue(
                    worksheet.getRow(i).getCell("G")
                ).trim();
                const proHelVal = getDirectCellValue(
                    worksheet.getRow(i).getCell("H")
                ).trim();

                const avInOutBal = itemMap.get(outBal);
                const avInColVal = itemMap.get(colVal);
                const avInProHel = itemMap.get(proHel);

                if (avInOutBal && avInOutBal.length > 0) {
                    const itemIndex = avInOutBal.shift();
                    json.ReturnItemsList[itemIndex].Value = parseFloat(
                        outBalVal || "0"
                    );
                } else {
                    console.warn(
                        `Warning: Key '${outBal}' has no remaining unused entries in template.json row ${i}`
                    );
                }

                if (avInColVal && avInColVal.length > 0) {
                    const itemIndex = avInColVal.shift();
                    json.ReturnItemsList[itemIndex].Value = parseFloat(
                        colValVal || "0"
                    );
                } else {
                    console.warn(
                        `Warning: Key '${outBal}' has no remaining unused entries in template.json row ${i}`
                    );
                }

                if (avInProHel && avInProHel.length > 0) {
                    const itemIndex = avInProHel.shift();
                    json.ReturnItemsList[itemIndex].Value = parseFloat(
                        proHelVal || "0"
                    );
                } else {
                    console.warn(
                        `Warning: Key '${outBal}' has no remaining unused entries in template.json row ${i}`
                    );
                }
            }

            if (ind === "7") break;
            prevInd = ind;
        }

        const jsonString = JSON.stringify(json, null, 2);
        await writeFile(outputJsonPath, jsonString, "utf8");

        // await toExcel(outputJsonPath, outputExcelPath);

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
        const filePath = path.join(templateDir, "XW002.xlsx");
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
