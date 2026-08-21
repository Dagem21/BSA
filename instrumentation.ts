import dbConnect from "@/utils/mongoConnect";

export async function register() {
    dbConnect();
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { cronService } = await import("./src/cron/cronService");
        cronService();
    }
}
