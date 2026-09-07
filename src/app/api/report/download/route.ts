import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyUserAuth } from "@/utils/authHelper";
<<<<<<< HEAD
import { authorizeUser } from "@/utils/chechAuthorization";
import { RoleTypes } from "@/types/types";

export async function GET(request: NextRequest) {
    await verifyUserAuth();
    authorizeUser([RoleTypes.Maker, RoleTypes.Checker, RoleTypes.Admin]);
=======
import { generateExcelFromJson } from "@/utils/jsonToExcel";

export async function GET(request: NextRequest) {
    try {
        await verifyUserAuth();
>>>>>>> d458941f293986be4f1d18ad8612a80c6f3e1155

        const searchParams = request.nextUrl.searchParams;
        const fileName = searchParams.get("filename");

        if (!fileName) {
            return NextResponse.json(
                { error: "Filename parameter is required" },
                { status: 400 }
            );
        }

        let safeFileName = path.basename(fileName);
        if (safeFileName.endsWith(".json")) {
            safeFileName = safeFileName.replace(/\.json$/, ".xlsx");
        }
        const excelFilePath = path.join(process.cwd(), "reports", "excel", safeFileName);

        // If Excel file already exists, send it directly
        if (fs.existsSync(excelFilePath)) {
            const fileBuffer = fs.readFileSync(excelFilePath);
            return new NextResponse(new Uint8Array(fileBuffer), {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="${safeFileName}"`,
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            });
        }

        // If Excel file does NOT exist, check for corresponding JSON file and generate Excel on-the-fly
        const jsonFileName = safeFileName.replace(/\.xlsx$/, ".json");
        const jsonFilePath = path.join(process.cwd(), "reports", "json", jsonFileName);

        if (fs.existsSync(jsonFilePath)) {
            const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
            const excelBuffer = await generateExcelFromJson(jsonContent, excelFilePath);

            return new NextResponse(new Uint8Array(excelBuffer), {
                status: 200,
                headers: {
                    "Content-Disposition": `attachment; filename="${safeFileName}"`,
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            });
        }

        return NextResponse.json({ error: `File "${safeFileName}" not found.` }, { status: 404 });
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json({ error: "Session expired. Please login again!" }, { status: 401 });
        }
        return NextResponse.json({ error: err.message || "Failed to download Excel file" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await verifyUserAuth();
        const body = await request.json();

        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid JSON report payload" }, { status: 400 });
        }

        const returnKey = body.ReturnKey || "REPORT";
        const safeFileName = `${returnKey}_export_${Date.now()}.xlsx`;
        const excelFilePath = path.join(process.cwd(), "reports", "excel", safeFileName);

        const excelBuffer = await generateExcelFromJson(body, excelFilePath);

        return new NextResponse(new Uint8Array(excelBuffer), {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="${safeFileName}"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        });
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json({ error: "Session expired. Please login again!" }, { status: 401 });
        }
        return NextResponse.json({ error: err.message || "Failed to generate Excel from JSON payload" }, { status: 500 });
    }
}
