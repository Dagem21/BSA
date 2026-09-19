// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

function getDirectCellValue(cell: any): string {
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
        if (isNaN(val.getTime())) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`;
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
                if (isNaN(val.result.getTime())) return "";
                const pad = (n: number) => String(n).padStart(2, "0");
                return `${val.result.getFullYear()}-${pad(val.result.getMonth() + 1)}-${pad(val.result.getDate())}`;
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

function sanitizeJsonPayload(payload: any): any {
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
            return {
                ...item,
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
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const isZero = strVal === "" || strVal === "[object Object]";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (isZero && !isNumeric ? "" : strVal)
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    let val = entry[k];
                    if (val && typeof val === "object") {
                        val = getDirectCellValue(val);
                    }
                    const strVal = (val === null || val === undefined) ? "" : String(val).trim();
                    if (strVal === "" || strVal === "[object Object]") {
                        entry[k] = "0";
                    } else {
                        entry[k] = strVal;
                    }
                });
            }
            return entry;
        });
    }
    return payload;
}

export const DL001_ITEM_DEFINITIONS = [
    { code: "161_00001", col: 2, description: "Total_ Disbursement", dataType: "NUMERIC", required: false },
    { code: "161_00002", col: 3, description: "Total_ Collection", dataType: "NUMERIC", required: false },
    { code: "161_00003", col: 4, description: "Total_ Outstanding", dataType: "NUMERIC", required: false },
    { code: "161_00004", col: 5, description: "Total_ # of Borrowers accounts", dataType: "NUMERIC", required: false },
    { code: "161_00005", col: 6, description: "Total_ # of Borrowers", dataType: "NUMERIC", required: false }
];

export function processDL001(worksheet: any, instCode?: string, startDate?: any, endDate?: any): any {
    const formatDateNoShift = (val: any, fallback: string): string => {
        if (!val) return fallback;
        if (val instanceof Date) {
            if (isNaN(val.getTime())) return fallback;
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T00:00:00`;
        }
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n: number) => String(n).padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
                }
            }
            if (trimmed.includes("T")) return trimmed.split(".")[0];
            if (trimmed.length >= 10) return `${trimmed.substring(0, 10)}T00:00:00`;
            return fallback;
        }
        return fallback;
    };

    let parsedInst = "";
    let parsedYear = "";
    let parsedStart: any = null;
    let parsedEnd: any = null;

    // Scan rows 5 to 12 for metadata labels
    for (let r = 5; r <= 12; r++) {
        const row = worksheet.getRow(r);
        const label = getDirectCellValue(row.getCell(1)).toLowerCase();
        const c2 = getDirectCellValue(row.getCell(2));
        const c3 = getDirectCellValue(row.getCell(3));
        const raw = c2 || c3;

        if (label.includes("inst") && (label.includes("code") || label.includes("tion"))) {
            if (raw) parsedInst = raw;
        } else if (label.includes("financial") || label.includes("year")) {
            if (raw) parsedYear = raw;
        } else if (label.includes("start") && label.includes("date")) {
            if (raw) parsedStart = raw;
        } else if (label.includes("end") && label.includes("date")) {
            if (raw) parsedEnd = raw;
        }
    }

    const finalInstCode = parsedInst || instCode || "0000001";
    const finalFinYear = parsedYear ? parseInt(parsedYear, 10) : 2026;
    const finalStartDate = formatDateNoShift(parsedStart || startDate, "2026-04-01T00:00:00");
    const finalEndDate = formatDateNoShift(parsedEnd || endDate, "2026-06-30T00:00:00");

    // Discover data row (look for "Total Digital Lending" or row 14)
    let dataRow = worksheet.getRow(14);
    for (let r = 13; r <= 16; r++) {
        const row = worksheet.getRow(r);
        const c1 = getDirectCellValue(row.getCell(1)).toLowerCase();
        if (c1.includes("total") || c1.includes("digital")) {
            dataRow = row;
            break;
        }
    }

    const returnItemsList = DL001_ITEM_DEFINITIONS.map(def => {
        const rawVal = getDirectCellValue(dataRow.getCell(def.col));
        const cleanVal = (rawVal === "" || rawVal === null || rawVal === undefined) ? "0" : rawVal;
        return {
            Code: def.code,
            Value: cleanVal,
            _description: def.description,
            _dataType: def.dataType,
            _required: def.required
        };
    });

    const payload = {
        ReturnKey: "DigitalLendingDL001",
        InstCode: finalInstCode,
        FinYear: finalFinYear,
        StartDate: finalStartDate,
        EndDate: finalEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };

    return sanitizeJsonPayload(payload);
}

