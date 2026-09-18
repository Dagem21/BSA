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
const { processCM002 } = require("@/utils/services/CM002/CM002");
const { processIF002 } = require("@/utils/services/IF002/IF002");
const { processLC001 } = require("@/utils/services/LC001/LC001");
const { processLCMWAC001 } = require("@/utils/services/MWAC001/MWAC001");
const { processRD002 } = require("@/utils/services/RD002/RD002");
const { processRS002 } = require("@/utils/services/RS002/RS002");
const { processZZ002 } = require("@/utils/services/ZZ002/ZZ002");

function sanitizeJsonPayload(payload: any) {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => ({
            ...item,
            Value: (item.Value === null || item.Value === undefined || String(item.Value).trim() === "") ? "0" : String(item.Value).trim()
        }));
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const val = subItem.Value;
                    const isZero = val === null || val === undefined || String(val).trim() === "";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (val === null || val === undefined ? "" : String(val).trim())
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    const val = entry[k];
                    if (val === null || val === undefined || String(val).trim() === "") {
                        entry[k] = "0";
                    } else {
                        entry[k] = String(val).trim();
                    }
                });
            }
            return entry;
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
        } else if (requestedType.includes("WAADIR001") || requestedType.includes("ADIR001")) {
            jsonPayload = processWAADIR001 ? processWAADIR001(worksheet) : null;
        } else if (requestedType.includes("CM002") || requestedType.includes("CDby Range")) {
            jsonPayload = processCM002 ? processCM002(worksheet) : null;
        } else if (requestedType.includes("ZZ002") || requestedType.includes("IFB_LON_S")) {
            jsonPayload = processZZ002 ? processZZ002(worksheet) : null;
        } else if (requestedType.includes("RS002") || requestedType.includes("LOAN_SEC")) {
            jsonPayload = processRS002 ? processRS002(worksheet) : null;
        } else if (requestedType.includes("IF002") || requestedType.includes("DIFIF002")) {
            jsonPayload = processIF002 ? processIF002(worksheet) : null;
        } else if (requestedType.includes("RD002") || requestedType.includes("DIR RANGE")) {
            jsonPayload = processRD002 ? processRD002(worksheet) : null;
        } else if (requestedType.includes("LC001") || requestedType.includes("M_LCPLC001")) {
            jsonPayload = processLC001 ? processLC001(worksheet) : null;
        } else if (requestedType.includes("LCMWAC001") || requestedType.includes("MWAC001")) {
            jsonPayload = processLCMWAC001 ? processLCMWAC001(worksheet) : null;
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
