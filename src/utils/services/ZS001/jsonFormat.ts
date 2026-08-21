export const ZS001Format = (
    returnKey: string = "LSR-Statutory ZS001",
    instCode: string = "0000001",
    finYear: number = 2026,
    startDate: string,
    endDate: string,
    calculatedData: {
        netLiab: Record<string, number>;
        cashCurr: Record<string, number>;
        depNbe: Record<string, number>;
        depBanks: Record<string, number>;
        tBills: Record<string, number>;
        dueDom: Record<string, number>;
        dueFor: Record<string, number>;
        liqAssets: Record<string, number>;
        excessDef: Record<string, number>;
    }
) => {
    const days = ["thu", "fri", "sat", "sun", "mon", "tue", "wed", "avg"];
    const dayNames = [
        "Thu",
        "Fri",
        "Sat",
        "Sun",
        "Mon",  
        "Tue",
        "Wed",
        "Weekly Average"
    ];

    const items: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required: boolean;
    }> = [];

    const fmt = (val: number | undefined) =>
        val !== undefined && val !== null && !isNaN(val) ? val.toString() : "";

    // 1. Net current liabilities (109_00001 - 109_00008)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 1).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.netLiab[day]),
            _description: `Net current liabilities_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 2. Cash - local and foreign currency (109_00009 - 109_00016)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 9).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.cashCurr[day]),
            _description: `Cash - local and foreign currency_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 3. Deposits with NBE (109_00017 - 109_00024)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 17).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.depNbe[day]),
            _description: `Deposits with NBE_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 4. Deposits with other local & foreign banks (109_00025 - 109_00032)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 25).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.depBanks[day]),
            _description: `Deposits with other local & foreign banks_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 5. Treasury bills (109_00033 - 109_00040)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 33).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.tBills[day]),
            _description: `Treasury bills_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 6. Net due from Domestic banks* (109_00041 - 109_00048)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 41).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.dueDom[day]),
            _description: `Net due from Domestic banks*_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 7. Net due from Foreign banks* (109_00049 - 109_00056)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 49).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.dueFor[day]),
            _description: `Net due from Foreign banks*_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 8. Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6) (109_00057 - 109_00064)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 57).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.liqAssets[day]),
            _description: `Total liquid assets (=sum 2.1 to 2.4 less 2.5 & 2.6)_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    // 9. Excess/deficit (2.7-1.2) (109_00065 - 109_00072)
    days.forEach((day, idx) => {
        const codeNum = String(idx + 65).padStart(5, "0");
        items.push({
            Code: `109_${codeNum}`,
            Value: fmt(calculatedData.excessDef[day]),
            _description: `Excess/deficit (2.7-1.2)_${dayNames[idx]}`,
            _dataType: "NUMERIC",
            _required: false
        });
    });

    return {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: items,
        DynamicItemsList: []
    };
};
