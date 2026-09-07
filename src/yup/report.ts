import { validateNN001Template } from "@/utils/fileValidation";
import * as yup from "yup";

// Helper to reliably extract the File object from File, FileList, or File[]
const extractFile = (value: unknown): File | null => {
    if (!value) return null;
    if (typeof window !== "undefined" && value instanceof FileList)
        return value[0] || null;
    if (Array.isArray(value)) return value[0] || null;
    if (value instanceof File) return value;
    return null;
};

export const reportSchema = yup.object().shape({
    reportType: yup.string().required("Choose a report type."),
    startDate: yup
        .date()
        .transform((value, originalValue) => {
            return originalValue ? new Date(originalValue) : null;
        })
        .required("Enter a valid starting date."),
    endDate: yup
        .date()
        .transform((value, originalValue) => {
            return originalValue ? new Date(originalValue) : null;
        })
        .required("Enter a valid ending date.")
        .test(
            "is-after-start",
            "End date must be after start date.",
            function (endDate) {
                const { startDate } = this.parent;
                if (!startDate || !endDate) return true;
                return new Date(endDate) >= new Date(startDate);
            }
        ),
    file: yup
        .mixed<File | FileList | File[]>()
        .required("Document is required.")
        .test("filePresence", "Document is required.", (value) => {
            const file = extractFile(value);
            return file !== null;
        })
        .test(
            "fileExtension",
            "Invalid format. Only .xls and .xlsx are allowed.",
            (value) => {
                const file = extractFile(value);
                if (!file) return false;
                const fileName = file.name.toLowerCase();
                return fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
            }
        )
        .test(
            "fileFormat",
            "Please use the correct template.",
            async (value, context) => {
                const file = extractFile(value);
                if (!file) return false;
                const reportIdStr = context.parent.reportType || "";

                let validationResult;
                if (
                    reportIdStr.toUpperCase().includes("NN001") ||
                    reportIdStr.toUpperCase().includes("NACNN001") ||
                    reportIdStr.toUpperCase().includes("OL001") ||
                    reportIdStr.toUpperCase().includes("COL_ACQ_18M_OL001") ||
                    reportIdStr.toUpperCase().includes("MA001") ||
                    reportIdStr.toUpperCase().includes("NBE_MAT_ANL_MA001") ||
                    reportIdStr.toUpperCase().includes("MK001") ||
                    reportIdStr.toUpperCase().includes("MB001") ||
                    reportIdStr.toUpperCase().includes("SRR") ||
                    reportIdStr.toUpperCase().includes("RB001") ||
                    reportIdStr.toUpperCase().includes("RESERVE BASE") ||
                    reportIdStr.toUpperCase().includes("ZS001") ||
                    reportIdStr.toUpperCase().includes("LSR") ||
                    reportIdStr.toUpperCase().includes("KK001") ||
                    reportIdStr.toUpperCase().includes("M_CC") ||
                    reportIdStr.toUpperCase().includes("RL002") ||
                    reportIdStr.toUpperCase().includes("REGRL002") ||
                    reportIdStr.toUpperCase().includes("LOAN_RAN") ||
                    reportIdStr.toUpperCase().includes("MD002") ||
                    reportIdStr.toUpperCase().includes("CDBY") ||
                    reportIdStr.toUpperCase().includes("SECTOR AND REG") ||
                    reportIdStr.toUpperCase().includes("DPWADP001") ||
                    reportIdStr.toUpperCase().includes("DPW") ||
                    reportIdStr.toUpperCase().includes("MWAC001") ||
                    reportIdStr.toUpperCase().includes("LCMWAC001") ||
                    reportIdStr.toUpperCase().includes("WALIR") ||
                    reportIdStr.toUpperCase().includes("BP001") ||
                    reportIdStr.toUpperCase().includes("DP001") ||
                    reportIdStr.toUpperCase().includes("INT_FRE_SP") ||
                    reportIdStr.toUpperCase().includes("LB002") ||
                    reportIdStr.toUpperCase().includes("BOR_TEN_PER_LB002")
                ) {
                    validationResult = await validateNN001Template(file, reportIdStr);
                } else {
                    validationResult = { isValid: true } as any;
                }

                if (!validationResult.isValid) {
                    return context.createError({
                        message:
                            validationResult.errorMessage ||
                            "Please use the correct template."
                    });
                }

                return true;
            }
        )
});

export type ReportFormValues = yup.InferType<typeof reportSchema>;
