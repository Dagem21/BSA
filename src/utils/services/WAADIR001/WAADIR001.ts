import { WAADIR001 } from "@/generated/prisma";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { jsonFormat } from "./jsonFormat";
import { generateFileName } from "@/utils/generateFileName";

export async function populateWAADIR001Report(
    intCode: string,
    rowsData: WAADIR001[],
    startDate: Date,
    endDate: Date
): Promise<any> {
    try {
        const fileName = generateFileName();

        const fileNameExcel = `${fileName}.xlsx`;
        const fileNameJson = `${fileName}.json`;

        const rootDir = process.cwd();
        const templatePath = path.join(rootDir, "templates", "ADIR001.xlsx");

        const outputDirExcel = path.join(rootDir, "reports", "excel");
        const outputPathExcel = path.join(outputDirExcel, fileNameExcel);

        const outputDirJson = path.join(rootDir, "reports", "json");
        const outputPathJson = path.join(outputDirJson, fileNameJson);

        if (!fs.existsSync(outputDirExcel)) {
            fs.mkdirSync(outputDirExcel, { recursive: true });
        }

        if (!fs.existsSync(outputDirJson)) {
            fs.mkdirSync(outputDirJson, { recursive: true });
        }

        await generateExcel(
            intCode,
            startDate.getFullYear(),
            startDate.toISOString(),
            endDate.toISOString(),
            rowsData,
            templatePath,
            outputPathExcel
        );

        generateJson(
            intCode,
            startDate.getFullYear(),
            startDate.toISOString(),
            endDate.toISOString(),
            rowsData,
            outputPathJson
        );

        return { created: true, fileNameExcel, fileNameJson };
    } catch (error) {
        console.error("Error populating open position report:", error);
        return { created: false };
    }
}

async function generateExcel(
    instCode: string,
    finYear: number,
    startDate: string,
    endDate: string,
    rowsData: WAADIR001[],
    templatePath: string,
    outputPathExcel: string
): Promise<boolean> {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet("WADIR");
        if (!worksheet) {
            throw new Error("Sheet 'Open Position' not found in the template.");
        }

        let excelRow = 11;

        for (const row of rowsData ?? []) {
            const cellA = worksheet.getCell(`A${excelRow}`);
            const cellB = worksheet.getCell(`B${excelRow}`);
            const cellC = worksheet.getCell(`C${excelRow}`);
            const cellD = worksheet.getCell(`D${excelRow}`);
            const cellE = worksheet.getCell(`E${excelRow}`);
            const cellF = worksheet.getCell(`F${excelRow}`);
            const cellG = worksheet.getCell(`G${excelRow}`);
            const cellH = worksheet.getCell(`H${excelRow}`);

            let depositType = "";
            switch (row.TYPE) {
                case "FIXED":
                    depositType = "Time Deposit";
                    break;
                case "DEMAND":
                    depositType = "Demand Deposit";
                    break;
                case "SAVING":
                    depositType = "Saving Deposit";
                    break;
                default:
                    break;
            }

            cellA.value = depositType?.toString() || "";
            cellB.value = row.OWNERSHIP_DESC?.toString() || "";
            cellC.value = row?.BALANCE
                ? parseFloat(row.BALANCE?.toString())
                : "";
            cellD.value = row?.NUMBERS
                ? parseFloat(row.NUMBERS?.toString())
                : "";
            cellE.value = row?.MINIMUM_RATE
                ? parseFloat(row.MINIMUM_RATE?.toString())
                : "";
            cellF.value = row?.MINIMUM_RATE
                ? parseFloat(row.MINIMUM_RATE?.toString())
                : "";
            cellG.value = row?.WEIGHED_AVERAGE
                ? parseFloat(row.WEIGHED_AVERAGE?.toString())
                : "";
            cellH.value = row?.WEIGHT_BY_TYPE
                ? parseFloat(row.WEIGHT_BY_TYPE.toString())
                : "";

            excelRow++;
        }

        // 3. Populate metadata cells
        worksheet.getCell("B5").value = instCode;
        worksheet.getCell("B6").value = finYear.toString();
        worksheet.getCell("B7").value = startDate;
        worksheet.getCell("B8").value = endDate;

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputPathExcel);

        return true;
    } catch (error: any) {
        console.error("Error generating single currency Excel:", error.message);
        return false;
    }
}

function generateJson(
    instCode: string,
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: WAADIR001[],
    outputPathJson: string
): boolean {
    const jsonPayload = jsonFormat(
        "WAADIR001",
        instCode,
        finYear,
        startDate,
        endDate,
        rowsData
    );
    const fs = require("fs");

    const jsonString = JSON.stringify(jsonPayload, null, 2);

    fs.writeFile(outputPathJson, jsonString, "utf8", (err: any) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("JSON file written successfully!");
    });

    return true;
}
