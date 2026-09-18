export const GS001_CATEGORIES = [
    { prefix: "Demand_", name: "Demand" },
    { prefix: "Saving_", name: "Saving" },
    { prefix: "Time_", name: "Time" },
    { prefix: "Total_", name: "Total" }
];

export const GS001_FIELDS = [
    { key: "depositAmount", descSuffix: "Deposit Amount" },
    { key: "depositorAccounts", descSuffix: "# of depositors accounts" },
    { key: "depositorsCount", descSuffix: "# of depositors" }
];

export const GS001_ITEM_DEFINITIONS = [
    { code: "163_00001", description: "Demand_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00002", description: "Demand_ # of depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00003", description: "Demand_ # of depositors", dataType: "NUMERIC", required: false },
    { code: "163_00004", description: "Saving_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00005", description: "Saving_ # of Depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00006", description: "Saving_ # of Depositors", dataType: "NUMERIC", required: false },
    { code: "163_00007", description: "Time_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00008", description: "Time_ # of Depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00009", description: "Time_ # of Depositors", dataType: "NUMERIC", required: false },
    { code: "163_00010", description: "Total_ Deposit Amount", dataType: "NUMERIC", required: false },
    { code: "163_00011", description: "Total_ # of Depositors accounts", dataType: "NUMERIC", required: false },
    { code: "163_00012", description: "Total_ # of Depositors", dataType: "NUMERIC", required: false }
];

export const GS001Format = (
    returnKey: string = "Digital SavingGS001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string = "2026-04-01T00:00:00",
    endDate: string = "2026-06-30T00:00:00",
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) =>
        val !== undefined && val !== null ? val.toString() : "";

    const returnItems = GS001_ITEM_DEFINITIONS.map((def) => {
        return {
            Code: def.code,
            Value: fmt(valuesMap[def.code]),
            _description: def.description,
            _dataType: def.dataType,
            _required: def.required
        };
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
