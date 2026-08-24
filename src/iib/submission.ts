import { getToken } from "./token";

const API_URL = process.env.CP4I_API_URL ?? "";

const credentials: Record<string, string> = {
    IIB_authorization: process.env.IIB_authorization ?? "",
    bsa_username: process.env.bsa_username ?? "",
    bsa_password: process.env.bsa_password ?? "",
    bsa_version: process.env.bsa_version ?? "",
    bsa_referenceID: process.env.bsa_referenceID ?? ""
};

export const postReport = async (payload: JSON) => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/nbe_bsa/v1/Submission`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                Authorization: `${token?.token_type} ${token?.access_token}`,
                IIB_Authorization: credentials.IIB_authorization,
                Username: credentials.bsa_username,
                Password: credentials.bsa_password,
                Version: credentials.bsa_version,
                ReferenceID: credentials.bsa_referenceID
            },
            body: JSON.stringify(payload)
        });

        const data: any = await response.json();
        if (response.ok && Object.keys(data ?? {}).length) {
            if (data?.filename) {
                return { submitted: true, response: data };
            } else {
                let message =
                    data?.[""]?.errors?.[0]?.errorMessage ||
                    data?.message ||
                    data?.httpMessage ||
                    data;
                return { submitted: false, response: message };
            }
        }

        let message =
            data?.[""]?.errors?.[0]?.errorMessage ||
            data?.message ||
            data?.httpMessage ||
            data;
        return { submitted: false, response: message };
    } catch (e: any) {
        console.log(e);
        return { submitted: false, response: e.message };
    }
};
