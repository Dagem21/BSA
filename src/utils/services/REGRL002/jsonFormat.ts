export const REGRL002_REGIONS = [
    "Addis Ababa",
    "Afar",
    "Amhara",
    "Benishangul",
    "Dire Dawa",
    "Gambela",
    "Harari",
    "Oromia",
    "Somalia",
    "Tigray",
    "Sidama",
    "SWERS",
    "CERS",
    "SERS"
];

export const REGRL002_SUB_ROWS = [
    "",
    "Term loan",
    "Overdraft",
    "Merch. Loan*",
    "Urban",
    "Rural"
];

export const REGRL002_RANGES = [
    "<= 100,000",
    ">100,000 - 1million",
    ">1 million - 5 million",
    ">5million - 10 million",
    ">10million - 50 million",
    ">50million -100million",
    ">100 million",
    "Total"
];

export const REGRL002_METRICS = [
    "Amount",
    "  # of Borrowers",
    " # of Accounts  "
];

export const REGRL002Format = (
    returnKey: string = "LOAN_RAN & REGRL002",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    valuesMap: Record<string, string> = {}
) => {
    const fmt = (val: string | number | undefined | null) =>
        val !== undefined && val !== null && val !== "" ? val.toString() : "";

    const returnItemsList: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    let codeCounter = 48782;

    REGRL002_REGIONS.forEach((regName) => {
        REGRL002_SUB_ROWS.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : regName;

            REGRL002_RANGES.forEach((rangeStr) => {
                REGRL002_METRICS.forEach((metricStr) => {
                    const codeStr = `RL002_${codeCounter}`;
                    codeCounter++;

                    let spacingStr = metricStr;
                    if (metricStr.includes("Borrowers")) {
                        if (rangeStr === "<= 100,000" || rangeStr === ">100,000 - 1million" || rangeStr === ">5million - 10 million" || rangeStr === ">100 million") {
                            spacingStr = " " + metricStr.trim();
                        } else if (rangeStr === ">10million - 50 million") {
                            spacingStr = "  " + metricStr.trim();
                        }
                    }

                    const desc = `${rowPrefix}_${rangeStr}_${spacingStr}`;

                    returnItemsList.push({
                        Code: codeStr,
                        Value: fmt(valuesMap[codeStr]),
                        _description: desc,
                        _dataType: "NUMERIC",
                        _required: false
                    });
                });
            });
        });
    });

    // 15. Total Amount Row (Row 101 in Excel, Codes RL002_50798 to RL002_50821)
    REGRL002_RANGES.forEach((rangeStr) => {
        REGRL002_METRICS.forEach((metricStr) => {
            const codeStr = `RL002_${codeCounter}`;
            codeCounter++;

            let spacingStr = metricStr;
            if (metricStr.includes("Borrowers")) {
                if (rangeStr === "<= 100,000" || rangeStr === ">100,000 - 1million" || rangeStr === ">5million - 10 million" || rangeStr === ">100 million") {
                    spacingStr = " " + metricStr.trim();
                } else if (rangeStr === ">10million - 50 million" || rangeStr === "Total") {
                    spacingStr = "  " + metricStr.trim();
                } else if (rangeStr === ">1 million - 5 million" || rangeStr === ">50million -100million") {
                    spacingStr = "  " + metricStr.trim();
                }
            }

            const desc = `Total Amount_${rangeStr}_${spacingStr}`;

            returnItemsList.push({
                Code: codeStr,
                Value: fmt(valuesMap[codeStr]),
                _description: desc,
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
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
};
