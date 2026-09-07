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
        return dataType === "TEXT" ? " " : "0";
    };

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
        ReturnItemsList: [],
        DynamicItemsList: dynamicItemsList
    };
};
