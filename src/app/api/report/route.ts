import { service } from "@/cron/FCY Daily Open position/service";
import { findReports } from "@/dal/mongo/reportdal";
import { findOpenPositions } from "@/dal/sql/fcyOpenPositions";
import { verifyUserAuth } from "@/utils/authHelper";
import { writeToLog } from "@/utils/log";

export async function GET() {
    try {
        await verifyUserAuth();

        const reports = await findReports();
        if (reports) {
            return new Response(
                JSON.stringify({
                    message: "Reports fetched.",
                    reports
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
        return new Response(
            JSON.stringify({
                error: "Fetch failed."
            }),
            {
                status: 400,
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
        writeToLog(error, "Fetch Report");
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST() {
    try {
        await service();
        const positions = await findOpenPositions();
        return new Response(
            JSON.stringify({
                message: "Fetched.",
                positions
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error: any) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
