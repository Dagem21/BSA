import crypto from "crypto";

export const generateFileName = (reportType?: string) => {
    const uniqueId = crypto.randomBytes(4).toString("hex");
    const currTime = Date.now().toString(36);

    let prefix = reportType?.trim() || "";
    prefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "").toUpperCase();

    const fileName = crypto
        .createHash("sha256")
        .update(currTime + uniqueId + "a")
        .digest("hex");
    return `${prefix}_${fileName}`;
};
