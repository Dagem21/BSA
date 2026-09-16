import * as path from "path";
import { validateTemplate } from "@/utils/fileValidation";
import { processNN001Report } from "@/utils/services/NN001/NN001";
import { processFB001Report } from "@/utils/services/FB001/FB001";
import { processBP001Report } from "@/utils/services/BP001/BP001";
import { processMWAL001Report } from "@/utils/services/MWAL001/MWAL001";
import { processLB002Report } from "@/utils/services/LB002/LB002";
import { processZS001Report } from "@/utils/services/ZS001/ZS001";
import { processOL001Report } from "@/utils/services/OL001/OL001";
import { processMA001Report } from "@/utils/services/MA001/MA001";
import { processMK001Report } from "@/utils/services/MK001/MK001";
import { processMB001Report } from "@/utils/services/MB001/MB001";
import { processSRRYY001Report } from "@/utils/services/SRRYY001/SRRYY001";
import { processRB001Report } from "@/utils/services/RB001/RB001";
import { processKK001Report } from "@/utils/services/KK001/KK001";
import { processREGRL002Report } from "@/utils/services/REGRL002/REGRL002";
import { processMD002Report } from "@/utils/services/MD002/MD002";
import { processDPWADP001Report } from "@/utils/services/DPWADP001/DPWADP001";
import { processBD001Report } from "@/utils/services/BD001/BD001";
import { ReportFormValues } from "@/yup/report";
import { processRWW001Report } from "./services/RWW002/RWW001";
import { processLA001Report } from "./services/LA001/LA001";
import { processEP001Report } from "./services/EP001/EP001";
import { processMWAC001Report } from "./services/MWAC001/MWAC001";
import { process13002Report } from "./services/BSD_LOAN_PART13002/13002";

