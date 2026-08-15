import ActiveDirectory from "activedirectory2";

const adConfig = {
    url: process.env.LDAP_HOST || "",
    baseDN: process.env.LDAP_BASE_DN || "",
    username: process.env.LDAP_USERNAME || "",
    password: process.env.LDAP_PASSWORD || "",
    port: process.env.LDAP_PORT || ""
};

const ad = new ActiveDirectory(adConfig);

export const findUser = async (email: string): Promise<any> => {
    try {
        const adUser = await new Promise((resolve, reject) => {
            ad.findUser(email, "", async (err, adUser) => {
                if (!err && adUser) {
                    resolve(adUser);
                } else reject(err);
            });
        });
        return { user: adUser };
    } catch (error) {
        return { error };
    }
};
