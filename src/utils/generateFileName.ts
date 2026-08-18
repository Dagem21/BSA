import crypto from "crypto";

export const generateFileName = () => {
    const uniqueId = crypto.randomBytes(4).toString("hex");
    const currTime = Date.now().toString(36);

    const fileName = crypto
        .createHash("sha256")
        .update(currTime + uniqueId + "a")
        .digest("hex");
    return fileName;
};
