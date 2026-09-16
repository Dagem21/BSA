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
import { processLL001Report } from "./services/LL001/LL001";
import { processNL001Report } from "./services/NL001/NL001";
import { processLP001Report } from "./services/LP001/LP001";

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

        let procRes: any = { success: false };
        let processor: Function | null = null;
        switch (reportIdStr) {
            case "NACNN001":
                processor = processNN001Report;
                break;
            case "INT_FRE_BS_FB001":
                processor = processFB001Report;
                break;
            case "INT_FRE_SP_BP001":
                processor = processBP001Report;
                break;
            case "DPWADP001":
                processor = processBP001Report;
                break;
            case "IFBLCMWAL001":
                processor = processMWAL001Report;
                break;
            case "LCMWAC001": // TODO WALIR?? which report is this
                processor = processMWAC001Report;
                break;
            case "BOR_TEN_PER_LB002":
                processor = processLB002Report;
                break;
            case "BSD_LOAN_PART13002":
                processor = process13002Report;
                break;
            case "LSR-Statutory ZS001":
                processor = processZS001Report;
                break;
            case "COL_ACQ_18M_OL001":
                processor = processOL001Report;
                break;
            case "NBE_MAT_ANL_MA001":
                processor = processMA001Report;
                break;
            case "Key Balance SheetMK001":
                processor = processMK001Report;
                break;
            case "MB001MB001":
                processor = processMB001Report;
                break;
            case "SRRYY001":
                processor = processSRRYY001Report;
                break;
            case "Reserve BaseRB001":
                processor = processRB001Report;
                break;
            case "M_CC-On & OffKK001":
                processor = processKK001Report;
                break;
            case "LOAN_RAN & REGRL002":
                processor = processREGRL002Report;
                break;
            case "CDby Sector and RegMD002":
                processor = processMD002Report;
                break;
            case "DPWADP001":
                processor = processDPWADP001Report;
                break;
            case "BD_L&A_BD001":
                processor = processBD001Report;
                break;
            case "IFB_LON_R & RWW002":
                processor = processRWW001Report;
                break;
            case "LOA_ADV_OUT_LA001":
                processor = processLA001Report;
                break;
            case "LOA_PORT_EP001":
                processor = processEP001Report;
                break;
            case "COL_SOL_18M_LL001":
                processor = processLL001Report;
                break;
            case "NPL&PRO_NL001":
                processor = processNL001Report;
                break;
            case "LP001": // TODO check the real ID of LP001
                processor = processLP001Report;
                break;
            default:
                break;
        }

        if (processor) {
            procRes = await processor(
                instCode,
                inputFile,
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
                            `Failed to process ${reportIdStr} template file.`
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        }

        // 21. Process WAADIR001 Report Format
        // else if (reportIdStr.toUpperCase().includes("WAADIR001")) {
        //     const procRes: any = await processWAADIR001Report(
        //         instCode,
        //         inputFile,
        //         startDateStr,
        //         endDateStr,
        //         jsonFilePath
        //     );
        //     if (!procRes.success) {
        //         return new Response(
        //             JSON.stringify({
        //                 error:
        //                     procRes.error ||
        //                     "Failed to process LL001 template file."
        //             }),
        //             {
        //                 status: 400,
        //                 headers: { "Content-Type": "application/json" }
        //             }
        //         );
        //     }
        // }
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
