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
    else if (returnKey.includes("MWAC001") || returnKey.includes("LCMWAC001") || returnKey.includes("WALIR")) sheetName = "WALIR";
    else if (returnKey.includes("LB002")) sheetName = "LB002";
    else if (returnKey.includes("13002") || returnKey.includes("BSD_LOAN_PART13002")) sheetName = "13002";
    else if (returnKey.includes("DPWADP001")) sheetName = "DPWADP001";
    else if (returnKey.includes("OL001")) sheetName = "OL001";
    else if (returnKey.includes("NN001")) sheetName = "NN001";
    else if (returnKey.includes("FB001")) sheetName = "FB001";
    else if (returnKey.includes("BP001")) sheetName = "BP001";
    else if (returnKey.includes("KK001") || returnKey.includes("M_CC")) sheetName = "M_CC-On & OffKK001";
    else if (returnKey.includes("GS001")) sheetName = "GS001";
    else if (returnKey.includes("DR002")) sheetName = "DR002";
    else if (returnKey.includes("DS003")) sheetName = "DS003";
    else if (returnKey.includes("ID002") || returnKey.includes("INT_FRE_RAN")) sheetName = "ID002";
    else if (returnKey.includes("RI003") || returnKey.includes("INT_FRE_SEC")) sheetName = "RI003";
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

    } else if (returnKey.includes("GS001")) {
        // GS001 Metadata layout
        worksheet.getCell("B9").value = "Institution code";
        worksheet.getCell("B10").value = "Financial Year";
        worksheet.getCell("B11").value = "Start Date";
        worksheet.getCell("B12").value = "End Date";

        worksheet.getCell("C9").value = instCode;
        worksheet.getCell("C10").value = finYear;
        worksheet.getCell("C11").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("C12").value = endDate ? `${endDate}T00:00:00` : "";

        ["B9", "B10", "B11", "B12"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        // Write GS001 Table Header at Row 14
        const headers = ["Deposit Type", "Deposit Amount", "# of depositors accounts", "# of depositors"];
        headers.forEach((h, i) => {
            const cell = worksheet.getRow(14).getCell(i + 2); // Start at Col B
            cell.value = h;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: i >= 1 ? "right" : "left", vertical: "middle" };
        });

        const returnItems = jsonData?.ReturnItemsList || [];
        const itemsMap: Record<string, string> = {};
        returnItems.forEach((item: any) => {
            itemsMap[item.Code] = item.Value;
        });

        const gs001Rows = [
            { type: "Demand", amtCode: "163_00001", accCode: "163_00002", depCode: "163_00003", excelRow: 15 },
            { type: "Saving", amtCode: "163_00004", accCode: "163_00005", depCode: "163_00006", excelRow: 16 },
            { type: "Time", amtCode: "163_00007", accCode: "163_00008", depCode: "163_00009", excelRow: 17 },
            { type: "Total", amtCode: "163_00010", accCode: "163_00011", depCode: "163_00012", excelRow: 18 }
        ];

        gs001Rows.forEach((rInfo) => {
            const row = worksheet.getRow(rInfo.excelRow);
            const cellType = row.getCell(2);
            cellType.value = rInfo.type;
            cellType.border = borderStyle;

            [
                { code: rInfo.amtCode, isInteger: false, col: 3 },
                { code: rInfo.accCode, isInteger: true, col: 4 },
                { code: rInfo.depCode, isInteger: true, col: 5 }
            ].forEach((colInfo) => {
                const cell = row.getCell(colInfo.col);
                const valStr = itemsMap[colInfo.code] ?? "";

                if (valStr !== "" && !isNaN(Number(valStr))) {
                    cell.value = Number(valStr);
                    cell.numFmt = colInfo.isInteger ? "#,##0" : "#,##0.00";
                } else {
                    cell.value = valStr;
                }
                cell.border = borderStyle;
                cell.alignment = { horizontal: "right" };
            });
        });

    } else if (returnKey.includes("DR002")) {
        // DR002 Metadata layout
        worksheet.getCell("B9").value = "Institution code";
        worksheet.getCell("B10").value = "Financial Year";
        worksheet.getCell("B11").value = "Start Date";
        worksheet.getCell("B12").value = "End Date";

        worksheet.getCell("C9").value = instCode;
        worksheet.getCell("C10").value = finYear;
        worksheet.getCell("C11").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("C12").value = endDate ? `${endDate}T00:00:00` : "";

        ["B9", "B10", "B11", "B12"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        // Write DR002 Range Headers at Row 13 & 14
        worksheet.getRow(13).getCell(2).value = "Region / Category";
        worksheet.getRow(13).getCell(2).fill = headerFill;
        worksheet.getRow(13).getCell(2).font = headerFont;

        const ranges = ["<= Birr 100,000", ">Birr 100,000 - 1 Million", "> Birr 1 Million", "Total"];
        ranges.forEach((rng, i) => {
            const startCol = 3 + i * 3;
            worksheet.mergeCells(13, startCol, 13, startCol + 2);
            const cell = worksheet.getRow(13).getCell(startCol);
            cell.value = rng;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        for (let i = 0; i < 12; i++) {
            const cell = worksheet.getRow(14).getCell(i + 3);
            cell.value = i % 3 === 0 ? "Amount" : (i % 3 === 1 ? "# of Depositors" : "# of Accounts");
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        const returnItems = jsonData?.ReturnItemsList || [];
        const itemsMap: Record<string, string> = {};
        returnItems.forEach((item: any) => {
            itemsMap[item.Code] = item.Value;
        });

        const regions = [
            "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
            "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
        ];
        const subRows = ["", "Demand_", "Saving_", "Time_", "Urban_", "Rural_"];

        let globalCodeCounter = 34682;
        let excelRowIndex = 15;

        regions.forEach((regName) => {
            subRows.forEach((subRow) => {
                const row = worksheet.getRow(excelRowIndex);
                const subRowLabel = subRow === "" ? regName : `${regName} (${subRow.replace("_", "")})`;
                
                const cellLabel = row.getCell(2);
                cellLabel.value = subRowLabel;
                cellLabel.border = borderStyle;
                if (subRow === "") cellLabel.font = { bold: true };

                for (let cIdx = 0; cIdx < 12; cIdx++) {
                    const codeStr = `DR002_${globalCodeCounter}`;
                    globalCodeCounter++;

                    const valStr = itemsMap[codeStr] ?? "";
                    const cell = row.getCell(3 + cIdx);
                    const isInteger = cIdx % 3 !== 0;

                    if (valStr !== "" && !isNaN(Number(valStr))) {
                        cell.value = Number(valStr);
                        cell.numFmt = isInteger ? "#,##0" : "#,##0.00";
                    } else {
                        cell.value = valStr;
                    }
                    cell.border = borderStyle;
                    cell.alignment = { horizontal: "right" };
                }

                excelRowIndex++;
            });
        });

    } else if (returnKey.includes("DS003")) {
        // DS003 Metadata layout
        worksheet.getCell("B9").value = "Institution code";
        worksheet.getCell("B10").value = "Financial Year";
        worksheet.getCell("B11").value = "Start Date";
        worksheet.getCell("B12").value = "End Date";

        worksheet.getCell("C9").value = instCode;
        worksheet.getCell("C10").value = finYear;
        worksheet.getCell("C11").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("C12").value = endDate ? `${endDate}T00:00:00` : "";

        ["B9", "B10", "B11", "B12"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        // Write DS003 Sector Headers at Row 13 & 14
        worksheet.getRow(13).getCell(2).value = "Region / Category";
        worksheet.getRow(13).getCell(2).fill = headerFill;
        worksheet.getRow(13).getCell(2).font = headerFont;

        const sectors = ["Pub. Enterprise", "Private & Coop.", "Regional Gov.", "Banks", "Others", "Total"];
        sectors.forEach((sec, i) => {
            const startCol = 3 + i * 3;
            worksheet.mergeCells(13, startCol, 13, startCol + 2);
            const cell = worksheet.getRow(13).getCell(startCol);
            cell.value = sec;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        for (let i = 0; i < 18; i++) {
            const cell = worksheet.getRow(14).getCell(i + 3);
            cell.value = i % 3 === 0 ? "Amount" : (i % 3 === 1 ? "# of Depositors" : "# of Accounts");
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        const returnItems = jsonData?.ReturnItemsList || [];
        const itemsMap: Record<string, string> = {};
        returnItems.forEach((item: any) => {
            itemsMap[item.Code] = item.Value;
        });

        const regions = [
            "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
            "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
        ];
        const subRows = ["", "Demand_", "Saving_", "Time_", "Urban_", "Rural_"];

        let globalCodeCounter = 33152;
        let excelRowIndex = 15;

        regions.forEach((regName) => {
            subRows.forEach((subRow) => {
                const row = worksheet.getRow(excelRowIndex);
                const subRowLabel = subRow === "" ? regName : `${regName} (${subRow.replace("_", "")})`;
                
                const cellLabel = row.getCell(2);
                cellLabel.value = subRowLabel;
                cellLabel.border = borderStyle;
                if (subRow === "") cellLabel.font = { bold: true };

                for (let cIdx = 0; cIdx < 18; cIdx++) {
                    const codeStr = `DS003_${globalCodeCounter}`;
                    globalCodeCounter++;

                    const valStr = itemsMap[codeStr] ?? "";
                    const cell = row.getCell(3 + cIdx);
                    const isInteger = cIdx % 3 !== 0;

                    if (valStr !== "" && !isNaN(Number(valStr))) {
                        cell.value = Number(valStr);
                        cell.numFmt = isInteger ? "#,##0" : "#,##0.00";
                    } else {
                        cell.value = valStr;
                    }
                    cell.border = borderStyle;
                    cell.alignment = { horizontal: "right" };
                }

                excelRowIndex++;
            });
        });

    } else if (returnKey.includes("ID002") || returnKey.includes("INT_FRE_RAN")) {
        // Metadata (B9:B12)
        worksheet.getCell("B9").value = "Institution code";
        worksheet.getCell("B10").value = "Financial Year";
        worksheet.getCell("B11").value = "Start Date";
        worksheet.getCell("B12").value = "End Date";

        worksheet.getCell("C9").value = instCode;
        worksheet.getCell("C10").value = finYear;
        worksheet.getCell("C11").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("C12").value = endDate ? `${endDate}T00:00:00` : "";

        ["B9", "B10", "B11", "B12"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        // Table Header at Row 13 & 14
        worksheet.getRow(13).getCell(2).value = "Region / Deposit Breakdown";
        worksheet.getRow(13).getCell(2).fill = headerFill;
        worksheet.getRow(13).getCell(2).font = headerFont;

        const ranges = ["<= Birr 100,000", "> Birr 100,000 - 1 Million", "> Birr 1 Million", "Total"];
        ranges.forEach((rng, i) => {
            const startCol = 3 + i * 3;
            worksheet.mergeCells(13, startCol, 13, startCol + 2);
            const cell = worksheet.getRow(13).getCell(startCol);
            cell.value = rng;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        for (let i = 0; i < 12; i++) {
            const cell = worksheet.getRow(14).getCell(i + 3);
            cell.value = i % 3 === 0 ? "Amount" : (i % 3 === 1 ? "# of Depositors" : "# of Accounts");
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        const returnItems = jsonData?.ReturnItemsList || [];
        const itemsMap: Record<string, string> = {};
        returnItems.forEach((item: any) => {
            itemsMap[item.Code] = item.Value;
        });

        const regions = [
            "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
            "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
        ];

        let globalCodeCounter = 37736;
        let excelRowIndex = 15;

        regions.forEach((regName, regIdx) => {
            const regIdx1Based = regIdx + 1;
            const subRows = [
                "",
                "Demand_",
                "Saving_",
                `Time (${regIdx1Based}.3.1+${regIdx1Based}.3.2)_`,
                "Restricted Investment Deposit_",
                "Unrestricted Investment Deposit_",
                "Urban_",
                "Rural_"
            ];

            subRows.forEach((subRow) => {
                const row = worksheet.getRow(excelRowIndex);
                const subRowLabel = subRow === "" ? `${regName} Total` : `${regName} (${subRow.replace("_", "")})`;
                
                const cellLabel = row.getCell(2);
                cellLabel.value = subRowLabel;
                cellLabel.border = borderStyle;
                if (subRow === "") cellLabel.font = { bold: true };

                for (let cIdx = 0; cIdx < 12; cIdx++) {
                    const codeStr = `ID002_${globalCodeCounter}`;
                    globalCodeCounter++;

                    const valStr = itemsMap[codeStr] ?? "";
                    const cell = row.getCell(3 + cIdx);
                    const isInteger = cIdx % 3 !== 0;

                    if (valStr !== "" && !isNaN(Number(valStr))) {
                        cell.value = Number(valStr);
                        cell.numFmt = isInteger ? "#,##0" : "#,##0.00";
                    } else {
                        cell.value = valStr;
                    }
                    cell.border = borderStyle;
                    cell.alignment = { horizontal: "right" };
                }

                excelRowIndex++;
            });
        });

    } else if (returnKey.includes("RI003") || returnKey.includes("INT_FRE_SEC")) {
        // Metadata (B9:B12)
        worksheet.getCell("B9").value = "Institution code";
        worksheet.getCell("B10").value = "Financial Year";
        worksheet.getCell("B11").value = "Start Date";
        worksheet.getCell("B12").value = "End Date";

        worksheet.getCell("C9").value = instCode;
        worksheet.getCell("C10").value = finYear;
        worksheet.getCell("C11").value = startDate ? `${startDate}T00:00:00` : "";
        worksheet.getCell("C12").value = endDate ? `${endDate}T00:00:00` : "";

        ["B9", "B10", "B11", "B12"].forEach(cell => {
            worksheet.getCell(cell).font = metaFont;
        });

        // Table Header at Row 13 & 14
        worksheet.getRow(13).getCell(2).value = "Region / Category";
        worksheet.getRow(13).getCell(2).fill = headerFill;
        worksheet.getRow(13).getCell(2).font = headerFont;

        const sectors = ["Pub. Enterprise", "Private & Coop.", "Regional Gov.", "Banks", "Others", "Total"];
        sectors.forEach((sec, i) => {
            const startCol = 3 + i * 3;
            worksheet.mergeCells(13, startCol, 13, startCol + 2);
            const cell = worksheet.getRow(13).getCell(startCol);
            cell.value = sec;
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        for (let i = 0; i < 18; i++) {
            const cell = worksheet.getRow(14).getCell(i + 3);
            cell.value = i % 3 === 0 ? "Amount" : (i % 3 === 1 ? "# of Depositors" : "# of Accounts");
            cell.fill = headerFill;
            cell.font = headerFont;
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        const returnItems = jsonData?.ReturnItemsList || [];
        const itemsMap: Record<string, string> = {};
        returnItems.forEach((item: any) => {
            itemsMap[item.Code] = item.Value;
        });

        const regions = [
            "Addis Ababa", "Afar", "Amhara", "Benishangul", "Dire Dawa", "Gambela",
            "Harari", "Oromia", "Somalia", "Tigray", "Sidama", "SWERS", "CERS", "SERS"
        ];

        let globalCodeCounter = 35702;
        let excelRowIndex = 15;

        regions.forEach((regName, regIdx) => {
            const regIdx1Based = regIdx + 1;
            const subRows = [
                "",
                "Demand_",
                "Saving_",
                `Time (${regIdx1Based}.3.1+${regIdx1Based}.3.2)_`,
                "Restricted Investment Deposit_",
                "Unrestricted Investment Deposit_",
                "Urban_",
                "Rural_"
            ];

            subRows.forEach((subRow) => {
                const row = worksheet.getRow(excelRowIndex);
                const subRowLabel = subRow === "" ? `${regName} Total` : `${regName} (${subRow.replace("_", "")})`;
                
                const cellLabel = row.getCell(2);
                cellLabel.value = subRowLabel;
                cellLabel.border = borderStyle;
                if (subRow === "") cellLabel.font = { bold: true };

                for (let cIdx = 0; cIdx < 18; cIdx++) {
                    const codeStr = `RI003_${globalCodeCounter}`;
                    globalCodeCounter++;

                    const valStr = itemsMap[codeStr] ?? "";
                    const cell = row.getCell(3 + cIdx);
                    const isInteger = cIdx % 3 !== 0;

                    if (valStr !== "" && !isNaN(Number(valStr))) {
                        cell.value = Number(valStr);
                        cell.numFmt = isInteger ? "#,##0" : "#,##0.00";
                    } else {
                        cell.value = valStr;
                    }
                    cell.border = borderStyle;
                    cell.alignment = { horizontal: "right" };
                }

                excelRowIndex++;
            });
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

function getLB002FlatItemsFromReturnItems(returnItems?: any[]) {
    if (!Array.isArray(returnItems) || returnItems.length < 121) return [];
    const itemMap: Record<string, any> = {};
    returnItems.forEach((it: any) => {
        if (it?.Code) itemMap[it.Code] = it.Value ?? "";
    });

    const flat: any[] = [];
    for (let slot = 1; slot <= 20; slot++) {
        const cCode = `LB002_${(21 - slot).toString().padStart(5, "0")}`;
        const cpName = (itemMap[cCode] || "").trim();

        if (cpName && cpName !== "0" && cpName !== "-") {
            const totalOutCode = `LB002_${(41 - slot).toString().padStart(5, "0")}`;
            const sectorCode = `LB002_${(61 - slot).toString().padStart(5, "0")}`;
            const pctCode = `LB002_${(82 - slot).toString().padStart(5, "0")}`;
            const statusCode = `LB002_${(102 - slot).toString().padStart(5, "0")}`;
            const capitalCode = `LB002_${(122 - slot).toString().padStart(5, "0")}`;

            flat.push(
                { Code: `${slot}.1`, Value: cpName, _description: "Name of Counterparty*", _dataType: "TEXT", _required: true },
                { Code: `${slot}.2`, Value: "-", _description: "Type of Exposure", _dataType: "TEXT", _required: true },
                { Code: `${slot}.3`, Value: itemMap[sectorCode] || "-", _description: "Sector of Exposure", _dataType: "TEXT", _required: true },
                { Code: `${slot}.4`, Value: itemMap[totalOutCode] || "0", _description: "Approved Limit/Facility", _dataType: "NUMERIC", _required: true },
                { Code: `${slot}.5`, Value: itemMap[totalOutCode] || "0", _description: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A", _dataType: "NUMERIC", _required: false },
                { Code: `${slot}.6`, Value: "0", _description: "Off-balance Sheet Exposure Amount (e.g. guarantee)_  B", _dataType: "NUMERIC", _required: false },
                { Code: `${slot}.7`, Value: itemMap[totalOutCode] || "0", _description: "Total Outstanding Balance_    C=A+B", _dataType: "NUMERIC", _required: true },
                { Code: `${slot}.8`, Value: "-", _description: "Maturity Date", _dataType: "DATE", _required: true },
                { Code: `${slot}.9`, Value: itemMap[capitalCode] || "0", _description: "Capital", _dataType: "NUMERIC", _required: true },
                { Code: `${slot}.10`, Value: itemMap[pctCode] || "0", _description: "Exposure Amount (A+B) as Percent of Total Capital", _dataType: "NUMERIC", _required: true },
                { Code: `${slot}.11`, Value: itemMap[statusCode] || "-", _description: "Status (classification)", _dataType: "TEXT", _required: true },
                { Code: `${slot}.12`, Value: "-", _description: "Collateral_Type", _dataType: "TEXT", _required: true },
                { Code: `${slot}.13`, Value: "0", _description: "Collateral_Estimated/Face value", _dataType: "NUMERIC", _required: false }
            );
        }
    }
    return flat;
}

        const dynamicAreas = jsonData?.DynamicItemsList || [];
        const flatItems = (dynamicAreas?.[0]?.DynamicItems && dynamicAreas[0].DynamicItems.length > 0)
            ? dynamicAreas[0].DynamicItems
            : ((returnKey.includes("LB002") || returnKey.includes("BOR_TEN_PER_LB002"))
                ? getLB002FlatItemsFromReturnItems(jsonData?.ReturnItemsList)
                : []);

        if (flatItems.length > 0) {
            // Group flatItems into rows
            let rowChunkSize = 8;
            if (returnKey.includes("13002") || returnKey.includes("BSD_LOAN_PART13002")) rowChunkSize = 14;
            else if (returnKey.includes("LB002")) rowChunkSize = 13;
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
