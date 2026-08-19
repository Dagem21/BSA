"use server";

import { OpenPosition } from "@/generated/prisma";
import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { OP001Format } from "./jsonFormat";
import { generateFileName } from "@/utils/generateFileName";

const CURRENCY_MAP: Record<string, string> = {
    USD: "C",
    EUR: "D",
    CHF: "E",
    GBP: "F",
    JPY: "G",
    DJF: "H",
    KES: "I",
    INR: "J",
    DKK: "K",
    SEK: "L",
    SAR: "M",
    CAD: "N",
    AED: "O",
    AUD: "P",
    CNY: "Q",
    NOK: "R",
    KWD: "S",
    SSP: "T",
    OVERALL_EXPOSURE: "W"
};

/** Excel template rows that store dynamic formulas (DO NOT OVERWRITE) */
const FORMULA_ROWS: ReadonlySet<number> = new Set([
    17, 24, 29, 31, 37, 44, 46, 47, 49, 50, 51, 52, 54, 55, 56, 58, 59
]);

export async function populateOpenPositionReport(
    intCode: string,
    rowsData: OpenPosition[],
    startDate: Date,
    endDate: Date
): Promise<any> {
    try {
        const fileName = generateFileName();

        const fileNameExcel = `${fileName}.xlsx`;
        const fileNameJson = `${fileName}.json`;

        const rootDir = process.cwd();
        const templatePath = path.join(rootDir, "templates", "OP001.xlsx");

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

        await generateSingleCurrencyExcel(
            intCode,
            startDate.getFullYear(),
            startDate.toISOString(),
            endDate.toISOString(),
            rowsData,
            templatePath,
            outputPathExcel
        );

        generateSingleCurrencyJson(
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

async function generateSingleCurrencyExcel(
    instCode: string,
    finYear: number,
    startDate: string,
    endDate: string,
    rowsData: OpenPosition[],
    templatePath: string,
    outputPathExcel: string
): Promise<boolean> {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet("Open Position");
        if (!worksheet) {
            throw new Error("Sheet 'Open Position' not found in the template.");
        }

        // 1. Pre-index rowsData by normalized ORDER_NUM for O(1) lookups
        const dataMap = new Map<string, OpenPosition>();
        for (const row of rowsData ?? []) {
            if (row.ORDER_NUM != null) {
                const key = row.ORDER_NUM.toString().replaceAll(".", "");
                dataMap.set(key, row);
            }
        }

        // 2. Iterate row range directly (17 to 58)
        for (let excelRowNumber = 17; excelRowNumber < 59; excelRowNumber++) {
            if (FORMULA_ROWS.has(excelRowNumber)) {
                continue;
            }

            const cellVal = worksheet.getCell(`A${excelRowNumber}`).value;
            if (!cellVal) continue;

            const wsIndex = cellVal.toString().replaceAll(".", "");
            const record = dataMap.get(wsIndex);

            if (record) {
                for (const [field, val] of Object.entries(record)) {
                    const column = CURRENCY_MAP[field.toUpperCase()];
                    if (!column) continue;

                    const cell = worksheet.getCell(
                        `${column}${excelRowNumber}`
                    );
                    cell.value = parseFloat(val?.toString() || "0") ?? null;
                }
            }
        }

        // 3. Populate metadata cells
        worksheet.getCell("C8").value = instCode;
        worksheet.getCell("C9").value = finYear.toString();
        worksheet.getCell("C10").value = startDate;
        worksheet.getCell("C11").value = endDate;

        workbook.calcProperties.fullCalcOnLoad = true;
        await workbook.xlsx.writeFile(outputPathExcel);

        return true;
    } catch (error) {
        console.error("Error generating single currency Excel:", error);
        return false;
    }
}

function generateSingleCurrencyJson(
    instCode: string,
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: OpenPosition[],
    outputPathJson: string
): boolean {
    const jsonPayload = OP001Format(
        "SINGLE CURRENCYOP001",
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
