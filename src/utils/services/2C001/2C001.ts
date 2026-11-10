// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import {
    C2001_ITEM_DEFINITIONS,
    C2001_CELL_MAPPING,
    C2001JsonData,
    DynamicAreaEntry
} from "./jsonFormat";

function formatIsoString(dateVal: any): string {
    if (!dateVal) return "";
    if (dateVal instanceof Date) {
        if (isNaN(dateVal.getTime())) return "";
        const yyyy = dateVal.getFullYear();
        const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
        const dd = String(dateVal.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    const str = String(dateVal).trim();
    if (str.includes("T")) return str;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T00:00:00`;
    }
    return str;
}

export function getDirectCellValue(cell: any): string {
    if (!cell || cell === null || cell === undefined) return "";
    let val = cell;
    if (cell && typeof cell === "object" && "value" in cell && ("type" in cell || "address" in cell || "worksheet" in cell)) {
        val = cell.value;
    }
    if (val === null || val === undefined) {
        if (cell && typeof cell === "object") {
            if (cell.result !== undefined && cell.result !== null) {
                if (typeof cell.result === "object" && "error" in cell.result) return "";
                return String(cell.result).trim();
            }
            if (cell.text !== undefined && cell.text !== null) {
                return String(cell.text).trim();
            }
        }
        return "";
    }
    if (typeof val === "number") return String(val);
    if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "[object Object]") return "";
        return trimmed;
    }
    if (Array.isArray(val)) {
        return val.map((item: any) => {
            if (!item) return "";
            if (typeof item === "string") return item;
            if (typeof item === "object") {
                if ("text" in item && item.text) return item.text;
                if ("result" in item && item.result !== undefined && item.result !== null) return String(item.result);
            }
            return "";
        }).join("").trim();
    }
    if (val instanceof Date) {
        return formatIsoString(val);
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && val.result !== null && "error" in val.result) return "";
            if (typeof val.result === "number") return String(val.result);
            if (typeof val.result === "string") {
                const s = val.result.trim();
                return s === "[object Object]" ? "" : s;
            }
            if (Array.isArray(val.result)) {
                return val.result.map((item: any) => (item && typeof item === "object" && "text" in item ? item.text : String(item))).join("").trim();
            }
            if (val.result instanceof Date) {
                return formatIsoString(val.result);
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t: any) => (t && t.text ? t.text : "")).join("").trim();
        }
        if ("text" in val && val.text) return String(val.text).trim();
        if (cell && cell.result !== undefined && cell.result !== null) {
            if (typeof cell.result === "object" && "error" in cell.result) return "";
            return String(cell.result).trim();
        }
        if (cell && cell.text !== undefined && cell.text !== null) return String(cell.text).trim();
        return "";
    }
    return "";
}

export function process2C001(
    worksheet: ExcelJS.Worksheet,
    instCodeArg?: string,
    startDateArg?: string,
    endDateArg?: string
): C2001JsonData {
    // 1. Read metadata block from worksheet
    let instCode = instCodeArg || getDirectCellValue(worksheet.getCell("C8")) || "0000001";
    if (/^\d+$/.test(instCode)) {
        instCode = instCode.padStart(7, "0");
    }

    const finYearRaw = getDirectCellValue(worksheet.getCell("C9"));
    const finYear = finYearRaw ? (parseInt(finYearRaw, 10) || 2026) : 2026;

    const startDateRaw = getDirectCellValue(worksheet.getCell("C10"));
    const startDate = startDateRaw ? formatIsoString(startDateRaw) : (startDateArg ? formatIsoString(startDateArg) : "2026-07-01T00:00:00");

    const endDateRaw = getDirectCellValue(worksheet.getCell("C11"));
    const endDate = endDateRaw ? formatIsoString(endDateRaw) : (endDateArg ? formatIsoString(endDateArg) : "2026-09-30T00:00:00");

    // 2. Read fixed return items using C2001_CELL_MAPPING
    const itemsMap: Record<string, string> = {};
    for (const m of C2001_CELL_MAPPING) {
        const cell = worksheet.getRow(m.row).getCell(m.col);
        const cellVal = getDirectCellValue(cell);
        itemsMap[m.code] = cellVal;
    }

    const returnItemsList = C2001_ITEM_DEFINITIONS.map(def => ({
        Code: def.code,
        Value: itemsMap[def.code] !== undefined ? itemsMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    // 3. Read dynamic items for Area 200 (Off-Balance Sheet Risk Weighted Assets)
    // In template rows: 10 categories, each having 10 rows:
    // Category 1: 123-132, Category 2: 134-143, Category 3: 145-154, Category 4: 156-165, Category 5: 167-176,
    // Category 6: 178-187, Category 7: 189-198, Category 8: 200-209, Category 9: 211-220, Category 10: 222-231
    const obsRowRanges: Array<[number, number]> = [
        [123, 132], [134, 143], [145, 154], [156, 165], [167, 176],
        [178, 187], [189, 198], [200, 209], [211, 220], [222, 231]
    ];

    const dynamicItemsList: DynamicAreaEntry[] = [];

    for (const [rStart, rEnd] of obsRowRanges) {
        for (let r = rStart; r <= rEnd; r++) {
            const row = worksheet.getRow(r);
            const snVal = getDirectCellValue(row.getCell("A"));
            const descVal = getDirectCellValue(row.getCell("B"));
            const valC = getDirectCellValue(row.getCell("C"));
            const valD = getDirectCellValue(row.getCell("D"));
            const valE = getDirectCellValue(row.getCell("E"));
            const valF = getDirectCellValue(row.getCell("F"));
            const valG = getDirectCellValue(row.getCell("G"));
            const valH = getDirectCellValue(row.getCell("H"));
            const valI = getDirectCellValue(row.getCell("I"));

            // If there is any value in the row
            const hasData = [descVal, valC, valD, valE, valF, valG, valH, valI].some(v => v !== "" && v !== "0");
            if (hasData || snVal) {
                dynamicItemsList.push({
                    Area: 200,
                    _areaName: "1_Off-Balance Sheet Risk Weighted Assets",
                    DynamicItems: [
                        { Code: "1.1", Value: descVal || snVal || "", _description: "Off-balance sheet items (non-market)", _dataType: "TEXT", _required: true },
                        { Code: "1.2", Value: valC, _description: "Total off- balance sheet exposure (Face Value)", _dataType: "NUMERIC", _required: false },
                        { Code: "1.3", Value: valD, _description: "RW of the counterparty_(A)", _dataType: "NUMERIC", _required: false },
                        { Code: "1.4", Value: valE, _description: "Exposures Without CRM_Off-bal. sheet Exposure before CCF_(B)", _dataType: "NUMERIC", _required: false },
                        { Code: "1.5", Value: valF, _description: "Exposures Without CRM_Credit Equivalent Exposure_C=B*CCF", _dataType: "NUMERIC", _required: false },
                        { Code: "1.6", Value: valG, _description: "CRM Exposure Coverage (D)", _dataType: "NUMERIC", _required: false },
                        { Code: "1.7", Value: valH, _description: "Credit Equivalent Exposure with_CRM E=D*CCF", _dataType: "NUMERIC", _required: false },
                        { Code: "1.8", Value: valI, _description: "RWA F=(C+E)*A/100", _dataType: "NUMERIC", _required: false }
                    ]
                });
            }
        }
    }

    // 4. Read dynamic items for Area 201 (Security Financing Transactions - SFT)
    // Rows 271 to 290
    for (let r = 271; r <= 290; r++) {
        const row = worksheet.getRow(r);
        const valA = getDirectCellValue(row.getCell("A"));
        const valB = getDirectCellValue(row.getCell("B"));
        const valC = getDirectCellValue(row.getCell("C"));
        const valD = getDirectCellValue(row.getCell("D"));
        const valE = getDirectCellValue(row.getCell("E"));
        const valF = getDirectCellValue(row.getCell("F"));

        const hasData = [valB, valC, valD, valE, valF].some(v => v !== "" && v !== "0");
        if (hasData || (valA && valA.startsWith("SFT"))) {
            dynamicItemsList.push({
                Area: 201,
                _areaName: "Risk Weighted Assets for Security Financing Transactions (SFT)",
                DynamicItems: [
                    { Code: "1.1", Value: valA || `SFT ${r - 270}`, _description: "SFT", _dataType: "TEXT", _required: true },
                    { Code: "1.2", Value: valB, _description: "E = Current value of exposure (A)", _dataType: "NUMERIC", _required: false },
                    { Code: "1.3", Value: valC, _description: "C = Collateral (B)", _dataType: "NUMERIC", _required: false },
                    { Code: "1.4", Value: valD, _description: "HFX = 0.08, if C and E in different currencies, else 0 (C)", _dataType: "NUMERIC", _required: false },
                    { Code: "1.5", Value: valE, _description: "RW of the counterparty (D)", _dataType: "NUMERIC", _required: false },
                    { Code: "1.6", Value: valF, _description: "RWA E=Max {0;1.15*A –(0.85 -C)*B}*D", _dataType: "NUMERIC", _required: false }
                ]
            });
        }
    }

    return {
        ReturnKey: "QCR2C001",
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: dynamicItemsList
    };
}

export async function jsonToExcel2C001(
    jsonPayload: any,
    outputExcelPath?: string
): Promise<ExcelJS.Workbook> {
    const templatePath = path.join(process.cwd(), "templates", "2C001.xlsx");
    const workbook = new ExcelJS.Workbook();

    if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
    } else {
        workbook.addWorksheet("2. Credit Risk");
    }

    let worksheet =
        workbook.getWorksheet("2. Credit Risk") ||
        workbook.worksheets.find(ws => ws.name.toUpperCase().includes("CREDIT RISK")) ||
        workbook.worksheets[0];

    if (!worksheet) {
        worksheet = workbook.addWorksheet("2. Credit Risk");
    }

    // 1. Populate metadata
    if (jsonPayload.ReturnKey) worksheet.getCell("A1").value = jsonPayload.ReturnKey;
    if (jsonPayload.InstCode) worksheet.getCell("C8").value = jsonPayload.InstCode;
    if (jsonPayload.FinYear) worksheet.getCell("C9").value = Number(jsonPayload.FinYear);
    if (jsonPayload.StartDate) worksheet.getCell("C10").value = jsonPayload.StartDate;
    if (jsonPayload.EndDate) worksheet.getCell("C11").value = jsonPayload.EndDate;

    // Helper to safely set cell value without overwriting formulas or breaking shared formula ranges
    const safeSet = (cellOrAddress: any, rawVal: any) => {
        if (rawVal === undefined || rawVal === null || rawVal === "") return;
        const cell = typeof cellOrAddress === "string" ? worksheet.getCell(cellOrAddress) : cellOrAddress;
        if (
            cell.type === ExcelJS.ValueType.Formula ||
            (cell.value && typeof cell.value === "object" && ("formula" in cell.value || "sharedFormula" in cell.value))
        ) {
            return;
        }
        const num = parseFloat(rawVal);
        cell.value = isNaN(num) ? rawVal : num;
    };

    // 2. Populate fixed return items
    const itemsMap: Record<string, string> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach((itm: any) => {
            if (itm && itm.Code) {
                itemsMap[itm.Code] = itm.Value !== undefined && itm.Value !== null ? String(itm.Value) : "";
            }
        });
    }

    for (const m of C2001_CELL_MAPPING) {
        safeSet(`${m.col}${m.row}`, itemsMap[m.code]);
    }

    // 3. Populate dynamic items if present
    if (Array.isArray(jsonPayload.DynamicItemsList)) {
        let area200RowIdx = 0;
        const obsRowRanges: Array<[number, number]> = [
            [123, 132], [134, 143], [145, 154], [156, 165], [167, 176],
            [178, 187], [189, 198], [200, 209], [211, 220], [222, 231]
        ];
        const flatArea200Rows: number[] = [];
        for (const [s, e] of obsRowRanges) {
            for (let r = s; r <= e; r++) flatArea200Rows.push(r);
        }

        let sftRowIdx = 271;

        jsonPayload.DynamicItemsList.forEach((entry: any) => {
            if (!entry || !Array.isArray(entry.DynamicItems)) return;
            const subMap: Record<string, string> = {};
            entry.DynamicItems.forEach((sub: any) => {
                if (sub && sub.Code) subMap[sub.Code] = sub.Value || "";
            });

            if (entry.Area === 200 && area200RowIdx < flatArea200Rows.length) {
                const targetRow = flatArea200Rows[area200RowIdx++];
                const row = worksheet.getRow(targetRow);
                if (subMap["1.1"]) safeSet(row.getCell("B"), subMap["1.1"]);
                safeSet(row.getCell("C"), subMap["1.2"]);
                safeSet(row.getCell("D"), subMap["1.3"]);
                safeSet(row.getCell("E"), subMap["1.4"]);
                safeSet(row.getCell("F"), subMap["1.5"]);
                safeSet(row.getCell("G"), subMap["1.6"]);
                safeSet(row.getCell("H"), subMap["1.7"]);
                safeSet(row.getCell("I"), subMap["1.8"]);
            } else if (entry.Area === 201 && sftRowIdx <= 290) {
                const targetRow = sftRowIdx++;
                const row = worksheet.getRow(targetRow);
                if (subMap["1.1"]) safeSet(row.getCell("A"), subMap["1.1"]);
                safeSet(row.getCell("B"), subMap["1.2"]);
                safeSet(row.getCell("C"), subMap["1.3"]);
                safeSet(row.getCell("D"), subMap["1.4"]);
                safeSet(row.getCell("E"), subMap["1.5"]);
                safeSet(row.getCell("F"), subMap["1.6"]);
            }
        });
    }

    workbook.calcProperties.fullCalcOnLoad = true;

    if (outputExcelPath) {
        const dir = path.dirname(outputExcelPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        await workbook.xlsx.writeFile(outputExcelPath);
    }

    return workbook;
}

export function sanitizeJsonPayload(payload: any): any {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => {
            if (!item) return item;
            let val = item.Value;
            if (val && typeof val === "object") {
                val = getDirectCellValue(val);
            }
            const strVal = (val === null || val === undefined) ? "" : String(val).trim();
            const isZero = strVal === "" || strVal === "[object Object]";
            const { _required, ...rest } = item;
            return {
                ...rest,
                Value: isZero ? "0" : strVal
            };
        });
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    let val = subItem.Value;
                    if (val && typeof val === "object") {
                        val = getDirectCellValue(val);
                    }
                    const strVal = (val === null || val === undefined) ? "" : String(val).trim();
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && subItem.Code !== "1.1");
                    const isZero = strVal === "" || strVal === "[object Object]";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (isZero && !isNumeric ? "" : strVal)
                    };
                });
            }
            return entry;
        });
    }
    return payload;
}

export async function process2C001Report(
    instCode: string = "0000001",
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string; jsonPath?: string; excelPath?: string }> {
    try {
        if (!inputFilePath || !fs.existsSync(inputFilePath)) {
            return {
                success: false,
                error: `Input file '${inputFilePath}' not found.`
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);
        const worksheet =
            workbook.getWorksheet("2. Credit Risk") ||
            workbook.worksheets.find(ws => ws.name.toUpperCase().includes("CREDIT RISK")) ||
            workbook.worksheets[0];

        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const rawJson = process2C001(worksheet, instCode, startDateStr, endDateStr);
        const jsonPayload = sanitizeJsonPayload(rawJson);

        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputPathJson, JSON.stringify(jsonPayload, null, 4), "utf8");

        if (outputExcelPath) {
            const excelDir = path.dirname(outputExcelPath);
            if (!fs.existsSync(excelDir)) {
                fs.mkdirSync(excelDir, { recursive: true });
            }
            if (fs.existsSync(inputFilePath)) {
                fs.copyFileSync(inputFilePath, outputExcelPath);
            } else {
                await jsonToExcel2C001(jsonPayload, outputExcelPath);
            }
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing 2C001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process 2C001 report."
        };
    }
}
