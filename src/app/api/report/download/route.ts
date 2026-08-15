// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyUserAuth } from "@/utils/authHelper";

export async function GET(request: NextRequest) {
    await verifyUserAuth();

    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get("filename");

    if (!fileName) {
        return NextResponse.json(
            { error: "Filename parameter is required" },
            { status: 400 }
        );
    }

    const safeFileName = path.basename(fileName);
    const filePath = path.join(process.cwd(), "reports/excel", safeFileName);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
            "Content-Disposition": `attachment; filename="${safeFileName}"`,
            "Content-Type": "application/octet-stream"
        }
    });
}
