import * as ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";
import { ZS001Format } from "./jsonFormat";
import {
    createZS001Record,
    createStatutoryLiquidityRecords
} from "@/dal/sql/statutoryLiquidity";

export async function processZS001Report(
    instCode: string = "0000001",
    uploadedExcelPath: string,
    startDate: Date | string,
    endDate: Date | string,
    outputPathExcel: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const sDate = startDate instanceof Date ? startDate : new Date(startDate);
        const eDate = endDate instanceof Date ? endDate : new Date(endDate);
        const validSDate = isNaN(sDate.getTime()) ? new Date() : sDate;
        const validEDate = isNaN(eDate.getTime()) ? new Date() : eDate;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(uploadedExcelPath);

        const worksheet =
            workbook.getWorksheet("NBE") || workbook.worksheets[0];
        if (!worksheet) {
            throw new Error("Worksheet not found in Excel file.");
        }

        const getNum = (rowNum: number, colLetter: string) => {
            const cell = worksheet.getCell(`${colLetter}${rowNum}`);
            if (!cell || cell.value === null || cell.value === undefined)
                return 0;
            if (typeof cell.value === "number") return cell.value;
            if (
                typeof cell.value === "object" &&
                "result" in cell.value &&
                typeof cell.value.result === "number"
            ) {
                return cell.value.result;
            }
            const parsed = parseFloat(cell.value.toString().replace(/,/g, ""));
            return isNaN(parsed) ? 0 : parsed;
        };

        let rowNetLiab = 17;
        let rowCashCurr = 20;
        let rowDepNbe = 21;
        let rowDepBanks = 22;
        let rowTBills = 23;
        let rowDueDom = 24;
        let rowDueFor = 25;

        worksheet.eachRow((row, rowNumber) => {
            const codeVal = row.getCell(2).value?.toString().trim();
            const descVal = row
                .getCell(3)
                .value?.toString()
                .trim()
                .toLowerCase();

            if (codeVal === "1.1" || descVal?.includes("net current liabilities"))
                rowNetLiab = rowNumber;
            else if (
                codeVal === "2.1" ||
                descVal?.includes("cash - local") ||
                descVal?.includes("cash")
            )
                rowCashCurr = rowNumber;
            else if (codeVal === "2.2" || descVal?.includes("deposits with nbe"))
                rowDepNbe = rowNumber;
            else if (
                codeVal === "2.3" ||
                descVal?.includes("deposits with other")
            )
                rowDepBanks = rowNumber;
            else if (codeVal === "2.4" || descVal?.includes("treasury bills"))
                rowTBills = rowNumber;
            else if (codeVal === "2.5" || descVal?.includes("domestic banks"))
                rowDueDom = rowNumber;
            else if (codeVal === "2.6" || descVal?.includes("foreign banks"))
                rowDueFor = rowNumber;
        });

        const dayCols = ["D", "E", "F", "G", "H", "I", "J"]; // Thu, Fri, Sat, Sun, Mon, Tue, Wed
        const dayKeys = ["thu", "fri", "sat", "sun", "mon", "tue", "wed"];

        const netLiab: Record<string, number> = {};
        const netLiab15: Record<string, number> = {};
        const cashCurr: Record<string, number> = {};
        const depNbe: Record<string, number> = {};
        const depBanks: Record<string, number> = {};
        const tBills: Record<string, number> = {};
        const dueDom: Record<string, number> = {};
        const dueFor: Record<string, number> = {};
        const liqAssets: Record<string, number> = {};
        const excessDef: Record<string, number> = {};
        const liqRatio: Record<string, number> = {};

        let sumNetLiab = 0,
            sumNetLiab15 = 0,
            sumCash = 0,
            sumDepNbe = 0,
            sumDepBanks = 0;
        let sumTBills = 0,
            sumDueDom = 0,
            sumDueFor = 0,
            sumLiqAssets = 0,
            sumExcessDef = 0,
            sumLiqRatio = 0;

        dayKeys.forEach((key, idx) => {
            const col = dayCols[idx];

            const nl = getNum(rowNetLiab, col);
            const cc = getNum(rowCashCurr, col);
            const dn = getNum(rowDepNbe, col);
            const db = getNum(rowDepBanks, col);
            const tb = getNum(rowTBills, col);
            const dd = getNum(rowDueDom, col);
            const df = getNum(rowDueFor, col);

            // Calculations per day:
            // 15% of net current liabilities
            const nl15 = nl * 0.15;
            // Total liquid assets = (Cash + DepNBE + DepBanks + TBills) - (DueDom + DueFor)
            const la = cc + dn + db + tb - (dd + df);
            // Excess/deficit = Total liquid assets - 15% of net current liabilities
            const ed = la - nl15;
            // Liquidity ratio = (Total Liquid Assets / Net Current Liabilities) * 100
            const lr = nl > 0 ? (la / nl) * 100 : 0;

            netLiab[key] = nl;
            netLiab15[key] = nl15;
            cashCurr[key] = cc;
            depNbe[key] = dn;
            depBanks[key] = db;
            tBills[key] = tb;
            dueDom[key] = dd;
            dueFor[key] = df;
            liqAssets[key] = la;
            excessDef[key] = ed;
            liqRatio[key] = lr;

            sumNetLiab += nl;
            sumNetLiab15 += nl15;
            sumCash += cc;
            sumDepNbe += dn;
            sumDepBanks += db;
            sumTBills += tb;
            sumDueDom += dd;
            sumDueFor += df;
            sumLiqAssets += la;
            sumExcessDef += ed;
            sumLiqRatio += lr;
        });

        // Weekly Average calculations
        netLiab["avg"] = sumNetLiab / 7;
        netLiab15["avg"] = sumNetLiab15 / 7;
        cashCurr["avg"] = sumCash / 7;
        depNbe["avg"] = sumDepNbe / 7;
        depBanks["avg"] = sumDepBanks / 7;
        tBills["avg"] = sumTBills / 7;
        dueDom["avg"] = sumDueDom / 7;
        dueFor["avg"] = sumDueFor / 7;
        liqAssets["avg"] = sumLiqAssets / 7;
        excessDef["avg"] = sumExcessDef / 7;
        liqRatio["avg"] = sumLiqRatio / 7;

        // Save into MySQL database via Prisma
        const zs001Record = {
            RETURN_KEY: "LSR-Statutory ZS001",
            INST_CODE: instCode || "0000001",
            FIN_YEAR: validSDate.getFullYear(),
            START_DATE: validSDate,
            END_DATE: validEDate,

            NET_LIAB_THU: netLiab.thu,
            NET_LIAB_FRI: netLiab.fri,
            NET_LIAB_SAT: netLiab.sat,
            NET_LIAB_SUN: netLiab.sun,
            NET_LIAB_MON: netLiab.mon,
            NET_LIAB_TUE: netLiab.tue,
            NET_LIAB_WED: netLiab.wed,
            NET_LIAB_AVG: netLiab.avg,

            CASH_CURR_THU: cashCurr.thu,
            CASH_CURR_FRI: cashCurr.fri,
            CASH_CURR_SAT: cashCurr.sat,
            CASH_CURR_SUN: cashCurr.sun,
            CASH_CURR_MON: cashCurr.mon,
            CASH_CURR_TUE: cashCurr.tue,
            CASH_CURR_WED: cashCurr.wed,
            CASH_CURR_AVG: cashCurr.avg,

            DEP_NBE_THU: depNbe.thu,
            DEP_NBE_FRI: depNbe.fri,
            DEP_NBE_SAT: depNbe.sat,
            DEP_NBE_SUN: depNbe.sun,
            DEP_NBE_MON: depNbe.mon,
            DEP_NBE_TUE: depNbe.tue,
            DEP_NBE_WED: depNbe.wed,
            DEP_NBE_AVG: depNbe.avg,

            DEP_BANKS_THU: depBanks.thu,
            DEP_BANKS_FRI: depBanks.fri,
            DEP_BANKS_SAT: depBanks.sat,
            DEP_BANKS_SUN: depBanks.sun,
            DEP_BANKS_MON: depBanks.mon,
            DEP_BANKS_TUE: depBanks.tue,
            DEP_BANKS_WED: depBanks.wed,
            DEP_BANKS_AVG: depBanks.avg,

            T_BILLS_THU: tBills.thu,
            T_BILLS_FRI: tBills.fri,
            T_BILLS_SAT: tBills.sat,
            T_BILLS_SUN: tBills.sun,
            T_BILLS_MON: tBills.mon,
            T_BILLS_TUE: tBills.tue,
            T_BILLS_WED: tBills.wed,
            T_BILLS_AVG: tBills.avg,

            DUE_DOM_THU: dueDom.thu,
            DUE_DOM_FRI: dueDom.fri,
            DUE_DOM_SAT: dueDom.sat,
            DUE_DOM_SUN: dueDom.sun,
            DUE_DOM_MON: dueDom.mon,
            DUE_DOM_TUE: dueDom.tue,
            DUE_DOM_WED: dueDom.wed,
            DUE_DOM_AVG: dueDom.avg,

            DUE_FOR_THU: dueFor.thu,
            DUE_FOR_FRI: dueFor.fri,
            DUE_FOR_SAT: dueFor.sat,
            DUE_FOR_SUN: dueFor.sun,
            DUE_FOR_MON: dueFor.mon,
            DUE_FOR_TUE: dueFor.tue,
            DUE_FOR_WED: dueFor.wed,
            DUE_FOR_AVG: dueFor.avg,

            LIQ_ASSETS_THU: liqAssets.thu,
            LIQ_ASSETS_FRI: liqAssets.fri,
            LIQ_ASSETS_SAT: liqAssets.sat,
            LIQ_ASSETS_SUN: liqAssets.sun,
            LIQ_ASSETS_MON: liqAssets.mon,
            LIQ_ASSETS_TUE: liqAssets.tue,
            LIQ_ASSETS_WED: liqAssets.wed,
            LIQ_ASSETS_AVG: liqAssets.avg,

            EXCESS_DEF_THU: excessDef.thu,
            EXCESS_DEF_FRI: excessDef.fri,
            EXCESS_DEF_SAT: excessDef.sat,
            EXCESS_DEF_SUN: excessDef.sun,
            EXCESS_DEF_MON: excessDef.mon,
            EXCESS_DEF_TUE: excessDef.tue,
            EXCESS_DEF_WED: excessDef.wed,
            EXCESS_DEF_AVG: excessDef.avg
        };

        await createZS001Record(zs001Record);

        // Save detailed line items into StatutoryLiquidity table
        const detailRows = [
            { order: 1.1, desc: "Net current liabilities", data: netLiab },
            {
                order: 1.2,
                desc: "15% of net current liabilities",
                data: netLiab15
            },
            { order: 2.1, desc: "Cash - local and foreign currency", data: cashCurr },
            { order: 2.2, desc: "Deposits with NBE", data: depNbe },
            {
                order: 2.3,
                desc: "Deposits with other local & foreign banks",
                data: depBanks
            },
            { order: 2.4, desc: "Treasury bills", data: tBills },
            { order: 2.5, desc: "Net due from Domestic banks*", data: dueDom },
            { order: 2.6, desc: "Net due from Foreign banks*", data: dueFor },
            {
                order: 2.7,
                desc: "Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6)",
                data: liqAssets
            },
            { order: 3.0, desc: "Excess/deficit (2.7-1.2)", data: excessDef },
            { order: 4.0, desc: "Liquidity Ratio", data: liqRatio }
        ];

        const statutoryRecords = detailRows.map((r) => ({
            START_DATE: validSDate,
            END_DATE: validEDate,
            ORDER_NUM: r.order,
            NEW_DETAIL_GROUP: r.desc,
            THU: r.data.thu,
            FRI: r.data.fri,
            SAT: r.data.sat,
            SUN: r.data.sun,
            MON: r.data.mon,
            TUE: r.data.tue,
            WED: r.data.wed,
            WEEKLY_AVG: r.data.avg
        }));

        await createStatutoryLiquidityRecords(statutoryRecords);

        // Populate template Excel output
        const templatePath = path.join(
            process.cwd(),
            "templates",
            "ZS001.xlsx"
        );
        let outWorkbook = new ExcelJS.Workbook();
        if (fs.existsSync(templatePath)) {
            await outWorkbook.xlsx.readFile(templatePath);
        } else {
            await outWorkbook.xlsx.readFile(uploadedExcelPath);
        }

        const outWs =
            outWorkbook.getWorksheet("NBE") || outWorkbook.worksheets[0];

        if (outWs) {
            outWs.getCell("D9").value = instCode || "0000001";
            outWs.getCell("D10").value = validSDate.getFullYear().toString();
            outWs.getCell("D11").value = validSDate.toISOString();
            outWs.getCell("D12").value = validEDate.toISOString();

            const fillRow = (
                rowNum: number,
                data: Record<string, number>
            ) => {
                dayCols.forEach((col, i) => {
                    outWs.getCell(`${col}${rowNum}`).value = data[dayKeys[i]];
                });
                outWs.getCell(`K${rowNum}`).value = data["avg"];
            };

            fillRow(rowNetLiab, netLiab);
            fillRow(rowNetLiab + 1, netLiab15);
            fillRow(rowCashCurr, cashCurr);
            fillRow(rowDepNbe, depNbe);
            fillRow(rowDepBanks, depBanks);
            fillRow(rowTBills, tBills);
            fillRow(rowDueDom, dueDom);
            fillRow(rowDueFor, dueFor);
            fillRow(rowDueFor + 1, liqAssets);
            fillRow(rowDueFor + 2, excessDef);
            fillRow(rowDueFor + 3, liqRatio);

            outWorkbook.calcProperties.fullCalcOnLoad = true;
            await outWorkbook.xlsx.writeFile(outputPathExcel);
        }

        // Generate JSON output
        const jsonPayload = ZS001Format(
            "LSR-Statutory ZS001",
            instCode || "0000001",
            validSDate.getFullYear(),
            validSDate.toISOString().split("T")[0] + "T00:00:00",
            validEDate.toISOString().split("T")[0] + "T00:00:00",
            {
                netLiab,
                cashCurr,
                depNbe,
                depBanks,
                tBills,
                dueDom,
                dueFor,
                liqAssets,
                excessDef
            }
        );

        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }

        fs.writeFileSync(
            outputPathJson,
            JSON.stringify(jsonPayload, null, 2),
            "utf8"
        );

        return { success: true };
    } catch (err: any) {
        console.error("Error processing ZS001 report:", err);
        return { success: false, error: err.message };
    }
}
