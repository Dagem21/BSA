import * as yup from "yup";

export const reportSchema = yup.object().shape({
    reportId: yup.string().required("Enter a valid report ID."),
    description: yup.string().required("Enter a valid description."),
    frequency: yup.string().required("Enter a valid frequency."),
    service: yup.string().required("Enter a valid service type.")
});

export const reportUpdateSchema = yup.object().shape({
    id: yup.string().required("ID is required"),
    reportId: yup.string(),
    description: yup.string(),
    frequency: yup.string(),
    service: yup.string()
});

export type ReportFormValues = yup.InferType<typeof reportSchema>;
