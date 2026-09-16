export interface LB002RowData {
    counterpartyName: string;
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

export const LB002Format = (
    returnKey: string = "BOR_TEN_PER_LB002",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    rowsData: LB002RowData[] = []
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

    // Calculate sum of total outstanding balances for item 61
    let sumTotalOutstanding = 0;
    rowsData.forEach((row) => {
        const num = parseFloat(row.totalOutstanding?.toString() || "0");
        if (!isNaN(num)) sumTotalOutstanding += num;
    });

    const returnItems: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    // Construct 121 ReturnItems (LB002_00001 to LB002_00121)
    for (let c = 1; c <= 121; c++) {
        const codeStr = `LB002_${c.toString().padStart(5, "0")}`;

        if (c >= 1 && c <= 20) {
            // Group 1: Name of Counterparty (20 down to 1)
            const idx = 21 - c; // slot 20 down to 1
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.counterpartyName, "TEXT"),
                _description: `Name of Counterparty_${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c >= 21 && c <= 40) {
            // Group 2: Total Outstanding Balance After Deduction Cash and Cash Equivalent (20 down to 1)
            const idx = 41 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.totalOutstanding, "NUMERIC"),
                _description: `Total Outstanding Balance After Deduction Cash and Cash Equivalent_${idx}`,
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c >= 41 && c <= 60) {
            // Group 3: Sector of Exposure (20 down to 1)
            const idx = 61 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.exposureSector, "TEXT"),
                _description: `Sector of Exposure_${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c === 61) {
            // Item 61: Aggregate _Total Outstanding Balance
            returnItems.push({
                Code: codeStr,
                Value: fmt(sumTotalOutstanding, "NUMERIC"),
                _description: "Aggregate _Total Outstanding Balance",
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c >= 62 && c <= 81) {
            // Group 4: Percent of Capital (L=I/K*100) (20 down to 1)
            const idx = 82 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.exposurePctCapital, "NUMERIC"),
                _description: `Percent of Capital (L=I/K*100)_${idx}`,
                _dataType: "NUMERIC",
                _required: true
            });
        } else if (c >= 82 && c <= 101) {
            // Group 5: Status (Classification) (20 down to 1)
            const idx = 102 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.status, "TEXT"),
                _description: `Status (Classification)_${idx}`,
                _dataType: "TEXT",
                _required: true
            });
        } else if (c >= 102 && c <= 121) {
            // Group 6: Capital of the Bank (20 down to 1)
            const idx = 122 - c;
            const row = rowsData[idx - 1];
            returnItems.push({
                Code: codeStr,
                Value: fmt(row?.capital, "NUMERIC"),
                _description: `Capital of the Bank_${idx}`,
                _dataType: "NUMERIC",
                _required: true
            });
        }
    }

    // Construct DynamicItemsList
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
                Value: fmt(row.exposureType, "TEXT"),
                _description: "Type of Exposure",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.3`,
                Value: fmt(row.exposureSector, "TEXT"),
                _description: "Sector of Exposure",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.4`,
                Value: fmt(row.approvedLimit, "NUMERIC"),
                _description: "Approved Limit/Facility",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.5`,
                Value: fmt(row.onBalanceExposure, "NUMERIC"),
                _description: "Exposure Amount/ Outstanding Balance (on-balance sheet)_    A",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: `${rowNum}.6`,
                Value: fmt(row.offBalanceExposure, "NUMERIC"),
                _description: "Off-balance Sheet Exposure Amount (e.g. guarantee)_  B",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: `${rowNum}.7`,
                Value: fmt(row.totalOutstanding, "NUMERIC"),
                _description: "Total Outstanding Balance_    C=A+B",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.8`,
                Value: fmt(row.maturityDate, "DATE"),
                _description: "Maturity Date",
                _dataType: "DATE",
                _required: true
            },
            {
                Code: `${rowNum}.9`,
                Value: fmt(row.capital, "NUMERIC"),
                _description: "Capital",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.10`,
                Value: fmt(row.exposurePctCapital, "NUMERIC"),
                _description: "Exposure Amount (A+B) as Percent of Total Capital",
                _dataType: "NUMERIC",
                _required: true
            },
            {
                Code: `${rowNum}.11`,
                Value: fmt(row.status, "TEXT"),
                _description: "Status (classification)",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.12`,
                Value: fmt(row.collateralType, "TEXT"),
                _description: "Collateral_Type",
                _dataType: "TEXT",
                _required: true
            },
            {
                Code: `${rowNum}.13`,
                Value: fmt(row.collateralValue, "NUMERIC"),
                _description: "Collateral_Estimated/Face value",
                _dataType: "NUMERIC",
                _required: false
            }
        ];
    });

    const dynamicItemsList = [
        {
            Area: 226,
            _areaName: "Monthly Return on Large Exposures List of Counterparties that Exceed Ten Percent of the Bank’s Total Capital ",
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
