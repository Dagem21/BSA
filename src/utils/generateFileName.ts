export const generateFileName = (reportType?: string) => {
    const uploadTime = new Date();
    const year = uploadTime.getFullYear();
    const month = String(uploadTime.getMonth() + 1).padStart(2, "0");
    const day = String(uploadTime.getDate()).padStart(2, "0");
    const hours = String(uploadTime.getHours()).padStart(2, "0");
    const timestamp = `${year}${month}${day}_${hours}`;

    let prefix = reportType?.trim() || "";
    if (prefix.toUpperCase().includes("OL001")) {
        prefix = "OL001";
    } else if (prefix.toUpperCase().includes("MA001")) {
        prefix = "MA001";
    } else if (prefix.toUpperCase().includes("MB001")) {
        prefix = "MB001";
    } else if (prefix.toUpperCase().includes("MK001")) {
        prefix = "MK001";
    } else if (prefix.toUpperCase().includes("KK001") || prefix.toUpperCase().includes("M_CC")) {
        prefix = "KK001";
    } else if (prefix.toUpperCase().includes("RL002") || prefix.toUpperCase().includes("REGRL002") || prefix.toUpperCase().includes("LOAN_RAN")) {
        prefix = "REGRL002";
    } else if (prefix.toUpperCase().includes("MD002") || prefix.toUpperCase().includes("CDBY") || prefix.toUpperCase().includes("SECTOR AND REG")) {
        prefix = "MD002";
    } else if (prefix.toUpperCase().includes("DPWADP001") || prefix.toUpperCase().includes("DPW")) {
        prefix = "DPWADP001";
    } else if (prefix.toUpperCase().includes("RB001") || prefix.toUpperCase().includes("RESERVE BASE")) {
        prefix = "RB001";
    } else if (prefix.toUpperCase().includes("SRR")) {
        prefix = "SRRYY001";
    } else if (prefix.toUpperCase().includes("ZS001") || prefix.toUpperCase().includes("LSR")) {
        prefix = "ZS001";
    } else if (prefix.toUpperCase().includes("NN001")) {
        prefix = "NN001";
    } else if (prefix.toUpperCase().includes("OP001")) {
        prefix = "OP001";
    } else if (prefix.toUpperCase().includes("ZS001")) {
        prefix = "ZS001";
    } else {
        prefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "");
    }

    return prefix ? `${prefix}_${timestamp}` : timestamp;
};
