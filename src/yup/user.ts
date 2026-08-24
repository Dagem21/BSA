import * as yup from "yup";

export const userSchema = yup.object().shape({
    email: yup.string().required("Enter a valid email."),
    name: yup.string().required("Name is required."),
    role: yup.string().required("Enter a valid role."),
    allowedReports: yup.array().required("Choose allowed report.")
});

export const userUpdateSchema = yup.object().shape({
    id: yup.string().required("ID is required"),
    role: yup.string(),
    allowedReports: yup.array()
});

export type UserFormValues = yup.InferType<typeof userSchema>;
export type UserUpdateFormValues = yup.InferType<typeof userUpdateSchema>;
