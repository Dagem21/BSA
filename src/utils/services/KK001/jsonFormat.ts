export const KK001_DESCRIPTIONS: Array<{ code: string; desc: string }> = [
    { code: "123_00001", desc: "TOTAL CAPITAL (17.1+17.2)" },
    { code: "123_00002", desc: "Primary capital(sum 17.1.1-17.1.3)" },
    { code: "123_00003", desc: "Paid up capital" },
    { code: "123_00004", desc: "Share Premium" },
    { code: "123_00005", desc: "General reserves" },
    { code: "123_00006", desc: "Legal reserves" },
    { code: "123_00007", desc: "Supplementary capital (specify)" },
    { code: "123_00008", desc: "Risk-weighted assets (RWA) (18.1+18.2)" },
    { code: "123_00009", desc: "On balance sheet (9)" },
    { code: "123_00010", desc: "Off balance sheet (16)" },
    { code: "123_00011", desc: "Ratios (%)" },
    { code: "123_00012", desc: "Primary capital to RWA (17.1/18)" },
    { code: "123_00013", desc: "Total capital to RWA (17/18)" }
];

export const KK001Format = (
    returnKey: string = "M_CC-On & OffKK001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) => {
        if (val !== undefined && val !== null) {
            const str = val.toString().trim();
            if (
                str !== "" &&
                str !== "-" &&
                str !== "—" &&
                str !== "–" &&
                str !== "--" &&
                str.toLowerCase() !== "n/a" &&
                str.toLowerCase() !== "nil"
            ) {
                return str;
            }
        }
        return "0";
    };

    const returnItems = KK001_DESCRIPTIONS.map((item) => ({
        Code: item.code,
        Value: fmt(valuesMap[item.code]),
        _description: item.desc,
        _dataType: "NUMERIC",
        _required: false
    }));

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: []
    };
};
