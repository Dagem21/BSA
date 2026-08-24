import { getToken } from "./token";

const API_URL = process.env.CP4I_API_URL ?? "";

const credentials: Record<string, string> = {
    IIB_authorization: process.env.IIB_authorization ?? "",
    bsa_username: process.env.bsa_username ?? "",
    bsa_password: process.env.bsa_password ?? "",
    bsa_version: process.env.bsa_version ?? "",
    bsa_referenceID: process.env.bsa_referenceID ?? ""
};

export const getReportStatus = async (fileName: string) => {
    try {
        if (!fileName) {
            return {
                fetched: false,
                status: null,
                error: "Missing file name."
            };
        }
        const token = await getToken();
        const response = await fetch(
            `${API_URL}/nbe_bsa/v1/Status?fileName=${fileName}`,
            {
                method: "GET",
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
                }
            }
        );

        const data: any = await response.json();
        if (response.ok && Object.keys(data ?? {}).length) {
            return { fetched: true, status: data };
        }
        return { fetched: false, status: data };
    } catch (e: any) {
        return { fetched: false, status: e.message };
    }
};
