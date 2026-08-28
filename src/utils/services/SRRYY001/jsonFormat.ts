export const SRRYY001_ROW_DESCRIPTIONS = [
    "Net Average Reserve Base (Previous Calendar Month)",
    "Daily Reserve Requirement in Maintenance Period (5% of 1)",
    "Payment and Settlement Account Balance with NBE in Maintenance Period",
    "Excess/Deficiency in Reserve (3 minus 2)",
    "Reserve Ratio (3/1*100)"
];

export const SRRYY001_COL_SUFFIXES = [
    ...Array.from({ length: 35 }, (_, i) => `Day ${i + 1}`),
    "Monthly Average"
];

export const SRRYY001Format = (
    returnKey: string = "SRRYY001",
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
    SRRYY001_ROW_DESCRIPTIONS.forEach((rowDesc) => {
        SRRYY001_COL_SUFFIXES.forEach((colSuffix) => {
            const codeStr = `165_${codeCounter.toString().padStart(5, "0")}`;
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
