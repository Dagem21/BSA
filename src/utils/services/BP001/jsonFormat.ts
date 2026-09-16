export interface BP001ValuesMap {
    [code: string]: number | string;
}

export const BP001Format = (
    returnKey: string = "INT_FRE_SP_BP001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    valuesMap: BP001ValuesMap = {}
) => {
    const fmt = (val: number | string | undefined | null) => {
        if (val === undefined || val === null) return "";
        const str = val.toString().trim();
        if (
            str === "" ||
            str === "-" ||
            str === "—" ||
            str === "–" ||
            str === "--" ||
            str.toLowerCase() === "n/a" ||
            str.toLowerCase() === "nil"
        ) {
            return "";
        }
        return str;
    };

    const returnItems = [
        { Code: "29_00001", Value: fmt(valuesMap["29_00001"]), _description: "Income_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00002", Value: fmt(valuesMap["29_00002"]), _description: "Income derived from trade financing_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00003", Value: fmt(valuesMap["29_00003"]), _description: "Income derived from Ijara (leasing)_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00004", Value: fmt(valuesMap["29_00004"]), _description: "Income derived from Mudarabah investment_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00005", Value: fmt(valuesMap["29_00005"]), _description: "Income derived from Musharakah investment_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00006", Value: fmt(valuesMap["29_00006"]), _description: "Charges & commissions (=5.1+5.2)_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00007", Value: fmt(valuesMap["29_00007"]), _description: "Charges & commissions- local_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00008", Value: fmt(valuesMap["29_00008"]), _description: "Charges & commissions-foreign_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00009", Value: fmt(valuesMap["29_00009"]), _description: "Gain on foreign Exchange _Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00010", Value: fmt(valuesMap["29_00010"]), _description: "Other income_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00011", Value: fmt(valuesMap["29_00011"]), _description: "Total distributable income(Sum 1.1-1.7)_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00012", Value: fmt(valuesMap["29_00012"]), _description: "Income attributable to depositors/investors_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00013", Value: fmt(valuesMap["29_00013"]), _description: "Total income(=1.8-1.9)_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00014", Value: fmt(valuesMap["29_00014"]), _description: "Expenses_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00015", Value: fmt(valuesMap["29_00015"]), _description: "Staff salaries and benefits_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00016", Value: fmt(valuesMap["29_00016"]), _description: "Sharia Advisory Committee fee (if any)_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00017", Value: fmt(valuesMap["29_00017"]), _description: "Administrative and General expense_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00018", Value: fmt(valuesMap["29_00018"]), _description: "Other expense_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00019", Value: fmt(valuesMap["29_00019"]), _description: "Operating income before tax and provisions[1.10-(sum 2.1-2.4)]_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00020", Value: fmt(valuesMap["29_00020"]), _description: "Impairment losses on financing, investment, Ijarah financing and others_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00021", Value: fmt(valuesMap["29_00021"]), _description: "Total net income before tax(2.5-2.6)_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00022", Value: fmt(valuesMap["29_00022"]), _description: "Business profit tax Payable_Amount", _dataType: "NUMERIC", _required: false },
        { Code: "29_00023", Value: fmt(valuesMap["29_00023"]), _description: "Net income after tax & provisions (2.7-2.9)_Amount", _dataType: "NUMERIC", _required: false }
    ];

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
