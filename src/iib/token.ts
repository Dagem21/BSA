interface Credentials {
    grant_type: string;
    client_id: string;
    client_secret: string;
    scope: string;
}

interface TokenResponse {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
    [key: string]: unknown;
}

const API_URL = process.env.CP4I_API_URL ?? "";

const credentials: Credentials = {
    grant_type: process.env.grant_type ?? "",
    client_id: process.env.client_id ?? "",
    client_secret: process.env.client_secret ?? "",
    scope: process.env.scope ?? ""
};

export const getToken = async (): Promise<TokenResponse | null> => {
    try {
        const formBody = new URLSearchParams(
            credentials as unknown as Record<string, string>
        ).toString();

        const response = await fetch(`${API_URL}/nbe-bsa-oauth/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br"
            },
            body: formBody
        });

        if (!response.ok) {
            throw new Error(
                `Token request failed with status: ${response.status}`
            );
        }

        const data: TokenResponse = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};
