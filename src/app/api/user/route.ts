import {
    createUser,
    findUser as findUserDB,
    findUsers,
    updateUser
} from "@/dal/mongo/userdal";
import { findUser } from "@/lib/activeDir";
import { writeToLog } from "@/utils/log";
import { NextRequest } from "next/server";
import { UserDto } from "@/dto/user";
import { verifyUserAuth } from "@/utils/authHelper";
import { authorizeUser } from "@/utils/chechAuthorization";
import { RoleTypes } from "@/types/types";

export async function POST(request: NextRequest) {
    try {
        const decodedToken = await verifyUserAuth();
        authorizeUser([RoleTypes.Admin]);

        const body = await request.json();
        if (!body) {
            return new Response(
                JSON.stringify({ error: "Missing required fields." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        let { email, role, allowedReports } = body;

        email = email?.toLowerCase()?.trim();
        const { user, error } = await findUser(email);
        if (!error && user) {
            email = user.userPrincipalName
                ? user.userPrincipalName?.toLowerCase()
                : user?.mail?.toLowerCase();
            if (email?.slice(-11) !== "@cbe.com.et") email += "@cbe.com.et";

            const { userPrincipalName } = user;
            const userDB = await findUserDB({ email: userPrincipalName });

            if (userDB) {
                return new Response(
                    JSON.stringify({
                        error: "User already registed."
                    }),
                    {
                        status: 409,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            } else {
                const user: UserDto = {
                    email: userPrincipalName,
                    role,
                    allowedReports,
                    createdBy: decodedToken?.id
                };
                const { created } = await createUser(user);
                if (created) {
                    return new Response(
                        JSON.stringify({
                            error: "User registed."
                        }),
                        {
                            status: 201,
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                }
                return new Response(
                    JSON.stringify({
                        error: "User registration failed."
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
        } else {
            return new Response(JSON.stringify({ error: "User not found." }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return new Response(
                JSON.stringify({
                    error: "Session expired. Please login again!"
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        writeToLog(error, "Register");
        return new Response(
            JSON.stringify({ error: "An error has occured." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

export async function GET() {
    try {
        await verifyUserAuth();
        authorizeUser([RoleTypes.Admin]);

        const filter: UserDto = {};
        const users = await findUsers(filter);

        return new Response(
            JSON.stringify({
                message: "Users fetched.",
                users
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return new Response(
                JSON.stringify({
                    error: "Session expired. Please login again!"
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        writeToLog(error, "Fetch users");
        return new Response(
            JSON.stringify({ error: "An error has occured." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await verifyUserAuth();
        authorizeUser([RoleTypes.Admin]);

        const body = await request.json();
        if (!body) {
            return new Response(
                JSON.stringify({ error: "Missing required fields." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        let { id, role, allowedReports } = body;

        const userDB = await findUserDB({ _id: id });

        if (userDB) {
            const update: UserDto = { role, allowedReports };
            const { found, updated } = await updateUser(id, update);
            if (found && updated) {
                return new Response(
                    JSON.stringify({
                        error: "User updated."
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
            return new Response(
                JSON.stringify({
                    error: "User not updated."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        } else {
            return new Response(
                JSON.stringify({
                    error: "User not found."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return new Response(
                JSON.stringify({
                    error: "Session expired. Please login again!"
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        writeToLog(error, "Register");
        return new Response(
            JSON.stringify({ error: "An error has occured." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
