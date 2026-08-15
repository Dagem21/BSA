import { validateLC001Template } from "@/utils/fileValidation";
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
    startDate: yup.string().required("Enter a valid starting date."),
    endDate: yup
        .string()
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

                const validation = await validateLC001Template(file);

                if (!validation.isValid) {
                    return context.createError({
                        message:
                            validation.errorMessage ||
                            "Please use the correct template."
                    });
                }

                return true;
            }
        )
});

export type ReportFormValues = yup.InferType<typeof reportSchema>;
