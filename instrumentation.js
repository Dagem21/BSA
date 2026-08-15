import dbConnect from "@/utils/mongoConnect";

export async function register() {
    dbConnect();
}