export async function jsonToExcelDL001(jsonPayload: any): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Digital Lending");

    // Column widths
    sheet.getColumn(1).width = 24;
    sheet.getColumn(2).width = 20;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 18;
    sheet.getColumn(5).width = 26;
    sheet.getColumn(6).width = 18;

    // Row 1: ReturnKey
    sheet.getCell("A1").value = jsonPayload.ReturnKey || "DigitalLendingDL001";
    sheet.getCell("A1").font = { name: "Arial", size: 9 };

    // Rows 3-6: Title Banner (Merged A3:C6)
    sheet.mergeCells("A3:C6");
    const bannerCell = sheet.getCell("A3");
    bannerCell.value = "Quarterly Digital Lending Report";
    bannerCell.font = { name: "Arial", size: 15, bold: true, color: { argb: "FFFF0000" } };
    bannerCell.alignment = { vertical: "middle", horizontal: "left" };

    const pinkFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2DFDF" } };
    const purpleBorder = {
        top: { style: "medium", color: { argb: "FF7030A0" } },
        bottom: { style: "medium", color: { argb: "FF7030A0" } },
        left: { style: "medium", color: { argb: "FF7030A0" } },
        right: { style: "medium", color: { argb: "FF7030A0" } }
    };

    for (let r = 3; r <= 6; r++) {
        for (let c = 1; c <= 3; c++) {
            const cell = sheet.getRow(r).getCell(c);
            cell.fill = pinkFill;
            cell.border = {
                top: r === 3 ? purpleBorder.top : undefined,
                bottom: r === 6 ? purpleBorder.bottom : undefined,
                left: c === 1 ? purpleBorder.left : undefined,
                right: c === 3 ? purpleBorder.right : undefined
            };
        }
    }

    // Rows 7-10: Metadata block
    const metaFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F4E8" } };
    const thinBorder = {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
    };

    const cleanDate = (iso: string) => (iso ? iso.split("T")[0] : "");

    const metaRows = [
        { label: "Instiution code", val: jsonPayload.InstCode || "0000001" },
        { label: "Financial Year", val: jsonPayload.FinYear || 2026 },
        { label: "Start Date", val: cleanDate(jsonPayload.StartDate) || "2026-04-01" },
        { label: "End Date", val: cleanDate(jsonPayload.EndDate) || "2026-06-30" }
    ];

    metaRows.forEach((m, idx) => {
        const r = 7 + idx;
        const row = sheet.getRow(r);
        row.getCell(1).value = m.label;
        row.getCell(1).font = { name: "Arial", size: 10, bold: true };
        row.getCell(1).fill = metaFill;

        sheet.mergeCells(`B${r}:C${r}`);
        const valCell = row.getCell(2);
        valCell.value = m.val;
        valCell.font = { name: "Arial", size: 10 };
        valCell.fill = metaFill;

        for (let c = 1; c <= 3; c++) {
            row.getCell(c).border = thinBorder;
        }
    });

    for (let r = 7; r <= 10; r++) {
        for (let c = 1; c <= 3; c++) {
            const cell = sheet.getRow(r).getCell(c);
            cell.border = {
                top: r === 7 ? { style: "medium", color: { argb: "FF000000" } } : thinBorder.top,
                bottom: r === 10 ? { style: "medium", color: { argb: "FF000000" } } : thinBorder.bottom,
                left: c === 1 ? { style: "medium", color: { argb: "FF000000" } } : thinBorder.left,
                right: c === 3 ? { style: "medium", color: { argb: "FF000000" } } : thinBorder.right
            };
        }
    }

    // Row 12: Yellow Unit Banner B12:C12
    sheet.mergeCells("B12:C12");
    const unitCell = sheet.getCell("B12");
    unitCell.value = "Amount In Millions of Birr";
    unitCell.font = { name: "Arial", size: 10, bold: true };
    unitCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } };
    unitCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getCell("B12").border = thinBorder;
    sheet.getCell("C12").border = thinBorder;

    // Row 13: Table Headers
    const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
    const headers = [
        { col: 1, text: "S.No." },
        { col: 2, text: "Disbursement" },
        { col: 3, text: "Collections" },
        { col: 4, text: "Outstanding" },
        { col: 5, text: "# of Borrowers accounts*" },
        { col: 6, text: "# of Borrowers" }
    ];

    const r13 = sheet.getRow(13);
    r13.height = 28;
    headers.forEach(h => {
        const cell = r13.getCell(h.col);
        cell.value = h.text;
        cell.font = { name: "Arial", size: 10, bold: true };
        cell.fill = headerFill;
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = thinBorder;
    });

    // Row 14: Data Row
    const r14 = sheet.getRow(14);
    r14.height = 22;
    r14.getCell(1).value = "Total Digital Lending";
    r14.getCell(1).font = { name: "Arial", size: 10, bold: true };
    r14.getCell(1).border = thinBorder;

    const valuesMap: Record<string, any> = {};
    if (Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach((item: any) => {
            if (item && item.Code) valuesMap[item.Code] = item.Value;
        });
    }

    const parseVal = (v: any) => {
        if (v === "" || v === null || v === undefined) return "";
        const num = parseFloat(v);
        return isNaN(num) ? v : num;
    };

    DL001_ITEM_DEFINITIONS.forEach(def => {
        const cell = r14.getCell(def.col);
        cell.value = parseVal(valuesMap[def.code]);
        cell.font = { name: "Arial", size: 10 };
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.border = thinBorder;
    });

    // Row 17: Footer Note
    const noteCell = sheet.getCell("B17");
    noteCell.value = "Note:  * Number of Borrowers accounts and number of Borrowers in figure";
    noteCell.font = { name: "Arial", size: 10, italic: true };

    return workbook;
}

export async function processDL001Report(
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
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const rawJson = processDL001(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelDL001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing DL001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process DL001 report."
        };
    }
}

export const processDigitalLendingDL001Report = processDL001Report;
export const processDigitalLendingDL001 = processDL001;
export const jsonToExcelDigitalLendingDL001 = jsonToExcelDL001;
