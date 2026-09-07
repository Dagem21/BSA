import { WAADIR001 } from "@/generated/prisma";

export const jsonFormat = (
    returnKey: string,
    instCode: string,
    finYear: number,
    startDate: string,
    endDate: string,
    rawData: WAADIR001[]
) => {
    const dynamicItems: Array<any> = [];
    for (let i = 0; i < rawData.length; i++) {
        const element = rawData[i];
        let depositType = "";
        switch (element.TYPE) {
            case "FIXED":
                depositType = "Time Deposit";
                break;
            case "DEMAND":
                depositType = "Demand Deposit";
                break;
            case "SAVING":
                depositType = "Saving Deposit";
                break;
            default:
                break;
        }

        const dpty = {
            Code: `${i + 1}.1`,
            Value: depositType,
            _description: "Deposit Type ",
            _dataType: "DATE",
            _required: true
        };
        const dpct = {
            Code: `${i + 1}.2`,
            Value: element.OWNERSHIP_DESC,
            _description: "Deposit Category ",
            _dataType: "TEXT",
            _required: true
        };
        const tda = {
            Code: `${i + 1}.3`,
            Value: element.BALANCE,
            _description: "Total Deposit Amount  ( in\nMn Birr)",
            _dataType: "NUMERIC",
            _required: true
        };
        const ndac = {
            Code: `${i + 1}.4`,
            Value: element.NUMBERS,
            _description: "No. of Deposit \nAccounts by \nCategory ",
            _dataType: "NUMERIC",
            _required: true
        };
        const lirminr = {
            Code: `${i + 1}.5`,
            Value: element.MINIMUM_RATE,
            _description:
                "Lending Interest Rates (% per annum)_ Minimum Rate \nby Deposit \ncategory",
            _dataType: "NUMERIC",
            _required: true
        };
        const lirmaxr = {
            Code: `${i + 1}.6`,
            Value: element.MAXIMUM_RATE,
            _description:
                "Lending Interest Rates (% per annum)_ Maximum Rate \nby Deposit \ncategory",
            _dataType: "NUMERIC",
            _required: true
        };
        const lirwarc = {
            Code: `${i + 1}.7`,
            Value: element.WEIGHED_AVERAGE,
            _description:
                "Lending Interest Rates (% per annum)_ Weighted \nAverage Rate \nby Deposit \ncategory ",
            _dataType: "NUMERIC",
            _required: true
        };
        const lirwart = {
            Code: `${i + 1}.8`,
            Value: element.WEIGHT_BY_TYPE,
            _description:
                "Lending Interest Rates (% per annum) _Weighted Average Rate \nby Deposit Type",
            _dataType: "NUMERIC",
            _required: true
        };

        dynamicItems.push(dpty);
        dynamicItems.push(dpct);
        dynamicItems.push(tda);
        dynamicItems.push(ndac);
        dynamicItems.push(lirminr);
        dynamicItems.push(lirmaxr);
        dynamicItems.push(lirwarc);
        dynamicItems.push(lirwart);
    }

    const json = {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: [],
        DynamicItemsList: [
            {
                Area: 215,
                _areaName:
                    "Monthly Weighted Average Deposit Interest Rates (Conventional Banks)",
                DynamicItems: dynamicItems
            }
        ]
    };
    return json;
};
