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

export async function GET(request: NextRequest) {
    try {
        await verifyUserAuth();
        authorizeUser([RoleTypes.Admin]);

        const searchParams = request?.nextUrl?.searchParams;

        let email = searchParams.get("email");
        if (!email) {
            return new Response(
                JSON.stringify({
                    error: "Email missing."
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        email = email?.toLowerCase()?.trim();
        const { user, error } = await findUser(email);
        if (!error && user) {
            const { displayName, employeeID, userPrincipalName } = user;
            const aduser = {
                email: userPrincipalName,
                name: displayName,
                employeeID
            };
            return new Response(
                JSON.stringify({
                    message: "User found.",
                    user: aduser
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
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