export const fileProcessor = async (
    instCode: string,
    reportIdStr: string,
    inputFile: string,
    jsonFile: string,
    filePath: string,
    validatedReport: ReportFormValues
) => {
    try {
        const startDateStr = validatedReport.startDate.toISOString();
        const endDateStr = validatedReport.endDate.toISOString();

        const jsonFilePath = path.join(
            process.cwd(),
            "reports",
            "json",
            jsonFile
        );

        // 1. Strict Template Verification
        // let validationResult;
        // if (
        //     reportIdStr.toUpperCase().includes("NN001") ||
        //     reportIdStr.toUpperCase().includes("NACNN001") ||
        //     reportIdStr.toUpperCase().includes("OL001") ||
        //     reportIdStr.toUpperCase().includes("COL_ACQ_18M_OL001") ||
        //     reportIdStr.toUpperCase().includes("MA001") ||
        //     reportIdStr.toUpperCase().includes("NBE_MAT_ANL_MA001")
        // ) {
        //     validationResult = await validateTemplate(file, reportIdStr);
        // } else {
        //     validationResult = { isValid: true } as any;
        // }
        // if (!validationResult.isValid) {
        //     return new Response(
        //         JSON.stringify({
        //             error:
        //                 validationResult.errorMessage ||
        //                 "This is not the exact template file."
        //         }),
        //         {
        //             status: 400,
        //             headers: { "Content-Type": "application/json" }
        //         }
        //     );
        // }

        // 2. Process NN001 Report Format
        if (
            reportIdStr.toUpperCase().includes("NN001") ||
            reportIdStr.toUpperCase().includes("NACNN001")
        ) {
            const procRes = await processNN001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process NN001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // Process FB001 Report Format
        else if (reportIdStr.toUpperCase().includes("FB001")) {
            const procRes: any = await processFB001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process FB001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // Process BP001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("BP001") ||
            reportIdStr.toUpperCase().includes("DP001") ||
            reportIdStr.toUpperCase().includes("INT_FRE_SP")
        ) {
            const procRes: any = await processBP001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process BP001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // Process MWAL001 Report Format
        else if (reportIdStr.toUpperCase().includes("MWAL001")) {
            const procRes: any = await processMWAL001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process MWAL001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // Process MWAC001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("MWAC001") ||
            reportIdStr.toUpperCase().includes("LCMWAC001") ||
            reportIdStr.toUpperCase().includes("WALIR")
        ) {
            const procRes: any = await processMWAC001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process MWAC001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // Process LB002 Report Format
        else if (
            reportIdStr.toUpperCase().includes("LB002") ||
            reportIdStr.toUpperCase().includes("BOR_TEN_PER_LB002")
        ) {
            const procRes: any = await processLB002Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process LB002 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // Process BSD_LOAN_PART13002 Report Format
        else if (
            reportIdStr.toUpperCase().includes("13002") ||
            reportIdStr.toUpperCase().includes("BSD_LOAN_PART13002")
        ) {
            const procRes: any = await process13002Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process 13002 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 3. Process ZS001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("ZS001") ||
            reportIdStr.toUpperCase().includes("LSR")
        ) {
            const procRes: any = await processZS001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process ZS001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 4. Process OL001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("OL001") ||
            reportIdStr.toUpperCase().includes("COL_ACQ_18M_OL001")
        ) {
            const procRes = await processOL001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process OL001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 5. Process MA001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("MA001") ||
            reportIdStr.toUpperCase().includes("NBE_MAT_ANL_MA001")
        ) {
            const procRes = await processMA001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process MA001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 6. Process MK001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("MK001") ||
            reportIdStr.toUpperCase().includes("KEY BALANCE SHEET")
        ) {
            const procRes: any = await processMK001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process MK001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 7. Process MB001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("MB001") ||
            reportIdStr.toUpperCase().includes("MB001MB001")
        ) {
            const procRes: any = await processMB001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process MB001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 8. Process SRRYY001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("SRR") ||
            reportIdStr.toUpperCase().includes("SRRYY001")
        ) {
            const procRes = await processSRRYY001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process SRRYY001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 9. Process RB001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("RB001") ||
            reportIdStr.toUpperCase().includes("RESERVE BASE")
        ) {
            const procRes: any = await processRB001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process RB001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 10. Process ZS001 Report Format (Duplicate block check)
        else if (
            reportIdStr.toUpperCase().includes("ZS001") ||
            reportIdStr.toUpperCase().includes("LSR")
        ) {
            const procRes: any = await processZS001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process ZS001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 11. Process KK001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("KK001") ||
            reportIdStr.toUpperCase().includes("M_CC")
        ) {
            const procRes: any = await processKK001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process KK001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 12. Process REGRL002 Report Format
        else if (
            reportIdStr.toUpperCase().includes("RL002") ||
            reportIdStr.toUpperCase().includes("REGRL002") ||
            reportIdStr.toUpperCase().includes("LOAN_RAN")
        ) {
            const procRes = await processREGRL002Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process REGRL002 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 13. Process MD002 Report Format
        else if (
            reportIdStr.toUpperCase().includes("MD002") ||
            reportIdStr.toUpperCase().includes("CDBY") ||
            reportIdStr.toUpperCase().includes("SECTOR AND REG")
        ) {
            const procRes = await processMD002Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process MD002 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 14. Process DPWADP001 Report Format
        else if (
            reportIdStr.toUpperCase().includes("DPWADP001") ||
            reportIdStr.toUpperCase().includes("DPW")
        ) {
            const procRes: any = await processDPWADP001Report(
                instCode,
                filePath,
                startDateStr,
                endDateStr,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process DPWADP001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 15. Process BD_L&A_BD001 Report Format
        else if (reportIdStr.toUpperCase().includes("BD_L&A_BD001")) {
            const procRes: any = await processBD001Report(
                inputFile,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process BD_L&A_BD001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 16. Process IFB_LON_R & RWW002 Report Format
        else if (reportIdStr.toUpperCase().includes("IFB_LON_R & RWW002")) {
            const procRes: any = await processRWW001Report(
                inputFile,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process IFB_LON_R & RWW002 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 17. Process LOA_ADV_OUT_LA001 Report Format
        else if (reportIdStr.toUpperCase().includes("LOA_ADV_OUT_LA001")) {
            const procRes: any = await processLA001Report(
                inputFile,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process LOA_ADV_OUT_LA001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
        // 18. Process LOA_PORT_EP001 Report Format
        else if (reportIdStr.toUpperCase().includes("LOA_PORT_EP001")) {
            const procRes: any = await processEP001Report(
                inputFile,
                filePath,
                jsonFilePath
            );
            if (!procRes.success) {
                return new Response(
                    JSON.stringify({
                        error:
                            procRes.error ||
                            "Failed to process LOA_PORT_EP001 template file."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }
    } catch (procErr: any) {
        console.error("Error processing report template format:", procErr);
        return new Response(
            JSON.stringify({
                error:
                    procErr.message ||
                    "Failed to process uploaded Excel template."
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
};
