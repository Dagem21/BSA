const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

function formatIsoString(dateVal) {
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

function getDirectCellValue(cell) {
    if (!cell || cell === null || cell === undefined) return "";
    let val = cell;
    if (cell && typeof cell === "object" && "value" in cell) {
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
    if (typeof val === "number") {
        return String(val);
    }
    if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "[object Object]" ? "" : trimmed;
    }
    if (val instanceof Date) {
        return formatIsoString(val);
    }
    if (typeof val === "object") {
        if ("result" in val && val.result !== undefined && val.result !== null) {
            if (typeof val.result === "object" && val.result !== null && "error" in val.result) {
                return "";
            }
            if (typeof val.result === "number") return String(val.result);
            if (typeof val.result === "string") {
                const s = val.result.trim();
                return s === "[object Object]" ? "" : s;
            }
            return String(val.result).trim();
        }
        if ("richText" in val && Array.isArray(val.richText)) {
            return val.richText.map((t) => (t && t.text ? t.text : "")).join("").trim();
        }
        if ("text" in val && val.text) {
            return String(val.text).trim();
        }
    }
    if (cell.result !== undefined && cell.result !== null) {
        if (typeof cell.result === "object" && "error" in cell.result) return "";
        return String(cell.result).trim();
    }
    if (cell.text !== undefined && cell.text !== null) {
        return String(cell.text).trim();
    }
    return "";
}

async function verifyQO001Process() {
    const jsonTemplatePath = path.join(process.cwd(), "templates", "json", "QO001.json");
    const rawData = fs.readFileSync(jsonTemplatePath, "utf-8");
    const jsonTemplate = JSON.parse(rawData);

    const excelPath = path.join(process.cwd(), "templates", "QO001.xlsx");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.getWorksheet("CAP_ADQ_OFB_QO001") || workbook.worksheets[0];

    const QO001_ROWS_CONFIG = [
        { row: 16, defaultFactor: "1", defaultWeight: "1" },
        { row: 18, defaultFactor: "1", defaultWeight: "0" },
        { row: 19, defaultFactor: "1", defaultWeight: "0.2" },
        { row: 20, defaultFactor: "1", defaultWeight: "0.2" },
        { row: 21, defaultFactor: "1", defaultWeight: "1" },
        { row: 23, defaultFactor: "0.5", defaultWeight: "0" },
        { row: 24, defaultFactor: "0.5", defaultWeight: "0.2" },
        { row: 25, defaultFactor: "0.5", defaultWeight: "0.2" },
        { row: 26, defaultFactor: "0.5", defaultWeight: "1" },
        { row: 28, defaultFactor: "0.5", defaultWeight: "0" },
        { row: 29, defaultFactor: "0.5", defaultWeight: "0.2" },
        { row: 30, defaultFactor: "0.5", defaultWeight: "0.2" },
        { row: 31, defaultFactor: "0.5", defaultWeight: "1" },
        { row: 33, defaultFactor: "0.2", defaultWeight: "0" },
        { row: 34, defaultFactor: "0.2", defaultWeight: "0.2" },
        { row: 35, defaultFactor: "0.2", defaultWeight: "0.2" },
        { row: 36, defaultFactor: "0.2", defaultWeight: "1" },
        { row: 37, defaultFactor: "", defaultWeight: "" },
        { row: 38, defaultFactor: "", defaultWeight: "" }
    ];

    const valuesByCode = {};
    let totalFaceVal = 0;
    let totalAmount = 0;
    let totalCreditEqu = 0;
    let hasAnyInput = false;
    let itemCounter = 1;

    QO001_ROWS_CONFIG.forEach((r) => {
        if (r.row === 38) return;

        const cellC = getDirectCellValue(worksheet.getRow(r.row).getCell("C")).trim();
        const cellD = getDirectCellValue(worksheet.getRow(r.row).getCell("D")).trim();
        const cellE = getDirectCellValue(worksheet.getRow(r.row).getCell("E")).trim();
        const cellF = getDirectCellValue(worksheet.getRow(r.row).getCell("F")).trim();
        const cellG = getDirectCellValue(worksheet.getRow(r.row).getCell("G")).trim();

        const faceValNum = cellC ? parseFloat(cellC) : NaN;

        if (isNaN(faceValNum) || cellC === "") {
            for (let cIdx = 0; cIdx < 5; cIdx++) {
                const codeNum = String(itemCounter++).padStart(5, "0");
                valuesByCode[`12_${codeNum}`] = "";
            }
        } else {
            hasAnyInput = true;
            totalFaceVal += faceValNum;

            const factorStr = cellD || r.defaultFactor || "";
            const factorNum = parseFloat(factorStr) || 0;

            let amountNum = parseFloat(cellE);
            if (isNaN(amountNum)) {
                amountNum = faceValNum * factorNum;
            }
            totalAmount += amountNum;

            const weightStr = cellF || r.defaultWeight || "";
            const weightNum = parseFloat(weightStr) || 0;

            let creditEquNum = parseFloat(cellG);
            if (isNaN(creditEquNum)) {
                creditEquNum = amountNum * weightNum;
            }
            totalCreditEqu += creditEquNum;

            const codeC = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeD = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeE = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeF = `12_${String(itemCounter++).padStart(5, "0")}`;
            const codeG = `12_${String(itemCounter++).padStart(5, "0")}`;

            valuesByCode[codeC] = String(cellC);
            valuesByCode[codeD] = factorStr;
            valuesByCode[codeE] = String(amountNum);
            valuesByCode[codeF] = weightStr;
            valuesByCode[codeG] = String(creditEquNum);
        }
    });

    valuesByCode["12_00091"] = hasAnyInput && totalFaceVal !== 0 ? String(totalFaceVal) : "";
    valuesByCode["12_00092"] = "";
    valuesByCode["12_00093"] = hasAnyInput && totalAmount !== 0 ? String(totalAmount) : "";
    valuesByCode["12_00094"] = "";
    valuesByCode["12_00095"] = hasAnyInput && totalCreditEqu !== 0 ? String(totalCreditEqu) : "";

    const returnItems = jsonTemplate.ReturnItemsList.map((itemDef) => ({
        Code: itemDef.Code,
        Value: valuesByCode[itemDef.Code] ?? "",
        _description: itemDef._description,
        _dataType: itemDef._dataType || "NUMERIC"
    }));

    const result = {
        ReturnKey: "CAP_ADQ_OFB_QO001",
        InstCode: "0000001",
        FinYear: 2026,
        StartDate: "2026-07-01T00:00:00",
        EndDate: "2026-09-30T00:00:00",
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };

    console.log("SUCCESS! JSON generated structure sample:");
    console.log(JSON.stringify(result, null, 4).substring(0, 1000));
}

verifyQO001Process().catch(console.error);
