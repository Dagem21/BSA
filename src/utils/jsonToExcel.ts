import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";

export async function generateExcelFromJson(
    jsonData: any,
    outputExcelPath: string
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const returnKey = (jsonData?.ReturnKey || "REPORT").toString();
    const instCode = (jsonData?.InstCode || "0000001").toString();
    const finYear = jsonData?.FinYear || new Date().getFullYear();
    const startDate = jsonData?.StartDate?.split("T")[0] || "";
    const endDate = jsonData?.EndDate?.split("T")[0] || "";

    // Determine sheet name
    let sheetName = "Sheet1";
    if (returnKey.includes("ZS001")) sheetName = "ZS001";
    else if (returnKey.includes("MWAL001")) sheetName = "MWAL001";
    else if (returnKey.includes("LB002")) sheetName = "LB002";
    else if (returnKey.includes("DPWADP001")) sheetName = "DPWADP001";
    else if (returnKey.includes("OL001")) sheetName = "OL001";
    else if (returnKey.includes("NN001")) sheetName = "NN001";
    else if (returnKey.includes("FB001")) sheetName = "FB001";
    else if (returnKey.includes("BP001")) sheetName = "BP001";
    else sheetName = returnKey.slice(0, 31);

    const worksheet = workbook.addWorksheet(sheetName);

    // Styling constants
    const headerFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F766E" } // Dark Teal
    };
    const headerFont: Partial<ExcelJS.Font> = {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: "FFFFFFFF" }
    };
    const titleFont: Partial<ExcelJS.Font> = {
        name: "Calibri",
        size: 14,
        bold: true,
        color: { argb: "FF1E293B" }
    };
    const metaFont: Partial<ExcelJS.Font> = {
        name: "Calibri",
        size: 10,
        bold: true,
        color: { argb: "FF475569" }
    };
    const borderStyle: Partial<ExcelJS.Borders> = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } }
    };

    // 1. Write Header Title & Metadata
    worksheet.getCell("A1").value = `NATIONAL BANK OF ETHIOPIA - ${returnKey}`;
    worksheet.getCell("A1").font = titleFont;

    if (returnKey.includes("ZS001")) {
        // ZS001 Metadata layout (D9:D12)
        worksheet.getCell("B9").value = "Institution code";
        worksheet.getCell("B10").value = "Financial Year";
        worksheet.getCell("B11").value = "Start Date";
        worksheet.getCell("B12").value = "End Date";

        worksheet.getCell("D9").value = instCode;
        worksheet.getCell("D10").value = finYear;
        worksheet.getCell("D11").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("D12").value = endDate ? `${endDate}T00:00:00` : "";

        ["B9", "B10", "B11", "B12"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        // Write ZS001 Table Header at Row 15
        const headers = ["Code", "Description", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Weekly Average"];
        headers.forEach((h, i) => {
            const cell = worksheet.getRow(15).getCell(i + 2); // Start at Col B
            cell.value = h;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: i >= 2 ? "right" : "left", vertical: "middle" };
        });

        // 9 Category Rows for ZS001
        const zs001Rows = [
            { code: "1.1", desc: "Net current liabilities", startIdx: 0, excelRow: 17 },
            { code: "2.1", desc: "Cash - local and foreign currency", startIdx: 8, excelRow: 20 },
            { code: "2.2", desc: "Deposits with NBE", startIdx: 16, excelRow: 21 },
            { code: "2.3", desc: "Deposits with other local & foreign banks", startIdx: 24, excelRow: 22 },
            { code: "2.4", desc: "Treasury bills", startIdx: 32, excelRow: 23 },
            { code: "2.5", desc: "Net due from Domestic banks*", startIdx: 40, excelRow: 24 },
            { code: "2.6", desc: "Net due from Foreign banks*", startIdx: 48, excelRow: 25 },
            { code: "2.7", desc: "Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6)", startIdx: 56, excelRow: 26 },
            { code: "3", desc: "Excess/deficit (2.7-1.2)", startIdx: 64, excelRow: 27 }
        ];

        const returnItems = jsonData?.ReturnItemsList || [];
        const itemsMap: Record<string, string> = {};
        returnItems.forEach((item: any) => {
            itemsMap[item.Code] = item.Value;
        });

        zs001Rows.forEach((rInfo) => {
            const row = worksheet.getRow(rInfo.excelRow);
            row.getCell(2).value = rInfo.code;
            row.getCell(3).value = rInfo.desc;
            row.getCell(2).border = borderStyle;
            row.getCell(3).border = borderStyle;

            for (let cIdx = 0; cIdx < 8; cIdx++) {
                const itemCodeNum = rInfo.startIdx + cIdx + 1;
                const codeStr = `109_${itemCodeNum.toString().padStart(5, "0")}`;
                const valStr = itemsMap[codeStr] ?? "";
                const cell = row.getCell(4 + cIdx);

                if (valStr !== "" && !isNaN(Number(valStr))) {
                    cell.value = Number(valStr);
                    cell.numFmt = "#,##0.00";
                } else {
                    cell.value = valStr;
                }
                cell.border = borderStyle;
                cell.alignment = { horizontal: "right" };
            }
        });

    } else {
        // Dynamic & Standard Metadata (B2:B5)
        worksheet.getCell("A2").value = "Institution Code";
        worksheet.getCell("A3").value = "Financial Year";
        worksheet.getCell("A4").value = "Start Date";
        worksheet.getCell("A5").value = "End Date";

        worksheet.getCell("B2").value = instCode;
        worksheet.getCell("B3").value = finYear;
        worksheet.getCell("B4").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("B5").value = endDate ? `${endDate}T00:00:00` : "";

        ["A2", "A3", "A4", "A5"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        const dynamicAreas = jsonData?.DynamicItemsList || [];
        const flatItems = dynamicAreas?.[0]?.DynamicItems || [];

        if (flatItems.length > 0) {
            // Group flatItems into rows
            let rowChunkSize = 8;
            if (returnKey.includes("LB002")) rowChunkSize = 13;
            else if (returnKey.includes("OL001")) rowChunkSize = 11;
            else if (returnKey.includes("NN001")) rowChunkSize = 9;

            const totalRows = Math.floor(flatItems.length / rowChunkSize);
            const firstRowItems = flatItems.slice(0, rowChunkSize);

            // Write Table Headers at Row 7
            firstRowItems.forEach((item: any, colIdx: number) => {
                const cell = worksheet.getRow(7).getCell(colIdx + 1);
                cell.value = item._description?.replace(/[\n\r]+/g, " ") || `Column ${colIdx + 1}`;
                cell.fill = headerFill;
                cell.font = headerFont;
                cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            });

            // Write Row Items starting at Row 8
            for (let rIdx = 0; rIdx < totalRows; rIdx++) {
                const chunk = flatItems.slice(rIdx * rowChunkSize, (rIdx + 1) * rowChunkSize);
                const row = worksheet.getRow(8 + rIdx);

                chunk.forEach((item: any, colIdx: number) => {
                    const cell = row.getCell(colIdx + 1);
                    const val = item.Value;

                    if (val !== undefined && val !== null && val !== "" && !isNaN(Number(val)) && item._dataType === "NUMERIC") {
                        cell.value = Number(val);
                        cell.numFmt = Number.isInteger(Number(val)) ? "#,##0" : "#,##0.00";
                        cell.alignment = { horizontal: "right" };
                    } else {
                        cell.value = val || "";
                        cell.alignment = { horizontal: "left" };
                    }
                    cell.border = borderStyle;
                });
            }
        } else if (jsonData?.ReturnItemsList?.length > 0) {
            // Standard ReturnItemsList Table
            const headers = ["Code", "Description", "Value", "Data Type"];
            headers.forEach((h, colIdx) => {
                const cell = worksheet.getRow(7).getCell(colIdx + 1);
                cell.value = h;
                cell.fill = headerFill;
                cell.font = headerFont;
            });

            jsonData.ReturnItemsList.forEach((item: any, rIdx: number) => {
                const row = worksheet.getRow(8 + rIdx);
                row.getCell(1).value = item.Code;
                row.getCell(2).value = item._description;
                
                const cellVal = row.getCell(3);
                if (item.Value !== "" && !isNaN(Number(item.Value))) {
                    cellVal.value = Number(item.Value);
                    cellVal.numFmt = "#,##0.00";
                    cellVal.alignment = { horizontal: "right" };
                } else {
                    cellVal.value = item.Value || "";
                }

                row.getCell(4).value = item._dataType || "TEXT";

                [1, 2, 3, 4].forEach(c => {
                    row.getCell(c).border = borderStyle;
                });
            });
        }
    }

    // Auto-fit column widths
    worksheet.columns.forEach((column) => {
        let maxLen = 12;
        column.eachCell?.({ includeEmpty: false }, (cell) => {
            const str = cell.value ? cell.value.toString() : "";
            if (str.length > maxLen && !str.includes("\n")) {
                maxLen = Math.min(str.length + 3, 45);
            }
        });
        column.width = maxLen;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const nodeBuffer = Buffer.from(buffer);

    if (outputExcelPath) {
        const dir = path.dirname(outputExcelPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputExcelPath, nodeBuffer);
    }

    return nodeBuffer;
}
