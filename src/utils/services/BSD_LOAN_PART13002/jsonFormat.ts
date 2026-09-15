export interface PART13002RowData {
    counterpartyName: string;
    counterpartyNature: string;
    exposureType: string;
    exposureSector: string;
    approvedLimit: string | number;
    onBalanceExposure: string | number;
    offBalanceExposure: string | number;
    totalOutstanding: string | number;
    maturityDate: string;
    capital: string | number;
    exposurePctCapital: string | number;
    status: string;
    collateralType: string;
    collateralValue: string | number;
}

export const PART13002Format = (
    returnKey: string = "BSD_LOAN_PART13002",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: PART13002RowData[] = []
) => {
    const fmt = (val: string | number | undefined | null, dataType: "TEXT" | "NUMERIC" | "DATE" = "NUMERIC") => {
        if (val !== undefined && val !== null) {
            let str = val.toString().trim();
            if (
                str !== "" &&
                str !== "-" &&
                str !== "—" &&
                str !== "–" &&
                str !== "--" &&
                str.toLowerCase() !== "n/a" &&
                str.toLowerCase() !== "nil"
            ) {
                if (dataType === "DATE") {
                    if (str.includes("T")) {
                        return str.split("T")[0];
                    }
                    const d = new Date(str);
                    if (!isNaN(d.getTime())) {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        return `${yyyy}-${mm}-${dd}`;
                    }
                }
                return str;
            }
        }
        if (dataType === "DATE") return "";
        return dataType === "TEXT" ? "-" : "0";
    };

    // Calculate sums for aggregates
    let sumTotalOutstanding = 0;
    let sumCapital = 0;
    rowsData.forEach((row) => {
        const numOut = parseFloat(row.totalOutstanding?.toString() || "0");
        if (!isNaN(numOut)) sumTotalOutstanding += numOut;

        const numCap = parseFloat(row.capital?.toString() || "0");
        if (!isNaN(numCap) && sumCapital === 0) sumCapital = numCap;
    });

    const returnItems: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    // Construct 142 ReturnItems (13002_00001 to 13002_00142)
    for (let c = 1; c <= 142; c++) {
        const codeStr = `13002_${c.toString().padStart(5, "0")}`;

        if (c >= 1 && c <= 20) {
            // Group 1: Name of Counterparty (20 down to 1)
            const idx = 21 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.counterpartyName, "TEXT"),
                _description: `Name of Counterparty_${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c >= 21 && c <= 40) {
            // Group 2: Nature of Counterparty (20 down to 1)
            const idx = 41 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.counterpartyNature, "TEXT"),
                _description: `Nature of Counterparty _${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c >= 41 && c <= 60) {
            // Group 3: Total Outstanding Balance After Deduction Cash and Cash Equivalent (20 down to 1)
            const idx = 61 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.totalOutstanding, "NUMERIC"),
                _description: `Total Outstanding Balance After Deduction Cash and Cash Equivalent_${idx}`,
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c >= 61 && c <= 80) {
            // Group 4: Sector of Exposure (20 down to 1)
            const idx = 81 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.exposureSector, "TEXT"),
                _description: `Sector of Exposure_${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c >= 81 && c <= 100) {
            // Group 5: Percent of Capital (M=J/L*100) (20 down to 1)
            const idx = 101 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.exposurePctCapital, "NUMERIC"),
                _description: `Percent of Capital (M=J/L*100)_${idx}`,
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c >= 101 && c <= 120) {
            // Group 6: Status (Classification) (20 down to 1)
            const idx = 121 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.status, "TEXT"),
                _description: `Status (Classification)_${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c >= 121 && c <= 140) {
            // Group 7: Capital of the Bank (20 down to 1)
            const idx = 141 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.capital, "NUMERIC"),
                _description: `Capital of the Bank_${idx}`,
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c === 141) {
            // Item 141: Aggregate _Capital
            returnItems.push({
                Code: codeStr,
                Value: fmt(sumCapital, "NUMERIC"),
                _description: "Aggregate _Capital",
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c === 142) {
            // Item 142: Aggregate _Total Outstanding Balance
            returnItems.push({
                Code: codeStr,
                Value: fmt(sumTotalOutstanding, "NUMERIC"),
                _description: "Aggregate _Total Outstanding Balance",
                _dataType: "NUMERIC",
                _required: true
            });
        }
    }

    // Construct DynamicItemsList for Area 225
    const dynamicItems = rowsData.map((row, index) => {
        const rowNum = index + 1;
        return [
            {
                Code: `${rowNum}.1`,
                Value: fmt(row.counterpartyName, "TEXT"),
                _description: "Name of Counterparty*",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.2`,
                Value: fmt(row.counterpartyNature, "TEXT"),
                _description: "Nature of Counterparty (e.g. influential shareholder, director, subsidiary ….)",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.3`,
                Value: fmt(row.exposureType, "TEXT"),
                _description: "Type of Exposure",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.4`,
                Value: fmt(row.exposureSector, "TEXT"),
                _description: "Sector of Exposure",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.5`,
                Value: fmt(row.approvedLimit, "NUMERIC"),
                _description: "Approved Limit/Facility",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.6`,
                Value: fmt(row.onBalanceExposure, "NUMERIC"),
                _description: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: `${rowNum}.7`,
                Value: fmt(row.offBalanceExposure, "NUMERIC"),
                _description: "Off-balance Sheet Exposure Amount (e.g. guarantee)_   B",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: `${rowNum}.8`,
                Value: fmt(row.totalOutstanding, "NUMERIC"),
                _description: "Total Outstanding Balance_     C=A+B",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.9`,
                Value: fmt(row.maturityDate, "DATE"),
                _description: "Maturity Date",
                _dataType: "DATE",
                _required: true
            },
            {
                Code: `${rowNum}.10`,
                Value: fmt(row.capital, "NUMERIC"),
                _description: "Capital",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.11`,
                Value: fmt(row.exposurePctCapital, "NUMERIC"),
                _description: "Exposure Amount (A+B) as Percent of Total Capital",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.12`,
                Value: fmt(row.status, "TEXT"),
                _description: "Status (classification)",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.13`,
                Value: fmt(row.collateralType, "TEXT"),
                _description: "Collateral_Type",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.14`,
                Value: fmt(row.collateralValue, "NUMERIC"),
                _description: "Collateral_Estimated/Face value",
                _dataType: "NUMERIC",
                _required: false
            }
        ];
    });

    const dynamicItemsList = [
        {
            Area: 225,
            _areaName: "Monthly Returns on Related Party Transactions List of Related Party Exposures",
            DynamicItems: dynamicItems.flat()
        }
    ];

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: returnItems,
        DynamicItemsList: dynamicItemsList
    };
};
