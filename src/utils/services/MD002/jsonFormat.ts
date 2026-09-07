export const MD002_REGIONS = [
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

export const MD002_SUB_ROWS = [
    "",
    "Demand",
    "Saving",
    "Time",
    "Urban",
    "Rural"
];

export const MD002_SECTORS = [
    "Pub.  Enterprise",
    "Private & Coop.",
    "Regional Gov.",
    "Banks",
    "Others",
    "Total "
];

export const MD002_METRICS = [
    "Amount",
    "# of Depositors",
    "# of Accounts"
];

export const MD002Format = (
    returnKey: string = "CDby Sector and RegMD002",
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

    let codeCounter = 47252;

    MD002_REGIONS.forEach((regName) => {
        MD002_SUB_ROWS.forEach((subRow) => {
            const rowPrefix = subRow ? `${regName}_${subRow}` : regName;

            MD002_SECTORS.forEach((sec) => {
                MD002_METRICS.forEach((metric) => {
                    const codeStr = `MD002_${codeCounter}`;
                    codeCounter++;

                    let secSpacing = sec;
                    let metricSpacing = metric;

                    if (sec === "Private & Coop." && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                        secSpacing = " Private & Coop.";
                    }
                    if (sec === "Regional Gov." && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                        secSpacing = " Regional Gov.";
                    }
                    if (sec === "Banks" && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                        secSpacing = " Banks";
                    }

                    if (sec === "Pub.  Enterprise" && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                        metricSpacing = " " + metric + " ";
                    } else if (metric.includes("Depositors") || metric.includes("Accounts")) {
                        metricSpacing = metric + " ";
                    }
                    if (sec === "Others" && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                        metricSpacing = " " + metric + " ";
                    }
                    if (sec === "Total " && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                        metricSpacing = " " + metric + " ";
                    }

                    const desc = `${rowPrefix}_${secSpacing}_${metricSpacing}`;

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

    // 15. Total Deposits Row (Row 100 in Excel, Codes MD002_48764 to MD002_48781)
    MD002_SECTORS.forEach((sec) => {
        MD002_METRICS.forEach((metric) => {
            const codeStr = `MD002_${codeCounter}`;
            codeCounter++;

            let secSpacing = sec;
            let metricSpacing = metric;

            if (sec === "Private & Coop." && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                secSpacing = " Private & Coop.";
            }
            if (sec === "Regional Gov." && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                secSpacing = " Regional Gov.";
            }
            if (sec === "Banks" && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                secSpacing = " Banks";
            }

            if (sec === "Pub.  Enterprise" && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                metricSpacing = " " + metric + " ";
            } else if (metric.includes("Depositors") || metric.includes("Accounts")) {
                metricSpacing = metric + " ";
            }
            if (sec === "Others" && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                metricSpacing = " " + metric + " ";
            }
            if (sec === "Total " && (metric.includes("Depositors") || metric.includes("Accounts"))) {
                metricSpacing = " " + metric + " ";
            }

            const desc = `Total Deposits_${secSpacing}_${metricSpacing}`;

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
