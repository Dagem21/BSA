import { cronService } from "@/cron/cronService";
import dbConnect from "@/utils/mongoConnect";

export async function register() {
    dbConnect();
    cronService();
}
