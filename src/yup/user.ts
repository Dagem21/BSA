import * as yup from "yup";

export const userSchema = yup.object().shape({
    email: yup.string().required("Enter a valid email."),
    role: yup.string().required("Enter a valid role."),
    allowedReports: yup.array().required("Choose allowed report.")
});

export type UserFormValues = yup.InferType<typeof userSchema>;
