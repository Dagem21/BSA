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
            "0000001",
            startDate.getFullYear(),
            startDate.toISOString(),
            endDate.toISOString(),
            rowsData,
            templatePath,
            outputPathExcel
        );

        generateSingleCurrencyJson(
            "0000001",
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
    instCode: string = "0000001",
    finYear: number,
    startDate: string,
    endDate: string,
    rowsData: OpenPosition[],
    templatePath: string,
    outputPathExcel: string
): Promise<boolean> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet("Open Position");
    if (!worksheet) {
        throw new Error("Sheet 'Open Position' not found in the template.");
    }

    rowsData.forEach((row, index) => {
        const excelRowNumber = 16 + index;

        if (FORMULA_ROWS.has(excelRowNumber)) {
            return;
        }

        const normalizedRow: Record<string, unknown> = {};
        Object.keys(row).forEach((key) => {
            normalizedRow[key.toUpperCase().trim()] = (
                row as Record<string, unknown>
            )[key];
        });

        Object.entries(CURRENCY_MAP).forEach(([currencyCode, colLetter]) => {
            const val = normalizedRow[currencyCode];

            if (val !== undefined && val !== null && val !== "") {
                const numValue = Number(val);
                if (!isNaN(numValue)) {
                    worksheet.getCell(`${colLetter}${excelRowNumber}`).value =
                        numValue;
                }
            }
        });
    });

    workbook.calcProperties.fullCalcOnLoad = true;
    await workbook.xlsx.writeFile(outputPathExcel);

    return true;
}

function generateSingleCurrencyJson(
    instCode: string = "0000001",
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
