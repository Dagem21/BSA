export const generateFileName = (reportType?: string) => {
    const uploadTime = new Date();
    const timestamp = uploadTime
        .toISOString()
        .slice(0, 13)
        .replace(/-/g, "")
        .replace("T", "_");
    const prefix = reportType?.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = timestamp;
    return prefix ? `${prefix}_${fileName}` : fileName;
};
