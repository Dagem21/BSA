export const RB001_ROW_DESCRIPTIONS = [
    "Reserve Base (1.1+1.2+1.3)",
    "Demand/Current Deposits ",
    "Saving Deposits",
    "Time Deposits",
    "Deductions (2.1+2.2)",
    "Un-cleared checks paid-local",
    "Un-cleared effects- foreign",
    "Net Reserve Base  (1 minus 2)"
];

export const RB001_COL_SUFFIXES = [
    ...Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    "Monthly Average"
];

export const RB001Format = (
    returnKey: string = "Reserve BaseRB001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) =>
        val !== undefined && val !== null && val !== "" ? val.toString() : "";

    const returnItems: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    let codeCounter = 1;
    RB001_ROW_DESCRIPTIONS.forEach((rowDesc) => {
        RB001_COL_SUFFIXES.forEach((colSuffix) => {
            const codeStr = `166_${codeCounter.toString().padStart(5, "0")}`;
            codeCounter++;

            returnItems.push({
                Code: codeStr,
                Value: fmt(valuesMap[codeStr]),
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
