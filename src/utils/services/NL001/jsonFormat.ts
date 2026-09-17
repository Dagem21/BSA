export interface NL001ItemDefinition {
    code: string;
    description: string;
    dataType: string;
    required: boolean;
}

export const NL001_ITEM_DEFINITIONS: NL001ItemDefinition[] = [
    { code: "9_00001", description: "1-Total non-performing loans (sum 2-4)", dataType: "NUMERIC", required: false },
    { code: "9_00002", description: "2-Total substandard loans", dataType: "NUMERIC", required: false },
    { code: "9_00003", description: "2,1- Realizable security", dataType: "NUMERIC", required: false },
    { code: "9_00004", description: "2,2-Net substandard loans (2-2.1)", dataType: "NUMERIC", required: false },
    { code: "9_00005", description: "2,3-Specific provisions required (20% of 2.2)", dataType: "NUMERIC", required: false },
    { code: "9_00006", description: "2,4-Specific provisions held", dataType: "NUMERIC", required: false },
    { code: "9_00007", description: "2,5-Excess/shortfall (2.4-2.3)", dataType: "NUMERIC", required: false },
    { code: "9_00008", description: "2,6-Number of classified loans", dataType: "NUMERIC", required: false },
    { code: "9_00009", description: "3-Total doubtful loans", dataType: "NUMERIC", required: false },
    { code: "9_00010", description: "3,1-Realizable security", dataType: "NUMERIC", required: false },
    { code: "9_00011", description: "3,2-Net doubtful loans (3-3.1)", dataType: "NUMERIC", required: false },
    { code: "9_00012", description: "3,3-Specific provisions required (50% of 3.2)", dataType: "NUMERIC", required: false },
    { code: "9_00013", description: "3,4-Specific provisions held", dataType: "NUMERIC", required: false },
    { code: "9_00014", description: "3,5-Excess/shortfall (3.4 – 3.3)", dataType: "NUMERIC", required: false },
    { code: "9_00015", description: "3,6-Number of classified loans", dataType: "NUMERIC", required: false },
    { code: "9_00016", description: "4-Total loss loans", dataType: "NUMERIC", required: false },
    { code: "9_00017", description: "4,1-Realizable security", dataType: "NUMERIC", required: false },
    { code: "9_00018", description: "4,2-Net loss loans (4-4.1)", dataType: "NUMERIC", required: false },
    { code: "9_00019", description: "4,3-Specific provisions required (100% of 4.2)", dataType: "NUMERIC", required: false },
    { code: "9_00020", description: "4,4-Specific provisions held", dataType: "NUMERIC", required: false },
    { code: "9_00021", description: "4,5-Excess/shortfall (4.4-4.3)", dataType: "NUMERIC", required: false },
    { code: "9_00022", description: "4,6-Number of classified loans", dataType: "NUMERIC", required: false }
];

export const NL001Format = (
    returnKey: string = "NPL&PRO_NL001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    itemValuesMap: Record<string, string | number | null | undefined> = {}
) => {
    const fmt = (val: string | number | null | undefined): string => {
        if (val === null || val === undefined) return "0";
        const str = val.toString().trim();
        return str === "" ? "0" : str;
    };

    const returnItemsList = NL001_ITEM_DEFINITIONS.map((def) => ({
        Code: def.code,
        Value: fmt(itemValuesMap[def.code]),
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
};
