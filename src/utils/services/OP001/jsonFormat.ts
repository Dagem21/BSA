import { OpenPosition } from "@/generated/prisma";

export const OP001Format = (
    returnKey: string = "SINGLE CURRENCYOP001",
    instCode: string = "0000001",
    finYear: number,
    startDate: string,
    endDate: string,
    rawData: OpenPosition[]
) => {
    const json = {
        ReturnKey: returnKey,
        InstCode: instCode,
        FinYear: finYear,
        StartDate: startDate,
        EndDate: endDate,
        ReturnItemsList: [
            {
                Code: "164_00001",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.usd || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00002",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.eur || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00003",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.chf || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00004",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.gbp || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00005",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.jpy || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00006",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.djf || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00007",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.kes || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00008",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.inr || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00009",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.dkk || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00010",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.sek || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00011",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.sar || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00012",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.cad || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00013",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.aed || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00014",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.aud || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00015",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.cny || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00016",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.nok || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00017",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.kwd || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00018",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.ssp || "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00019",
                Value: "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00020",
                Value: "0",
                _description:
                    "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00021",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.usd || "0",
                _description: "Currency on hand_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00022",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.eur || "0",
                _description: "Currency on hand_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00023",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.chf || "0",
                _description: "Currency on hand_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00024",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.gbp || "0",
                _description: "Currency on hand_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00025",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.jpy || "0",
                _description: "Currency on hand_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00026",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.djf || "0",
                _description: "Currency on hand_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00027",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.kes || "0",
                _description: "Currency on hand_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00028",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.inr || "0",
                _description: "Currency on hand_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00029",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.dkk || "0",
                _description: "Currency on hand_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00030",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.sek || "0",
                _description: "Currency on hand_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00031",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.sar || "0",
                _description: "Currency on hand_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00032",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.cad || "0",
                _description: "Currency on hand_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00033",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.aed || "0",
                _description: "Currency on hand_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00034",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.aud || "0",
                _description: "Currency on hand_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00035",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.cny || "0",
                _description: "Currency on hand_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00036",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.nok || "0",
                _description: "Currency on hand_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00037",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.kwd || "0",
                _description: "Currency on hand_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00038",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Currency on Hand"
                    )?.[0]?.ssp || "0",
                _description: "Currency on hand_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00039",
                Value: "0",
                _description: "Currency on hand_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00040",
                Value: "0",
                _description: "Currency on hand_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00041",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.usd || "0",
                _description: "Due from banks_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00042",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.eur || "0",
                _description: "Due from banks_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00043",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.chf || "0",
                _description: "Due from banks_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00044",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.gbp || "0",
                _description: "Due from banks_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00045",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.jpy || "0",
                _description: "Due from banks_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00046",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.djf || "0",
                _description: "Due from banks_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00047",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.kes || "0",
                _description: "Due from banks_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00048",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.inr || "0",
                _description: "Due from banks_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00049",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.dkk || "0",
                _description: "Due from banks_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00050",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.sek || "0",
                _description: "Due from banks_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00051",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.sar || "0",
                _description: "Due from banks_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00052",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.cad || "0",
                _description: "Due from banks_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00053",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.aed || "0",
                _description: "Due from banks_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00054",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.aud || "0",
                _description: "Due from banks_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00055",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.cny || "0",
                _description: "Due from banks_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00056",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.nok || "0",
                _description: "Due from banks_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00057",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.kwd || "0",
                _description: "Due from banks_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00058",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Due from Banks"
                    )?.[0]?.ssp || "0",
                _description: "Due from banks_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00059",
                Value: "0",
                _description: "Due from banks_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00060",
                Value: "0",
                _description: "Due from banks_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00061",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.usd || "0",
                _description: "Cheques and items in transit_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00062",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.eur || "0",
                _description: "Cheques and items in transit_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00063",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.chf || "0",
                _description: "Cheques and items in transit_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00064",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.gbp || "0",
                _description: "Cheques and items in transit_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00065",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.jpy || "0",
                _description: "Cheques and items in transit_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00066",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.djf || "0",
                _description: "Cheques and items in transit_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00067",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.kes || "0",
                _description: "Cheques and items in transit_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00068",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.inr || "0",
                _description: "Cheques and items in transit_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00069",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.dkk || "0",
                _description: "Cheques and items in transit_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00070",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.sek || "0",
                _description: "Cheques and items in transit_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00071",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.sar || "0",
                _description: "Cheques and items in transit_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00072",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.cad || "0",
                _description: "Cheques and items in transit_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00073",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.aed || "0",
                _description: "Cheques and items in transit_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00074",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.aud || "0",
                _description: "Cheques and items in transit_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00075",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.cny || "0",
                _description: "Cheques and items in transit_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00076",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.nok || "0",
                _description: "Cheques and items in transit_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00077",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.kwd || "0",
                _description: "Cheques and items in transit_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00078",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Cheques and items in transit"
                    )?.[0]?.ssp || "0",
                _description:
                    "Cheques and items in transit_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00079",
                Value: "0",
                _description:
                    "Cheques and items in transit_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00080",
                Value: "0",
                _description:
                    "Cheques and items in transit_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00081",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.usd || "0",
                _description: "Loans and Advances_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00082",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.eur || "0",
                _description: "Loans and Advances_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00083",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.chf || "0",
                _description: "Loans and Advances_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00084",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.gbp || "0",
                _description: "Loans and Advances_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00085",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.jpy || "0",
                _description: "Loans and Advances_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00086",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.djf || "0",
                _description: "Loans and Advances_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00087",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.kes || "0",
                _description: "Loans and Advances_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00088",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.inr || "0",
                _description: "Loans and Advances_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00089",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.dkk || "0",
                _description: "Loans and Advances_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00090",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.sek || "0",
                _description: "Loans and Advances_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00091",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.sar || "0",
                _description: "Loans and Advances_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00092",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.cad || "0",
                _description: "Loans and Advances_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00093",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.aed || "0",
                _description: "Loans and Advances_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00094",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.aud || "0",
                _description: "Loans and Advances_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00095",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.cny || "0",
                _description: "Loans and Advances_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00096",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.nok || "0",
                _description: "Loans and Advances_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00097",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.kwd || "0",
                _description: "Loans and Advances_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00098",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Loan and Advance"
                    )?.[0]?.ssp || "0",
                _description: "Loans and Advances_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00099",
                Value: "0",
                _description: "Loans and Advances_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00100",
                Value: "0",
                _description: "Loans and Advances_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00101",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.usd || "0",
                _description: "Accrued interest receivables_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00102",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.eur || "0",
                _description: "Accrued interest receivables_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00103",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.chf || "0",
                _description: "Accrued interest receivables_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00104",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.gbp || "0",
                _description: "Accrued interest receivables_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00105",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.jpy || "0",
                _description: "Accrued interest receivables_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00106",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.djf || "0",
                _description: "Accrued interest receivables_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00107",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.kes || "0",
                _description: "Accrued interest receivables_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00108",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.inr || "0",
                _description: "Accrued interest receivables_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00109",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.dkk || "0",
                _description: "Accrued interest receivables_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00110",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.sek || "0",
                _description: "Accrued interest receivables_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00111",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.sar || "0",
                _description: "Accrued interest receivables_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00112",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.cad || "0",
                _description: "Accrued interest receivables_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00113",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.aed || "0",
                _description: "Accrued interest receivables_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00114",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.aud || "0",
                _description: "Accrued interest receivables_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00115",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.cny || "0",
                _description: "Accrued interest receivables_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00116",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.nok || "0",
                _description: "Accrued interest receivables_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00117",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.kwd || "0",
                _description: "Accrued interest receivables_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00118",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Accurued interest recivable"
                    )?.[0]?.ssp || "0",
                _description:
                    "Accrued interest receivables_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00119",
                Value: "0",
                _description:
                    "Accrued interest receivables_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00120",
                Value: "0",
                _description:
                    "Accrued interest receivables_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00121",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.usd || "0",
                _description: "Other assets_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00122",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.eur || "0",
                _description: "Other assets_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00123",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.chf || "0",
                _description: "Other assets_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00124",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.gbp || "0",
                _description: "Other assets_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00125",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.jpy || "0",
                _description: "Other assets_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00126",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.djf || "0",
                _description: "Other assets_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00127",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.kes || "0",
                _description: "Other assets_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00128",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.inr || "0",
                _description: "Other assets_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00129",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.dkk || "0",
                _description: "Other assets_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00130",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.sek || "0",
                _description: "Other assets_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00131",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.sar || "0",
                _description: "Other assets_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00132",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.cad || "0",
                _description: "Other assets_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00133",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.aed || "0",
                _description: "Other assets_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00134",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.aud || "0",
                _description: "Other assets_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00135",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.cny || "0",
                _description: "Other assets_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00136",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.nok || "0",
                _description: "Other assets_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00137",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.kwd || "0",
                _description: "Other assets_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00138",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other Assets"
                    )?.[0]?.ssp || "0",
                _description: "Other assets_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00139",
                Value: "0",
                _description: "Other assets_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00140",
                Value: "0",
                _description: "Other assets_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00141",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.usd || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00142",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.eur || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00143",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.chf || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00144",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.gbp || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00145",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.jpy || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00146",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.djf || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00147",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.kes || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00148",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.inr || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00149",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.dkk || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00150",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.sek || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00151",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.sar || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00152",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.cad || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00153",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.aed || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00154",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.aud || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00155",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.cny || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00156",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.nok || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00157",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.kwd || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00158",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.ssp || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00159",
                Value: "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00160",
                Value: "0",
                _description:
                    "Off-balance Sheet Items (Sum of 1.2.1 to 1.2.4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00161",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.usd || "0",
                _description: "Undelivered spot purchase_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00162",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.eur || "0",
                _description: "Undelivered spot purchase_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00163",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.chf || "0",
                _description: "Undelivered spot purchase_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00164",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.gbp || "0",
                _description: "Undelivered spot purchase_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00165",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.jpy || "0",
                _description: "Undelivered spot purchase_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00166",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.djf || "0",
                _description: "Undelivered spot purchase_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00167",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.kes || "0",
                _description: "Undelivered spot purchase_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00168",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.inr || "0",
                _description: "Undelivered spot purchase_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00169",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.dkk || "0",
                _description: "Undelivered spot purchase_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00170",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.sek || "0",
                _description: "Undelivered spot purchase_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00171",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.sar || "0",
                _description: "Undelivered spot purchase_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00172",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.cad || "0",
                _description: "Undelivered spot purchase_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00173",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.aed || "0",
                _description: "Undelivered spot purchase_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00174",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.aud || "0",
                _description: "Undelivered spot purchase_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00175",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.cny || "0",
                _description: "Undelivered spot purchase_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00176",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.nok || "0",
                _description: "Undelivered spot purchase_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00177",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.kwd || "0",
                _description: "Undelivered spot purchase_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00178",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Undeliverd spot purchase"
                    )?.[0]?.ssp || "0",
                _description:
                    "Undelivered spot purchase_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00179",
                Value: "0",
                _description:
                    "Undelivered spot purchase_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00180",
                Value: "0",
                _description:
                    "Undelivered spot purchase_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00181",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.usd || "0",
                _description: "Forward purchase_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00182",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.eur || "0",
                _description: "Forward purchase_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00183",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.chf || "0",
                _description: "Forward purchase_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00184",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.gbp || "0",
                _description: "Forward purchase_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00185",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.jpy || "0",
                _description: "Forward purchase_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00186",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.djf || "0",
                _description: "Forward purchase_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00187",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.kes || "0",
                _description: "Forward purchase_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00188",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.inr || "0",
                _description: "Forward purchase_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00189",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.dkk || "0",
                _description: "Forward purchase_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00190",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.sek || "0",
                _description: "Forward purchase_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00191",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.sar || "0",
                _description: "Forward purchase_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00192",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.cad || "0",
                _description: "Forward purchase_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00193",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.aed || "0",
                _description: "Forward purchase_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00194",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.aud || "0",
                _description: "Forward purchase_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00195",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.cny || "0",
                _description: "Forward purchase_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00196",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.nok || "0",
                _description: "Forward purchase_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00197",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.kwd || "0",
                _description: "Forward purchase_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00198",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Forward purchase"
                    )?.[0]?.ssp || "0",
                _description: "Forward purchase_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00199",
                Value: "0",
                _description: "Forward purchase_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00200",
                Value: "0",
                _description: "Forward purchase_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00201",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.usd || "0",
                _description: "Option, Swaps, Derivatives_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00202",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.eur || "0",
                _description: "Option, Swaps, Derivatives_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00203",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.chf || "0",
                _description: "Option, Swaps, Derivatives_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00204",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.gbp || "0",
                _description: "Option, Swaps, Derivatives_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00205",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.jpy || "0",
                _description: "Option, Swaps, Derivatives_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00206",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.djf || "0",
                _description: "Option, Swaps, Derivatives_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00207",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.kes || "0",
                _description: "Option, Swaps, Derivatives_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00208",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.inr || "0",
                _description: "Option, Swaps, Derivatives_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00209",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.dkk || "0",
                _description: "Option, Swaps, Derivatives_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00210",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.sek || "0",
                _description: "Option, Swaps, Derivatives_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00211",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.sar || "0",
                _description: "Option, Swaps, Derivatives_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00212",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.cad || "0",
                _description: "Option, Swaps, Derivatives_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00213",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.aed || "0",
                _description: "Option, Swaps, Derivatives_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00214",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.aud || "0",
                _description: "Option, Swaps, Derivatives_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00215",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.cny || "0",
                _description: "Option, Swaps, Derivatives_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00216",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.nok || "0",
                _description: "Option, Swaps, Derivatives_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00217",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.kwd || "0",
                _description: "Option, Swaps, Derivatives_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00218",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Option, Swaps, Derivatives"
                    )?.[0]?.ssp || "0",
                _description:
                    "Option, Swaps, Derivatives_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00219",
                Value: "0",
                _description:
                    "Option, Swaps, Derivatives_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00220",
                Value: "0",
                _description:
                    "Option, Swaps, Derivatives_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00221",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.usd || "0",
                _description: "Other assets_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00222",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.eur || "0",
                _description: "Other assets_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00223",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.chf || "0",
                _description: "Other assets_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00224",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.gbp || "0",
                _description: "Other assets_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00225",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.jpy || "0",
                _description: "Other assets_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00226",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.djf || "0",
                _description: "Other assets_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00227",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.kes || "0",
                _description: "Other assets_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00228",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.inr || "0",
                _description: "Other assets_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00229",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.dkk || "0",
                _description: "Other assets_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00230",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.sek || "0",
                _description: "Otherassets_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00231",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.sar || "0",
                _description: "Other assets_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00232",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.cad || "0",
                _description: "Other assets_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00233",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.aed || "0",
                _description: "Other assets_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00234",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.aud || "0",
                _description: "Other assets_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00235",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.cny || "0",
                _description: "Other assets_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00236",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.nok || "0",
                _description: "Other assets_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00237",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.kwd || "0",
                _description: "Other assets_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00238",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup === "Other assets"
                    )?.[0]?.ssp || "0",
                _description: "Other assets_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00239",
                Value: "0",
                _description: "Other assets_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00240",
                Value: "0",
                _description: "Other assets_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00241",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.usd || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00242",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.eur || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00243",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.chf || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00244",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.gbp || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00245",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.jpy || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00246",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.djf || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00247",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.kes || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00248",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.inr || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00249",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.dkk || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00250",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.sek || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00251",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.sar || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00252",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.cad || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00253",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.aed || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00254",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.aud || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00255",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.cny || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00256",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.nok || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00257",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.kwd || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00258",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.ssp || "0",
                _description:
                    "Total Foreign Assets (Sum 1.1 and 1.2)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00259",
                Value: "0",
                _description:
                    "Total Foreign Assets (Sum 1.1 and 1.2)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00260",
                Value: "0",
                _description:
                    "Total Foreign Assets (Sum 1.1 and 1.2)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00261",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.usd || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00262",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.eur || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00263",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.chf || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00264",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.gbp || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00265",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.jpy || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00266",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.djf || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00267",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.kes || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00268",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.inr || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00269",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.dkk || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00270",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.sek || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00271",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.sar || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00272",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.cad || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00273",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.aed || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00274",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.aud || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00275",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.cny || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00276",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.nok || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00277",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.kwd || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00278",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.newDetailGroup ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.ssp || "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00279",
                Value: "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00280",
                Value: "0",
                _description:
                    "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            }
        ]
    };
    return json;
};
