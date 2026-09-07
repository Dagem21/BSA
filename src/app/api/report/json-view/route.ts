import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyUserAuth } from "@/utils/authHelper";

export async function GET(request: NextRequest) {
    try {
        await verifyUserAuth();
        const searchParams = request.nextUrl.searchParams;
        let fileName = searchParams.get("filename");
        const reportTypeFilter = searchParams.get("type")?.toUpperCase();

        const jsonDir = path.join(process.cwd(), "reports", "json");

        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }

        let availableFiles = fs.readdirSync(jsonDir).filter((f) => f.endsWith(".json"));

        if (reportTypeFilter) {
            availableFiles = availableFiles.filter((f) => f.toUpperCase().includes(reportTypeFilter));
        }

        if (!fileName || fileName.trim() === "" || fileName === "undefined" || fileName === "null") {
            if (availableFiles.length === 0) {
                // If filtered readdir is empty, fallback to any json file
                availableFiles = fs.readdirSync(jsonDir).filter((f) => f.endsWith(".json"));
            }

            if (availableFiles.length === 0) {
                return NextResponse.json(
                    { error: "No JSON report files found on server." },
                    { status: 404 }
                );
            }

            // Sort by modified time descending to pick latest
            availableFiles.sort((a, b) => {
                const statA = fs.statSync(path.join(jsonDir, a));
                const statB = fs.statSync(path.join(jsonDir, b));
                return statB.mtimeMs - statA.mtimeMs;
            });

            fileName = availableFiles[0];
        }

        const safeFileName = path.basename(fileName);
        const filePath = path.join(jsonDir, safeFileName);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: `JSON report file "${safeFileName}" not found.` },
                { status: 404 }
            );
        }

        const content = fs.readFileSync(filePath, "utf8");
        const jsonContent = JSON.parse(content);

        const allJsonFiles = fs.readdirSync(jsonDir).filter((f) => f.endsWith(".json"));

        return NextResponse.json({
            fileName: safeFileName,
            data: jsonContent,
            availableFiles: allJsonFiles
        });
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return NextResponse.json(
                { error: "Session expired. Please login again!" },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: err.message || "Failed to fetch JSON report file" },
            { status: 500 }
        );
    }
}
