import { OpenPosition } from "@/generated/prisma";
import { Decimal } from "@/generated/prisma/runtime/client";

export const OP001Format = (
    returnKey: string,
    instCode: string,
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.USD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.EUR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.CHF || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.GBP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.JPY || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.DJF || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.KES || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.INR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.DKK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.SEK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.SAR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.CAD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.AED || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.AUD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.CNY || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.NOK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.KWD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.USD || "0",
                _description: "Currency on hand_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00022",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.EUR || "0",
                _description: "Currency on hand_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00023",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.CHF || "0",
                _description: "Currency on hand_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00024",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.GBP || "0",
                _description: "Currency on hand_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00025",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.JPY || "0",
                _description: "Currency on hand_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00026",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.DJF || "0",
                _description: "Currency on hand_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00027",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.KES || "0",
                _description: "Currency on hand_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00028",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.INR || "0",
                _description: "Currency on hand_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00029",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.DKK || "0",
                _description: "Currency on hand_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00030",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.SEK || "0",
                _description: "Currency on hand_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00031",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.SAR || "0",
                _description: "Currency on hand_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00032",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.CAD || "0",
                _description: "Currency on hand_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00033",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.AED || "0",
                _description: "Currency on hand_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00034",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.AUD || "0",
                _description: "Currency on hand_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00035",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.CNY || "0",
                _description: "Currency on hand_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00036",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.NOK || "0",
                _description: "Currency on hand_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00037",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.KWD || "0",
                _description: "Currency on hand_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00038",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Currency on Hand"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.USD || "0",
                _description: "Due from banks_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00042",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.EUR || "0",
                _description: "Due from banks_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00043",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.CHF || "0",
                _description: "Due from banks_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00044",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.GBP || "0",
                _description: "Due from banks_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00045",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.JPY || "0",
                _description: "Due from banks_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00046",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.DJF || "0",
                _description: "Due from banks_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00047",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.KES || "0",
                _description: "Due from banks_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00048",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.INR || "0",
                _description: "Due from banks_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00049",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.DKK || "0",
                _description: "Due from banks_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00050",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.SEK || "0",
                _description: "Due from banks_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00051",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.SAR || "0",
                _description: "Due from banks_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00052",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.CAD || "0",
                _description: "Due from banks_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00053",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.AED || "0",
                _description: "Due from banks_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00054",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.AUD || "0",
                _description: "Due from banks_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00055",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.CNY || "0",
                _description: "Due from banks_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00056",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.NOK || "0",
                _description: "Due from banks_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00057",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.KWD || "0",
                _description: "Due from banks_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00058",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Due from Banks"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.USD || "0",
                _description: "Cheques and items in transit_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00062",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.EUR || "0",
                _description: "Cheques and items in transit_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00063",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.CHF || "0",
                _description: "Cheques and items in transit_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00064",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.GBP || "0",
                _description: "Cheques and items in transit_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00065",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.JPY || "0",
                _description: "Cheques and items in transit_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00066",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.DJF || "0",
                _description: "Cheques and items in transit_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00067",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.KES || "0",
                _description: "Cheques and items in transit_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00068",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.INR || "0",
                _description: "Cheques and items in transit_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00069",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.DKK || "0",
                _description: "Cheques and items in transit_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00070",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.SEK || "0",
                _description: "Cheques and items in transit_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00071",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.SAR || "0",
                _description: "Cheques and items in transit_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00072",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.CAD || "0",
                _description: "Cheques and items in transit_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00073",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.AED || "0",
                _description: "Cheques and items in transit_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00074",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.AUD || "0",
                _description: "Cheques and items in transit_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00075",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.CNY || "0",
                _description: "Cheques and items in transit_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00076",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.NOK || "0",
                _description: "Cheques and items in transit_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00077",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.KWD || "0",
                _description: "Cheques and items in transit_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00078",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Cheques and items in transit"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.USD || "0",
                _description: "Loans and Advances_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00082",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.EUR || "0",
                _description: "Loans and Advances_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00083",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.CHF || "0",
                _description: "Loans and Advances_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00084",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.GBP || "0",
                _description: "Loans and Advances_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00085",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.JPY || "0",
                _description: "Loans and Advances_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00086",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.DJF || "0",
                _description: "Loans and Advances_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00087",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.KES || "0",
                _description: "Loans and Advances_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00088",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.INR || "0",
                _description: "Loans and Advances_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00089",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.DKK || "0",
                _description: "Loans and Advances_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00090",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.SEK || "0",
                _description: "Loans and Advances_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00091",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.SAR || "0",
                _description: "Loans and Advances_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00092",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.CAD || "0",
                _description: "Loans and Advances_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00093",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.AED || "0",
                _description: "Loans and Advances_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00094",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.AUD || "0",
                _description: "Loans and Advances_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00095",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.CNY || "0",
                _description: "Loans and Advances_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00096",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.NOK || "0",
                _description: "Loans and Advances_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00097",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.KWD || "0",
                _description: "Loans and Advances_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00098",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Loan and Advance"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.USD || "0",
                _description: "Accrued interest receivables_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00102",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.EUR || "0",
                _description: "Accrued interest receivables_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00103",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.CHF || "0",
                _description: "Accrued interest receivables_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00104",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.GBP || "0",
                _description: "Accrued interest receivables_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00105",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.JPY || "0",
                _description: "Accrued interest receivables_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00106",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.DJF || "0",
                _description: "Accrued interest receivables_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00107",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.KES || "0",
                _description: "Accrued interest receivables_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00108",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.INR || "0",
                _description: "Accrued interest receivables_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00109",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.DKK || "0",
                _description: "Accrued interest receivables_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00110",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.SEK || "0",
                _description: "Accrued interest receivables_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00111",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.SAR || "0",
                _description: "Accrued interest receivables_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00112",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.CAD || "0",
                _description: "Accrued interest receivables_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00113",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.AED || "0",
                _description: "Accrued interest receivables_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00114",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.AUD || "0",
                _description: "Accrued interest receivables_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00115",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.CNY || "0",
                _description: "Accrued interest receivables_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00116",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.NOK || "0",
                _description: "Accrued interest receivables_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00117",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.KWD || "0",
                _description: "Accrued interest receivables_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00118",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued interest recivable"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.USD || "0",
                _description: "Other assets_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00122",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.EUR || "0",
                _description: "Other assets_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00123",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.CHF || "0",
                _description: "Other assets_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00124",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.GBP || "0",
                _description: "Other assets_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00125",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.JPY || "0",
                _description: "Other assets_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00126",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.DJF || "0",
                _description: "Other assets_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00127",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.KES || "0",
                _description: "Other assets_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00128",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.INR || "0",
                _description: "Other assets_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00129",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.DKK || "0",
                _description: "Other assets_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00130",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.SEK || "0",
                _description: "Other assets_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00131",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.SAR || "0",
                _description: "Other assets_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00132",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.CAD || "0",
                _description: "Other assets_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00133",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.AED || "0",
                _description: "Other assets_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00134",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.AUD || "0",
                _description: "Other assets_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00135",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.CNY || "0",
                _description: "Other assets_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00136",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.NOK || "0",
                _description: "Other assets_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00137",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.KWD || "0",
                _description: "Other assets_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00138",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Assets"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.USD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.EUR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.CHF || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.GBP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.JPY || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.DJF || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.KES || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.INR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.DKK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.SEK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.SAR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.CAD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.AED || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.AUD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.CNY || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.NOK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.KWD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance sheet Items (Sum of 1.2.1 to 1.2.4)"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.USD || "0",
                _description: "Undelivered spot purchase_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00162",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.EUR || "0",
                _description: "Undelivered spot purchase_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00163",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.CHF || "0",
                _description: "Undelivered spot purchase_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00164",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.GBP || "0",
                _description: "Undelivered spot purchase_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00165",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.JPY || "0",
                _description: "Undelivered spot purchase_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00166",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.DJF || "0",
                _description: "Undelivered spot purchase_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00167",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.KES || "0",
                _description: "Undelivered spot purchase_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00168",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.INR || "0",
                _description: "Undelivered spot purchase_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00169",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.DKK || "0",
                _description: "Undelivered spot purchase_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00170",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.SEK || "0",
                _description: "Undelivered spot purchase_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00171",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.SAR || "0",
                _description: "Undelivered spot purchase_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00172",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.CAD || "0",
                _description: "Undelivered spot purchase_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00173",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.AED || "0",
                _description: "Undelivered spot purchase_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00174",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.AUD || "0",
                _description: "Undelivered spot purchase_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00175",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.CNY || "0",
                _description: "Undelivered spot purchase_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00176",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.NOK || "0",
                _description: "Undelivered spot purchase_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00177",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.KWD || "0",
                _description: "Undelivered spot purchase_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00178",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot purchase"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.USD || "0",
                _description: "Forward purchase_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00182",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.EUR || "0",
                _description: "Forward purchase_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00183",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.CHF || "0",
                _description: "Forward purchase_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00184",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.GBP || "0",
                _description: "Forward purchase_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00185",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.JPY || "0",
                _description: "Forward purchase_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00186",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.DJF || "0",
                _description: "Forward purchase_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00187",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.KES || "0",
                _description: "Forward purchase_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00188",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.INR || "0",
                _description: "Forward purchase_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00189",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.DKK || "0",
                _description: "Forward purchase_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00190",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.SEK || "0",
                _description: "Forward purchase_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00191",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.SAR || "0",
                _description: "Forward purchase_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00192",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.CAD || "0",
                _description: "Forward purchase_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00193",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.AED || "0",
                _description: "Forward purchase_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00194",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.AUD || "0",
                _description: "Forward purchase_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00195",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.CNY || "0",
                _description: "Forward purchase_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00196",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.NOK || "0",
                _description: "Forward purchase_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00197",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.KWD || "0",
                _description: "Forward purchase_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00198",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward purchase"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.USD || "0",
                _description: "Option, Swaps, Derivatives_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00202",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.EUR || "0",
                _description: "Option, Swaps, Derivatives_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00203",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.CHF || "0",
                _description: "Option, Swaps, Derivatives_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00204",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.GBP || "0",
                _description: "Option, Swaps, Derivatives_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00205",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.JPY || "0",
                _description: "Option, Swaps, Derivatives_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00206",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.DJF || "0",
                _description: "Option, Swaps, Derivatives_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00207",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.KES || "0",
                _description: "Option, Swaps, Derivatives_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00208",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.INR || "0",
                _description: "Option, Swaps, Derivatives_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00209",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.DKK || "0",
                _description: "Option, Swaps, Derivatives_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00210",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.SEK || "0",
                _description: "Option, Swaps, Derivatives_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00211",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.SAR || "0",
                _description: "Option, Swaps, Derivatives_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00212",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.CAD || "0",
                _description: "Option, Swaps, Derivatives_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00213",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.AED || "0",
                _description: "Option, Swaps, Derivatives_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00214",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.AUD || "0",
                _description: "Option, Swaps, Derivatives_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00215",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.CNY || "0",
                _description: "Option, Swaps, Derivatives_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00216",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.NOK || "0",
                _description: "Option, Swaps, Derivatives_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00217",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.KWD || "0",
                _description: "Option, Swaps, Derivatives_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00218",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(1.23)
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.USD || "0",
                _description: "Other assets_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00222",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.EUR || "0",
                _description: "Other assets_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00223",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.CHF || "0",
                _description: "Other assets_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00224",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.GBP || "0",
                _description: "Other assets_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00225",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.JPY || "0",
                _description: "Other assets_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00226",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.DJF || "0",
                _description: "Other assets_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00227",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.KES || "0",
                _description: "Other assets_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00228",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.INR || "0",
                _description: "Other assets_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00229",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.DKK || "0",
                _description: "Other assets_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00230",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.SEK || "0",
                _description: "Otherassets_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00231",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.SAR || "0",
                _description: "Other assets_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00232",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.CAD || "0",
                _description: "Other assets_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00233",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.AED || "0",
                _description: "Other assets_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00234",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.AUD || "0",
                _description: "Other assets_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00235",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.CNY || "0",
                _description: "Other assets_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00236",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.NOK || "0",
                _description: "Other assets_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00237",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.KWD || "0",
                _description: "Other assets_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00238",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other assets"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.USD || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00242",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.EUR || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00243",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.CHF || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00244",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.GBP || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00245",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.JPY || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00246",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.DJF || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00247",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.KES || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00248",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.INR || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00249",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.DKK || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00250",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.SEK || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00251",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.SAR || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00252",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.CAD || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00253",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.AED || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00254",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.AUD || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00255",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.CNY || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00256",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.NOK || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00257",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.KWD || "0",
                _description: "Total Foreign Assets (Sum 1.1 and 1.2)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00258",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Assets (Sum of 1.1 and 1.2)"
                    )?.[0]?.SSP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.USD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.EUR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.CHF || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.GBP || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.JPY || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.DJF || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.KES || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.INR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.DKK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.SEK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.SAR || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.CAD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.AED || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.AUD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.CNY || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.NOK || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.KWD || "0",
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
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)"
                    )?.[0]?.SSP || "0",
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
            },
            {
                Code: "164_00281",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.USD || "0",
                _description: "Due to banks abroad_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00282",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.EUR || "0",
                _description: "Due to banks abroad_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00283",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.CHF || "0",
                _description: "Due to banks abroad_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00284",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.GBP || "0",
                _description: "Due to banks abroad_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00285",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.JPY || "0",
                _description: "Due to banks abroad_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00286",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.DJF || "0",
                _description: "Due to banks abroad_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00287",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.KES || "0",
                _description: "Due to banks abroad_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00288",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.INR || "0",
                _description: "Due to banks abroad_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00289",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.DKK || "0",
                _description: "Due to banks abroad_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00290",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.SEK || "0",
                _description: "Due to banks abroad_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00291",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.SAR || "0",
                _description: "Due to banks abroad_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00292",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.CAD || "0",
                _description: "Due to banks abroad_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00293",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.AED || "0",
                _description: "Due to banks abroad_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00294",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.AUD || "0",
                _description: "Due to banks abroad_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00295",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.CNY || "0",
                _description: "Due to banks abroad_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00296",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.NOK || "0",
                _description: "Due to banks abroad_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00297",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.KWD || "0",
                _description: "Due to banks abroad_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00298",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Due to banks abroad"
                    )?.[0]?.SSP || "0",
                _description: "Due to banks abroad_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00299",
                Value: "0",
                _description: "Due to banks abroad_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00300",
                Value: "0",
                _description: "Due to banks abroad_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00301",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.USD || "0",
                _description: "Foreign Currency Deposits_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00302",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.EUR || "0",
                _description: "Foreign Currency Deposits_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00303",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.CHF || "0",
                _description: "Foreign Currency Deposits_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00304",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.GBP || "0",
                _description: "Foreign Currency Deposits_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00305",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.JPY || "0",
                _description: "Foreign Currency Deposits_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00306",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.DJF || "0",
                _description: "Foreign Currency Deposits_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00307",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.KES || "0",
                _description: "Foreign Currency Deposits_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00308",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.INR || "0",
                _description: "Foreign Currency Deposits_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00309",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.DKK || "0",
                _description: "Foreign Currency Deposits_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00310",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.SEK || "0",
                _description: "Foreign Currency Deposits_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00311",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.SAR || "0",
                _description: "Foreign Currency Deposits_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00312",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.CAD || "0",
                _description: "Foreign Currency Deposits_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00313",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.AED || "0",
                _description: "Foreign Currency Deposits_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00314",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.AUD || "0",
                _description: "Foreign Currency Deposits_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00315",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.CNY || "0",
                _description: "Foreign Currency Deposits_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00316",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.NOK || "0",
                _description: "Foreign Currency Deposits_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00317",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.KWD || "0",
                _description: "Foreign Currency Deposits_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00318",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Foreign Currency Deposit"
                    )?.[0]?.SSP || "0",
                _description:
                    "Foreign Currency Deposits_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00319",
                Value: "0",
                _description:
                    "Foreign Currency Deposits_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00320",
                Value: "0",
                _description:
                    "Foreign Currency Deposits_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00321",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.USD || "0",
                _description: "Borrowings_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00322",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.EUR || "0",
                _description: "Borrowings_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00323",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.CHF || "0",
                _description: "Borrowings_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00324",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.GBP || "0",
                _description: "Borrowings_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00325",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.JPY || "0",
                _description: "Borrowings_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00326",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.DJF || "0",
                _description: "Borrowings_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00327",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.KES || "0",
                _description: "Borrowings_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00328",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.INR || "0",
                _description: "Borrowings_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00329",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.DKK || "0",
                _description: "Borrowings_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00330",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.SEK || "0",
                _description: "Borrowings_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00331",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.SAR || "0",
                _description: "Borrowings_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00332",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.CAD || "0",
                _description: "Borrowings_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00333",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.AED || "0",
                _description: "Borrowings_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00334",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.AUD || "0",
                _description: "Borrowings_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00335",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.CNY || "0",
                _description: "Borrowings_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00336",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.NOK || "0",
                _description: "Borrowings_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00337",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.KWD || "0",
                _description: "Borrowings_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00338",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Borrowings"
                    )?.[0]?.SSP || "0",
                _description: "Borrowings_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00339",
                Value: "0",
                _description: "Borrowings_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00340",
                Value: "0",
                _description: "Borrowings_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00341",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.USD || "0",
                _description: "Accrued Interest Payables_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00342",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.EUR || "0",
                _description: "Accrued Interest Payables_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00343",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.CHF || "0",
                _description: "Accrued Interest Payables_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00344",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.GBP || "0",
                _description: "Accrued Interest Payables_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00345",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.JPY || "0",
                _description: "Accrued Interest Payables_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00346",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.DJF || "0",
                _description: "Accrued Interest Payables_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00347",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.KES || "0",
                _description: "Accrued Interest Payables_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00348",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.INR || "0",
                _description: "Accrued Interest Payables_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00349",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.DKK || "0",
                _description: "Accrued Interest Payables_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00350",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.SEK || "0",
                _description: "Accrued Interest Payables_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00351",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.SAR || "0",
                _description: "Accrued Interest Payables_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00352",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.CAD || "0",
                _description: "Accrued Interest Payables_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00353",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.AED || "0",
                _description: "Accrued Interest Payables_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00354",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.AUD || "0",
                _description: "Accrued Interest Payables_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00355",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.CNY || "0",
                _description: "Accrued Interest Payables_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00356",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.NOK || "0",
                _description: "Accrued Interest Payables_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00357",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.KWD || "0",
                _description: "Accrued Interest Payables_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00358",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Accurued Interest Payble"
                    )?.[0]?.SSP || "0",
                _description:
                    "Accrued Interest Payables_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00359",
                Value: "0",
                _description:
                    "Accrued Interest Payables_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00360",
                Value: "0",
                _description:
                    "Accrued Interest Payables_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00361",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.USD || "0",
                _description: "Other Liabilities_USD ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00362",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.EUR || "0",
                _description: "Other Liabilities_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00363",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.CHF || "0",
                _description: "Other Liabilities_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00364",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.GBP || "0",
                _description: "Other Liabilities_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00365",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.JPY || "0",
                _description: "Other Liabilities_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00366",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.DJF || "0",
                _description: "Other Liabilities_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00367",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.KES || "0",
                _description: "Other Liabilities_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00368",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.INR || "0",
                _description: "Other Liabilities_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00369",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.DKK || "0",
                _description: "Other Liabilities_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00370",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.SEK || "0",
                _description: "Other Liabilities_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00371",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.SAR || "0",
                _description: "Other Liabilities_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00372",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.CAD || "0",
                _description: "Other Liabilities_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00373",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.AED || "0",
                _description: "Other Liabilities_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00374",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.AUD || "0",
                _description: "Other Liabilities_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00375",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.CNY || "0",
                _description: "Other Liabilities_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00376",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.NOK || "0",
                _description: "Other Liabilities_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00377",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.KWD || "0",
                _description: "Other Liabilities_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00378",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other Liabilities"
                    )?.[0]?.SSP || "0",
                _description: "Other Liabilities_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00379",
                Value: "0",
                _description: "Other Liabilities_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00380",
                Value: "0",
                _description: "Other Liabilities_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00381",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.USD || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00382",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.EUR || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00383",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.CHF || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00384",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.GBP || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00385",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.JPY || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00386",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.DJF || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00387",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.KES || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00388",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.INR || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00389",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.DKK || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00390",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.SEK || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00391",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.SAR || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00392",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.CAD || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00393",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.AED || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00394",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.AUD || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00395",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.CNY || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00396",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.NOK || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00397",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.KWD || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00398",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00399",
                Value: "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00400",
                Value: "0",
                _description:
                    "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00401",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.USD || "0",
                _description: "Undeliverd spot sales_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00402",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.EUR || "0",
                _description: "Undeliverd spot sales_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00403",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.CHF || "0",
                _description: "Undeliverd spot sales_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00404",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.GBP || "0",
                _description: "Undeliverd spot sales_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00405",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.JPY || "0",
                _description: "Undeliverd spot sales_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00406",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.DJF || "0",
                _description: "Undeliverd spot sales_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00407",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.KES || "0",
                _description: "Undeliverd spot sales_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00408",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.INR || "0",
                _description: "Undeliverd spot sales_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00409",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.DKK || "0",
                _description: "Undeliverd spot sales_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00410",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.SEK || "0",
                _description: "Undeliverd spot sales_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00411",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.SAR || "0",
                _description: "Undeliverd spot sales_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00412",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.CAD || "0",
                _description: "Undeliverd spot sales_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00413",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.AED || "0",
                _description: "Undeliverd spot sales_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00414",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.AUD || "0",
                _description: "Undeliverd spot sales_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00415",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.CNY || "0",
                _description: "Undeliverd spot sales_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00416",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.NOK || "0",
                _description: "Undeliverd spot sales_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00417",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.KWD || "0",
                _description: "Undeliverd spot sales_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00418",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Undeliverd spot sales"
                    )?.[0]?.SSP || "0",
                _description: "Undeliverd spot sales_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00419",
                Value: "0",
                _description: "Undeliverd spot sales_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00420",
                Value: "0",
                _description: "Undeliverd spot sales_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00421",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.USD || "0",
                _description: "Forward sales_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00422",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.EUR || "0",
                _description: "Forward sales_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00423",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.CHF || "0",
                _description: "Forward sales_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00424",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.GBP || "0",
                _description: "Forward sales_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00425",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.JPY || "0",
                _description: "Forward sales_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00426",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.DJF || "0",
                _description: "Forward sales_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00427",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.KES || "0",
                _description: "Forward sales_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00428",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.INR || "0",
                _description: "Forward sales_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00429",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.DKK || "0",
                _description: "Forward sales_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00430",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.SEK || "0",
                _description: "Forward sales_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00431",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.SAR || "0",
                _description: "Forward sales_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00432",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.CAD || "0",
                _description: "Forward sales_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00433",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.AED || "0",
                _description: "Forward sales_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00434",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.AUD || "0",
                _description: "Forward sales_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00435",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.CNY || "0",
                _description: "Forward sales_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00436",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.NOK || "0",
                _description: "Forward sales_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00437",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.KWD || "0",
                _description: "Forward sales_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00438",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Forward sales"
                    )?.[0]?.SSP || "0",
                _description: "Forward sales_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00439",
                Value: "0",
                _description: "Forward sales_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00440",
                Value: "0",
                _description: "Forward sales_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00441",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.USD || "0",
                _description: "Option, Swaps, Derivatives_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00442",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.EUR || "0",
                _description: "Option, Swaps, Derivatives_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00443",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.CHF || "0",
                _description: "Option, Swaps, Derivatives_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00444",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.GBP || "0",
                _description: "Option, Swaps, Derivatives_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00445",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.JPY || "0",
                _description: "Option, Swaps, Derivatives_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00446",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.DJF || "0",
                _description: "Option, Swaps, Derivatives_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00447",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.KES || "0",
                _description: "Option, Swaps, Derivatives_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00448",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.INR || "0",
                _description: "Option, Swaps, Derivatives_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00449",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.DKK || "0",
                _description: "Option, Swaps, Derivatives_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00450",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.SEK || "0",
                _description: "Option, Swaps, Derivatives_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00451",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.SAR || "0",
                _description: "Option, Swaps, Derivatives_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00452",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.CAD || "0",
                _description: "Option, Swaps, Derivatives_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00453",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.AED || "0",
                _description: "Option, Swaps, Derivatives_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00454",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.AUD || "0",
                _description: "Option, Swaps, Derivatives_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00455",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.CNY || "0",
                _description: "Option, Swaps, Derivatives_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00456",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.NOK || "0",
                _description: "Option, Swaps, Derivatives_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00457",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.KWD || "0",
                _description: "Option, Swaps, Derivatives_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00458",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                                "Option, Swaps, Derivatives" &&
                            row.ORDER_NUM === Decimal(2.23)
                    )?.[0]?.SSP || "0",
                _description:
                    "Option, Swaps, Derivatives_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00459",
                Value: "0",
                _description:
                    "Option, Swaps, Derivatives_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00460",
                Value: "0",
                _description:
                    "Option, Swaps, Derivatives_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00461",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.USD || "0",
                _description: "Letter of credit_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00462",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.EUR || "0",
                _description: "Letter of credit_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00463",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.CHF || "0",
                _description: "Letter of credit_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00464",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.GBP || "0",
                _description: "Letter of credit_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00465",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.JPY || "0",
                _description: "Letter of credit_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00466",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.DJF || "0",
                _description: "Letter of credit_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00467",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.KES || "0",
                _description: "Letter of credit_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00468",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.INR || "0",
                _description: "Letter of credit_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00469",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.DKK || "0",
                _description: "Letter of credit_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00470",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.SEK || "0",
                _description: "Letter of credit_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00471",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.SAR || "0",
                _description: "Letter of credit_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00472",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.CAD || "0",
                _description: "Letter of credit_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00473",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.AED || "0",
                _description: "Letter of credit_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00474",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.AUD || "0",
                _description: "Letter of credit_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00475",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.CNY || "0",
                _description: "Letter of credit_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00476",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.NOK || "0",
                _description: "Letter of credit_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00477",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.KWD || "0",
                _description: "Letter of credit_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00478",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Letter of credit"
                    )?.[0]?.SSP || "0",
                _description: "Letter of credit_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00479",
                Value: "0",
                _description: "Letter of credit_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00480",
                Value: "0",
                _description: "Letter of credit_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00481",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.USD || "0",
                _description: "Guarantees_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00482",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.EUR || "0",
                _description: "Guarantees_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00483",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.CHF || "0",
                _description: "Guarantees_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00484",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.GBP || "0",
                _description: "Guarantees_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00485",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.JPY || "0",
                _description: "Guarantees_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00486",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.DJF || "0",
                _description: "Guarantees_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00487",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.KES || "0",
                _description: "Guarantees_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00488",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.INR || "0",
                _description: "Guarantees_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00489",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.DKK || "0",
                _description: "Guarantees_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00490",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.SEK || "0",
                _description: "Guarantees_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00491",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.SAR || "0",
                _description: "Guarantees_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00492",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.CAD || "0",
                _description: "Guarantees_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00493",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.AED || "0",
                _description: "Guarantees_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00494",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.AUD || "0",
                _description: "Guarantees_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00495",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.CNY || "0",
                _description: "Guarantees_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00496",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.NOK || "0",
                _description: "Guarantees_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00497",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.KWD || "0",
                _description: "Guarantees_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00498",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Guarantees"
                    )?.[0]?.SSP || "0",
                _description: "Guarantees_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00499",
                Value: "0",
                _description: "Guarantees_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00500",
                Value: "0",
                _description: "Guarantees_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00501",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.USD || "0",
                _description: "Other liabilities_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00502",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.EUR || "0",
                _description: "Other liabilities_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00503",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.CHF || "0",
                _description: "Other liabilities_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00504",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.GBP || "0",
                _description: "Other liabilities_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00505",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.JPY || "0",
                _description: "Other liabilities_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00506",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.DJF || "0",
                _description: "Other liabilities_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00507",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.KES || "0",
                _description: "Other liabilities_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00508",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.INR || "0",
                _description: "Other liabilities_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00509",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.DKK || "0",
                _description: "Other liabilities_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00510",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.SEK || "0",
                _description: "Other liabilities_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00511",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.SAR || "0",
                _description: "Other liabilities_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00512",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.CAD || "0",
                _description: "Other liabilities_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00513",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.AED || "0",
                _description: "Other liabilities_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00514",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.AUD || "0",
                _description: "Other liabilities_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00515",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.CNY || "0",
                _description: "Other liabilities_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00516",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.NOK || "0",
                _description: "Other liabilities_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00517",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.KWD || "0",
                _description: "Other liabilities_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00518",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Other liabilities"
                    )?.[0]?.SSP || "0",
                _description: "Other liabilities_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00519",
                Value: "0",
                _description: "Other liabilities_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00520",
                Value: "0",
                _description: "Other liabilities_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00521",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.USD || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00522",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.EUR || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00523",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.CHF || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00524",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.GBP || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00525",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.JPY || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00526",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.DJF || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00527",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.KES || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00528",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.INR || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00529",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.DKK || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00530",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.SEK || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00531",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.SAR || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00532",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.CAD || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00533",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.AED || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00534",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.AUD || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00535",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.CNY || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00536",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.NOK || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00537",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.KWD || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00538",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Foreign Liabilities (Sum of 2.1 and 2.2)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00539",
                Value: "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00540",
                Value: "0",
                _description:
                    "Total Foreign Liablities (sum of 2.1and 2.2)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00541",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.USD || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00542",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.EUR || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00543",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.CHF || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00544",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.GBP || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00545",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.JPY || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00546",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.DJF || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00547",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.KES || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00548",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.INR || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00549",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.DKK || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00550",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.SEK || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00551",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.SAR || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00552",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.CAD || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00553",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.AED || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00554",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.AUD || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00555",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.CNY || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00556",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.NOK || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00557",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.KWD || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00558",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position (where assets less liabilities is +)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00559",
                Value: "0",
                _description:
                    "Net long position (where assets less liabilities is +)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00560",
                Value: "0",
                _description:
                    "Net long position (where assets less liabilities is +)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00561",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.USD || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00562",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.EUR || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00563",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.CHF || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00564",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.GBP || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00565",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.JPY || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00566",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.DJF || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00567",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.KES || "0",
                _description:
                    "Net long position (where assets less liabilities is +)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00568",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.INR || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00569",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.DKK || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00570",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.SEK || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00571",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.SAR || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00572",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.CAD || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00573",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.AED || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00574",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.AUD || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00575",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.CNY || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00576",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.NOK || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00577",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.KWD || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00578",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position (where assets less liabilities is -)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Net short position (where assets less liabilities is -)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00579",
                Value: "0",
                _description:
                    "Net short position (where assets less liabilities is -)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00580",
                Value: "0",
                _description:
                    "Net short position (where assets less liabilities is -)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00581",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.USD || "0",
                _description: "Mid-exchage rate_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00582",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.EUR || "0",
                _description: "Mid-exchage rate_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00583",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.CHF || "0",
                _description: "Mid-exchage rate_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00584",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.GBP || "0",
                _description: "Mid-exchage rate_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00585",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.JPY || "0",
                _description: "Mid-exchage rate_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00586",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.DJF || "0",
                _description: "Mid-exchage rate_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00587",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.KES || "0",
                _description: "Mid-exchage rate_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00588",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.INR || "0",
                _description: "Mid-exchage rate_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00589",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.DKK || "0",
                _description: "Mid-exchage rate_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00590",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.SEK || "0",
                _description: "Mid-exchage rate_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00591",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.SAR || "0",
                _description: "Mid-exchage rate_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00592",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.CAD || "0",
                _description: "Mid-exchage rate_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00593",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.AED || "0",
                _description: "Mid-exchage rate_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00594",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.AUD || "0",
                _description: "Mid-exchage rate_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00595",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.CNY || "0",
                _description: "Mid-exchage rate_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00596",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.NOK || "0",
                _description: "Mid-exchage rate_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00597",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.KWD || "0",
                _description: "Mid-exchage rate_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00598",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Mid-exhange rate"
                    )?.[0]?.SSP || "0",
                _description: "Mid-exchage rate_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00599",
                Value: "0",
                _description: "Mid-exchage rate_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00600",
                Value: "0",
                _description: "Mid-exchage rate_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00601",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.USD || "0",
                _description: "Net long position in Birr (3.1*4)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00602",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.EUR || "0",
                _description: "Net long position in Birr (3.1*4)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00603",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.CHF || "0",
                _description: "Net long position in Birr (3.1*4)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00604",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.GBP || "0",
                _description: "Net long position in Birr (3.1*4)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00605",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.JPY || "0",
                _description: "Net long position in Birr (3.1*4)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00606",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.DJF || "0",
                _description: "Net long position in Birr (3.1*4)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00607",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.KES || "0",
                _description: "Net long position in Birr (3.1*4)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00608",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.INR || "0",
                _description: "Net long position in Birr (3.1*4)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00609",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.DKK || "0",
                _description: "Net long position in Birr (3.1*4)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00610",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.SEK || "0",
                _description: "Net long position in Birr (3.1*4)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00611",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.SAR || "0",
                _description: "Net long position in Birr (3.1*4)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00612",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.CAD || "0",
                _description: "Net long position in Birr (3.1*4)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00613",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.AED || "0",
                _description: "Net long position in Birr (3.1*4)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00614",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.AUD || "0",
                _description: "Net long position in Birr (3.1*4)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00615",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.CNY || "0",
                _description: "Net long position in Birr (3.1*4)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00616",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.NOK || "0",
                _description: "Net long position in Birr (3.1*4)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00617",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.KWD || "0",
                _description: "Net long position in Birr (3.1*4)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00618",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net long position in Birr (3.1*4)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Net long position in Birr (3.1*4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00619",
                Value: "0",
                _description:
                    "Net long position in Birr (3.1*4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00620",
                Value: "0",
                _description:
                    "Net long position in Birr (3.1*4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00621",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.USD || "0",
                _description: "Net short position in Birr (3.2*4)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00622",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.EUR || "0",
                _description: "Net short position in Birr (3.2*4)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00623",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.CHF || "0",
                _description: "Net short position in Birr (3.2*4)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00624",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.GBP || "0",
                _description: "Net short position in Birr (3.2*4)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00625",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.JPY || "0",
                _description: "Net short position in Birr (3.2*4)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00626",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.DJF || "0",
                _description: "Net short position in Birr (3.2*4)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00627",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.KES || "0",
                _description: "Net short position in Birr (3.2*4)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00628",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.INR || "0",
                _description: "Net short position in Birr (3.2*4)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00629",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.DKK || "0",
                _description: "Net short position in Birr (3.2*4)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00630",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.SEK || "0",
                _description: "Net short position in Birr (3.2*4)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00631",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.SAR || "0",
                _description: "Net short position in Birr (3.2*4)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00632",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.CAD || "0",
                _description: "Net short position in Birr (3.2*4)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00633",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.AED || "0",
                _description: "Net short position in Birr (3.2*4)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00634",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.AUD || "0",
                _description: "Net short position in Birr (3.2*4)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00635",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.CNY || "0",
                _description: "Net short position in Birr (3.2*4)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00636",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.NOK || "0",
                _description: "Net short position in Birr (3.2*4)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00637",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.KWD || "0",
                _description: "Net short position in Birr (3.2*4)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00638",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net short position in Birr (3.2*4)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Net short position in Birr (3.2*4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00639",
                Value: "0",
                _description:
                    "Net short position in Birr (3.2*4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00640",
                Value: "0",
                _description:
                    "Net short position in Birr (3.2*4)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00641",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.USD || "0",
                _description: "Net open position (Greater of 5 or 6)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00642",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.EUR || "0",
                _description: "Net open position (Greater of 5 or 6)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00643",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.CHF || "0",
                _description: "Net open position (Greater of 5 or 6)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00644",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.GBP || "0",
                _description: "Net open position (Greater of 5 or 6)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00645",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.JPY || "0",
                _description: "Net open position (Greater of 5 or 6)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00646",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.DJF || "0",
                _description: "NNet open position (Greater of 5 or 6)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00647",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.KES || "0",
                _description: "Net open position (Greater of 5 or 6)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00648",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.INR || "0",
                _description: "Net open position (Greater of 5 or 6)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00649",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.DKK || "0",
                _description: "Net open position (Greater of 5 or 6)_DKK ",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00650",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.SEK || "0",
                _description: "Net open position (Greater of 5 or 6)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00651",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.SAR || "0",
                _description: "NNet open position (Greater of 5 or 6)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00652",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.CAD || "0",
                _description: "Net open position (Greater of 5 or 6)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00653",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.AED || "0",
                _description: "Net open position (Greater of 5 or 6)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00654",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.AUD || "0",
                _description: "Net open position (Greater of 5 or 6)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00655",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.CNY || "0",
                _description: "Net open position (Greater of 5 or 6)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00656",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.NOK || "0",
                _description: "Net open position (Greater of 5 or 6)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00657",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.KWD || "0",
                _description: "Net open position (Greater of 5 or 6)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00658",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net open position ( Greater of 5 or 6)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Net open position (Greater of 5 or 6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00659",
                Value: "0",
                _description:
                    "Net open position (Greater of 5 or 6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00660",
                Value: "0",
                _description:
                    "Net open position (Greater of 5 or 6)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00661",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.USD || "0",
                _description: "Net open position Ratio (7/8.4*100)_USD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00662",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.EUR || "0",
                _description: "Net open position Ratio (7/8.4*100)_EUR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00663",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.CHF || "0",
                _description: "Net open position Ratio (7/8.4*100)_CHF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00664",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.GBP || "0",
                _description: "Net open position Ratio (7/8.4*100)_GBP",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00665",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.JPY || "0",
                _description: "Net open position Ratio (7/8.4*100)_JPY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00666",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.DJF || "0",
                _description: "Net open position Ratio (7/8.4*100)_DJF",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00667",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.KES || "0",
                _description: "Net open position Ratio (7/8.4*100)_KES",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00668",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.INR || "0",
                _description: "Net open position Ratio (7/8.4*100)_INR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00669",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.DKK || "0",
                _description: "Net open position Ratio (7/8.4*100)_DKK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00670",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.SEK || "0",
                _description: "NNet open position Ratio (7/8.4*100)_SEK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00671",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.SAR || "0",
                _description: "Net open position Ratio (7/8.4*100)_SAR",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00672",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.CAD || "0",
                _description: "Net open position Ratio (7/8.4*100)_CAD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00673",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.AED || "0",
                _description: "Net open position Ratio (7/8.4*100)_AED",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00674",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.AUD || "0",
                _description: "Net open position Ratio (7/8.4*100)_AUD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00675",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.CNY || "0",
                _description: "Net open position Ratio (7/8.4*100)_CNY",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00676",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.NOK || "0",
                _description: "Net open position Ratio (7/8.4*100)_NOK",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00677",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.KWD || "0",
                _description: "Net open position Ratio (7/8.4*100)_KWD",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00678",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Positioin Ratio (7/8.4*100)"
                    )?.[0]?.SSP || "0",
                _description:
                    "Net open position Ratio (7/8.4*100)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00679",
                Value: "0",
                _description:
                    "Net open position Ratio (7/8.4*100)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00680",
                Value: "0",
                _description:
                    "Net open position Ratio (7/8.4*100)_Others in Single Currency",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00681",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Long Position (Sum of row 5)"
                    )?.[0]?.OVERALL_EXPOSURE || "0",
                _description:
                    "Total long position (Sum of row 5)_Overall Exposure",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00682",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Total Short Position (Sum of row 6)"
                    )?.[0]?.OVERALL_EXPOSURE || "0",
                _description:
                    "Total short position (Sum of row 6)_Overall Exposure",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00683",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Overall open position  (Greater of 8.1 or 8.2)"
                    )?.[0]?.OVERALL_EXPOSURE || "0",
                _description:
                    "Overall open position (Greater of 8.1 or 8.2)_Overall Exposure",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00684",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() === "Tire 1 Capital"
                    )?.[0]?.OVERALL_EXPOSURE || "0",
                _description: "Tire 1 Capital_Overall Exposure",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00685",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Overall open position limit (18%*8.4)"
                    )?.[0]?.OVERALL_EXPOSURE || "0",
                _description:
                    "Overall open position limit (18%*8.4)_Overall Exposure",
                _dataType: "NUMERIC",
                _required: false
            },
            {
                Code: "164_00686",
                Value:
                    rawData.filter(
                        (row: OpenPosition) =>
                            row.NEW_DETAIL_GROUP?.trim() ===
                            "Net Open Position Ratio (8.3/8.4*100)"
                    )?.[0]?.OVERALL_EXPOSURE || "0",
                _description:
                    "Net Open Position Ratio (8.3/8.4*100)_Overall Exposure",
                _dataType: "NUMERIC",
                _required: false
            }
        ]
    };
    return json;
};
