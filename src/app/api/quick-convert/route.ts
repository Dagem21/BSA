import { NextRequest } from "next/server";
import * as path from "path";
import * as fs from "fs";
import { writeFile, unlink } from "fs/promises";
const ExcelJS = require("exceljs");

// Import standalone converter engines from services
const { processLP001 } = require("@/utils/services/LP001/LP001");
const { processLL001 } = require("@/utils/services/LL001/LL001");
const { processNL001 } = require("@/utils/services/NL001/NL001");
const { processWAADIR001 } = require("@/utils/services/WAADIR001/WAADIR001");
const { processGS001 } = require("@/utils/services/GS001/GS001");
const { processDR002 } = require("@/utils/services/DR002/DR002");
const { processDS003 } = require("@/utils/services/DS003/DS003");
const { processID002 } = require("@/utils/services/ID002/ID002");
const { processRI003 } = require("@/utils/services/RI003/RI003");

function sanitizeJsonPayload(payload: any) {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => ({
            ...item,
            Value: (item.Value === null || item.Value === undefined || String(item.Value).trim() === "") ? "0" : String(item.Value).trim()
        }));
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((row: any) => {
            if (row && typeof row === "object") {
                Object.keys(row).forEach((k) => {
                    if (row[k] === null || row[k] === undefined || String(row[k]).trim() === "") {
                        row[k] = "0";
                    } else {
                        row[k] = String(row[k]).trim();
                    }
                });
            }
            return row;
        });
    }
    return payload;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const requestedType = (formData.get("reportType") as string) || "LP001";

        if (!file) {
            return new Response(
                JSON.stringify({ error: "No Excel file provided." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const timestamp = Date.now();
        const ext = path.extname(file.name) || ".xlsx";
        const tempExcelName = `temp_${timestamp}${ext}`;

        const rootDir = process.cwd();
        const excelDir = path.join(rootDir, "reports", "excel");
        if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });

        const excelPath = path.join(excelDir, tempExcelName);
        const bytes = await file.arrayBuffer();
        await writeFile(excelPath, Buffer.from(bytes));

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(excelPath);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            await unlink(excelPath).catch(() => {});
            return new Response(
                JSON.stringify({ error: "No valid worksheet found in uploaded file." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        let jsonPayload: any = null;

        if (requestedType.includes("LL001")) {
            jsonPayload = processLL001 ? processLL001(worksheet) : null;
        } else if (requestedType.includes("NL001")) {
            jsonPayload = processNL001 ? processNL001(worksheet) : null;
        } else if (requestedType.includes("WAADIR001")) {
            jsonPayload = processWAADIR001 ? processWAADIR001(worksheet) : null;
        } else if (requestedType.includes("GS001")) {
            jsonPayload = processGS001 ? processGS001(worksheet) : null;
        } else if (requestedType.includes("DR002")) {
            jsonPayload = processDR002 ? processDR002(worksheet) : null;
        } else if (requestedType.includes("DS003")) {
            jsonPayload = processDS003 ? processDS003(worksheet) : null;
        } else if (requestedType.includes("ID002") || requestedType.includes("INT_FRE_RAN")) {
            jsonPayload = processID002 ? processID002(worksheet) : null;
        } else if (requestedType.includes("RI003") || requestedType.includes("INT_FRE_SEC")) {
            jsonPayload = processRI003 ? processRI003(worksheet) : null;
        } else {
            jsonPayload = processLP001 ? processLP001(worksheet) : null;
        }

        jsonPayload = sanitizeJsonPayload(jsonPayload);

        // Cleanup temporary file
        try {
            await unlink(excelPath);
        } catch (_) {}

        return new Response(
            JSON.stringify({
                success: true,
                filename: file.name.replace(/\.[^/.]+$/, "") + ".json",
                jsonPayload
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        console.error("Quick convert error:", err);
        return new Response(
            JSON.stringify({ error: err.message || "Server error during conversion." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
