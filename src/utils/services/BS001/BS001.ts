import ExcelJS from "exceljs";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const codeIndex = [
    "1_00001",
    "1_00002",
    "1_00003",
    "1_00004",
    "1_00005",
    "1_00006",
    "1_00007",
    "1_00008",
    "1_00009",
    "1_00010",
    "1_00011",
    "1_00012",
    "1_00013",
    "1_00014",
    "1_00015",
    "1_00016",
    "1_00017",
    "1_00018",
    "1_00019",
    "1_00020",
    "1_00021",
    "1_00022",
    "1_00023",
    "1_00024",
    "1_00025",
    "1_00026",
    "1_00027",
    "1_00028",
    "1_00029",
    "1_00030",
    "1_00031",
    "1_00032",
    "1_00033",
    "1_00034",
    "1_00035",
    "1_00036",
    "1_00037",
    "1_00038",
    "1_00039",
    "1_00040",
    "1_00041",
    "1_00042",
    "1_00043",
    "1_00044",
    "1_00045",
    "1_00046",
    "1_00047",
    "1_00048",
    "1_00049",
    "1_00050",
    "1_00051",
    "1_00052",
    "1_00053",
    "1_00054",
    "1_00055",
    "1_00056",
    "1_00057",
    "1_00058",
    "1_00059",
    "1_00060",
    "1_00061",
    "1_00062",
    "1_00063",
    "1_00064",
    "1_00065",
    "1_00066",
    "1_00067",
    "1_00068",
    "1_00069",
    "1_00070",
    "1_00071",
    "1_00072",
    "1_00073",
    "1_00074",
    "1_00075",
    "1_00076",
    "1_00077",
    "1_00078",
    "1_00079",
    "1_00080",
    "1_00081",
    "1_00082",
    "1_00083",
    "1_00084",
    "1_00085",
    "1_00086",
    "1_00087",
    "1_00088",
    "1_00089",
    "1_00090",
    "1_00091",
    "1_00092",
    "1_00093",
    "1_00094",
    "1_00095",
    "1_00096",
    "1_00097",
    "1_00098",
    "1_00099",
    "1_00100",
    "1_00101",
    "1_00102",
    "1_00103",
    "1_00104",
    "1_00105",
    "1_00106",
    "1_00107",
    "1_00108",
    "1_00109",
    "1_00110",
    "1_00111",
    "1_00112",
    "1_00113",
    "1_00114",
    "1_00115",
    "1_00116",
    "1_00117",
    "1_00118",
    "1_00119",
    "1_00120",
    "1_00121",
    "1_00122",
    "1_00123",
    "1_00124",
    "1_00125",
    "1_00126",
    "1_00127",
    "1_00128",
    "1_00129",
    "1_00130",
    "1_00131",
    "1_00132",
    "1_00133",
    "1_00134",
    "1_00135",
    "1_00151",
    "1_00136",
    "1_00137",
    "1_00138",
    "1_00139",
    "1_00140",
    "1_00141",
    "1_00142",
    "1_00143",
    "1_00144",
    "1_00145",
    "1_00146",
    "1_00147",
    "1_00148",
    "1_00149",
    "1_00150"
];

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

export async function processBS001Report(
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

        const worksheet = workbook.getWorksheet("BAL_SHEET_BS001");
        if (!worksheet) {
            throw new Error(
                "Sheet 'BAL_SHEET_BS001' not found in the template."
            );
        }

        const templateDir = path.join(process.cwd(), "templates", "json");
        const filePath = path.join(templateDir, "./BS001.json");
        const data = await readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        // Extract raw cell values instead of cell objects
        json.InstCode = getDirectCellValue(
            worksheet.getRow(8).getCell("C")
        ).padStart(7, "0");
        json.FinYear = getDirectCellValue(worksheet.getRow(9).getCell("C"));
        json.StartDate = getDirectCellValue(worksheet.getRow(10).getCell("C"));
        json.EndDate = getDirectCellValue(worksheet.getRow(11).getCell("C"));

        for (let i = 17; i < 168; i++) {
            const value = getDirectCellValue(worksheet.getRow(i).getCell("C"));

            const code = codeIndex[i - 17];

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
        const filePath = path.join(templateDir, "BS001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet("BAL_SHEET_BS001");
        if (!worksheet) {
            throw new Error(
                "Sheet 'BAL_SHEET_BS001' not found in the template."
            );
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

        for (let i = 17; i < 168; i++) {
            if (formulas.includes(i)) continue;
            const code = codeIndex[i - 17];

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
