import {
    createUser,
    updateUser,
    findUser as findUserDB
} from "@/dal/mongo/userdal";
import { findUser } from "@/lib/activeDir";
import { createToken } from "@/utils/token";
import { writeToLog } from "@/utils/log";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const ActiveDirectory = require("activedirectory2");

const adConfig = {
    url: process.env.LDAP_HOST,
    baseDN: process.env.LDAP_BASE_DN,
    username: process.env.LDAP_USERNAME,
    password: process.env.LDAP_PASSWORD,
    port: process.env.LDAP_PORT
};

const ad = new ActiveDirectory(adConfig);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials." }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        let { email, password } = body;

        email = email?.toLowerCase()?.trim();
        const { user, error } = await findUser(email);
        if (!error && user) {
            email = user.userPrincipalName
                ? user.userPrincipalName?.toLowerCase()
                : user?.mail?.toLowerCase();
            if (email?.slice(-11) !== "@cbe.com.et") email += "@cbe.com.et";

            const auth = await new Promise((resolve, reject) => {
                ad.authenticate(
                    email,
                    password,
                    async (err: any, auth: unknown) => {
                        if (err) reject(err);
                        resolve(auth);
                    }
                );
            });

            if (!auth) {
                return new Response(
                    JSON.stringify({ error: "Invalid credentials." }),
                    {
                        status: 401,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            } else {
                const { displayName, employeeID, userPrincipalName } = user;
                const userDB = await findUserDB({ email: userPrincipalName });

                if (userDB) {
                    const key = {
                        id: userDB?.id,
                        email: userPrincipalName,
                        role: userDB?.role,
                        allowedReports: userDB?.allowedReports
                    };
                    const token = createToken(key);

                    const cookieStore = await cookies();
                    cookieStore.set({
                        name: "session_token",
                        value: token,
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 1,
                        path: "/"
                    });

                    const lastLogin = new Date();
                    await updateUser(userPrincipalName, {
                        lastLogin
                    });

                    return new Response(
                        JSON.stringify({
                            user: {
                                role: userDB.role,
                                allowedReports: userDB.allowedReports,
                                email: userPrincipalName,
                                displayName,
                                employeeID
                            }
                        }),
                        {
                            status: 200,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                } else {
                    return new Response(
                        JSON.stringify({ error: "Invalid credentials." }),
                        {
                            status: 401,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
            }
        } else {
            return new Response(
                JSON.stringify({ error: "Invalid credentials." }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
    } catch (error: any) {
        writeToLog(error, "Login");
        return new Response(JSON.stringify({ error: "Invalid credentials." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
