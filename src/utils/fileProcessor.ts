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
import { processRWW002Report } from "./services/RWW002/RWW002";
import { processLA001Report } from "./services/LA001/LA001";
import { processEP001Report } from "./services/EP001/EP001";
import { processMWAC001Report } from "./services/MWAC001/MWAC001";
import { process13002Report } from "./services/BSD_LOAN_PART13002/13002";
import { processLL001Report } from "./services/LL001/LL001";
import { processNL001Report } from "./services/NL001/NL001";
import { processLP001Report } from "./services/LP001/LP001";
import { processRA002Report } from "./services/RA002/RA002";
import { processWAADIR001Report } from "./services/WAADIR001/WAADIR001";
import { processCM002Report } from "./services/CM002/CM002";
import { processIF002Report } from "./services/IF002/IF002";
import { processLC001Report } from "./services/LC001/LC001";
import { processRD002Report } from "./services/RD002/RD002";
import { processRS002Report } from "./services/RS002/RS002";
import { processZZ002Report } from "./services/ZZ002/ZZ002";
import { processSE002Report } from "./services/SE002/SE002";
import { processNE001Report } from "./services/NE001/NE001";
import { processMR001Report } from "./services/MR001/MR001";
import { processXW002Report } from "./services/XW002/XW002";
import { processGS001Report } from "./services/GS001/GS001";
import { processDR002Report } from "./services/DR002/DR002";
import { processDS003Report } from "./services/DS003/DS003";
import { processID002Report } from "./services/ID002/ID002";
import { processRI003Report } from "./services/RI003/RI003";
import { processDL001Report } from "./services/DL001/DL001";
import { processEE002Report } from "./services/EE002/EE002";
import { processSR002Report } from "./services/SR002/SR002";
import { processTB001Report } from "./services/TB001/TB001";
import { processTN001Report } from "./services/TN001/TN001";
import { processBS001Report } from "./services/BS001/BS001";
import { processPL001Report } from "./services/PL001/PL001";
import { processQC001Report } from "./services/QC001/QC001";
import { processQO001Report } from "./services/QO001/QO001";
import { processQI001Report } from "./services/QI001/QI001";

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
        const validationResult = await validateTemplate(inputFile, reportIdStr);
        if (!validationResult.isValid) {
            throw new Error(
                validationResult.errorMessage ||
                    `Uploaded file does not match the selected template format (${reportIdStr}).`
            );
        }

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
                processor = processRWW002Report;
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
            case "LOAN_RAN&REG_RA002":
                processor = processRA002Report;
                break;
            case "LOAN_CLA&PROV_LP001":
                processor = processLP001Report;
                break;
            case "WAADIR001":
                processor = processWAADIR001Report;
                break;
            case "CDby Range and RegCM002":
                processor = processCM002Report;
                break;
            case "DIFIF002":
                processor = processIF002Report;
                break;
            case "M_LCPLC001":
                processor = processLC001Report;
                break;
            case "DIR RANGERD002":
                processor = processRD002Report;
                break;
            case "LOAN_SEC & REGRS002":
                processor = processRS002Report;
                break;
            case "IFB_LON_S & RZZ002":
                processor = processZZ002Report;
                break;
            case "LOAN_SEC&REG_SE002":
                processor = processSE002Report;
                break;
            case "NPL_ECPOMNE001":
                processor = processNE001Report;
                break;
            case "NBE_20_DEP_MR001":
                processor = processMR001Report;
                break;
            case "BUIL_CONSTXW002":
                processor = processXW002Report;
                break;
            case "Digital SavingGS001":
                processor = processGS001Report;
                break;
            case "DEP_RAN&REG_DR002":
                processor = processDR002Report;
                break;
            case "DEP_SEC&REG_DS003":
                processor = processDS003Report;
                break;
            case "INT_FRE_RANID002":
                processor = processID002Report;
                break;
            case "INT_FRE_SECRI003":
                processor = processRI003Report;
                break;
            case "DigitalLendingDL001":
                processor = processDL001Report;
                break;
            case "INT_LON_R&R_EE002":
                processor = processEE002Report;
                break;
            case "INT_LON_S&R_SR002":
                processor = processSR002Report;
                break;
            case "TOP_20_BOR_TB001":
                processor = processTB001Report;
                break;
            case "TOP_20_NPLs_TN001":
                processor = processTN001Report;
                break;
            case "BAL_SHEET_BS001":
                processor = processBS001Report;
                break;
            case "PRO&LOS_PL001":
                processor = processPL001Report;
            case "CAP_ADQ_CAP_QC001":
                processor = processQC001Report;
                break;
            case "CAP_ADQ_OFB_QO001":
                processor = processQO001Report;
                break;
            case "CAP_ADQ_ITEM_QI001":
                processor = processQI001Report;
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
                throw new Error(
                    procRes.error ||
                        `Failed to process ${reportIdStr} template file.`
                );
            }
        }
    } catch (procErr: any) {
        console.error("Error processing report template format:", procErr);
        throw new Error(
            procErr.message || "Failed to process uploaded Excel template."
        );
    }
};
