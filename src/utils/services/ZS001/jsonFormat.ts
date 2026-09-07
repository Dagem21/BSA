export const ZS001_ROW_DESCRIPTIONS = [
    "Net current liabilities",
    "Cash - local and foreign currency",
    "Deposits with NBE",
    "Deposits with other local & foreign banks",
    "Treasury bills",
    "Net due from Domestic banks*",
    "Net due from Foreign banks*",
    "Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6)",
    "Excess/deficit (2.7-1.2)"
];

export const ZS001_COL_SUFFIXES = [
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Weekly Average"
];

export const ZS001Format = (
    returnKey: string = "LSR-Statutory ZS001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) =>
        val !== undefined && val !== null ? val.toString() : "";

    const returnItems: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    let codeCounter = 1;
    ZS001_ROW_DESCRIPTIONS.forEach((rowDesc) => {
        const isNetDueRow = rowDesc.includes("Net due from Domestic") || rowDesc.includes("Net due from Foreign");
        ZS001_COL_SUFFIXES.forEach((colSuffix) => {
            const codeStr = `109_${codeCounter.toString().padStart(5, "0")}`;
            codeCounter++;

            let valStr = fmt(valuesMap[codeStr]);
            if (isNetDueRow && (!valStr || valStr === "")) {
                valStr = "0";
            }

            returnItems.push({
                Code: codeStr,
                Value: valStr,
                _description: `${rowDesc}_${colSuffix}`,
                _dataType: "NUMERIC",
                _required: false
            });
        });
    });

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
