import { SE002 } from "@/generated/prisma";
import * as path from "path";
import * as fs from "fs";
import { jsonFormat } from "./jsonFormat";
import { generateFileName } from "@/utils/generateFileName";
import { toExcel } from "../../SE002/SE002";

export async function populateSE002Report(
    intCode: string,
    rowsData: SE002[],
    startDate: Date,
    endDate: Date,
    reportTypeID: string
): Promise<any> {
    try {
        const fileName = generateFileName(reportTypeID);

        const fileNameExcel = `${fileName}.xlsx`;
        const fileNameJson = `${fileName}.json`;

        const rootDir = process.cwd();

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

        await generateJson(
            intCode,
            startDate.getFullYear(),
            startDate.toISOString(),
            endDate.toISOString(),
            rowsData,
            outputPathJson
        );

        await toExcel(outputPathJson, outputPathExcel);

        return { created: true, fileNameExcel, fileNameJson };
    } catch (error) {
        console.error("Error populating SE002 report:", error);
        return { created: false };
    }
}

async function generateJson(
    instCode: string,
    finYear: number,
    startDate: string,
    endDate: string,
    rowsData: SE002[],
    outputPathJson: string
): Promise<boolean> {
    const jsonPayload = await jsonFormat(
        "LOAN_SEC&REG_SE002",
        instCode,
        finYear,
        startDate,
        endDate,
        rowsData
    );
    console.log(jsonPayload);
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
