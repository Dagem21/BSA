// @ts-nocheck

export interface F6001ItemDefinition {
    code: string;
    description: string;
    dataType: string;
    required: boolean;
}

export interface F6001CellMapping {
    code: string;
    row: number;
    col: string;
    desc: string;
}

export const F6001_ITEM_DEFINITIONS: F6001ItemDefinition[] = [
    {
        "code": "172_00001",
        "description": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00002",
        "description": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00003",
        "description": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00004",
        "description": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00005",
        "description": "Currency on hand_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00006",
        "description": "Currency on hand_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00007",
        "description": "Currency on hand_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00008",
        "description": "Currency on hand_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00009",
        "description": "Due from banks_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00010",
        "description": "Due from banks_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00011",
        "description": "Due from banks_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00012",
        "description": "Due from banks_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00013",
        "description": "Cheques and items in transit_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00014",
        "description": "Cheques and items in transit_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00015",
        "description": "Cheques and items in transit_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00016",
        "description": "Cheques and items in transit_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00017",
        "description": "Loans & advances_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00018",
        "description": "Loans & advances_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00019",
        "description": "Loans & advances_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00020",
        "description": "Loans & advances_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00021",
        "description": "Accrued inte_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00022",
        "description": "Accrued inte_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00023",
        "description": "Accrued inte_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00024",
        "description": "Accrued inte_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00025",
        "description": "Other Assets_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00026",
        "description": "Other Assets_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00027",
        "description": "Other Assets_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00028",
        "description": "Other Assets_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00029",
        "description": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00030",
        "description": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00031",
        "description": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00032",
        "description": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00033",
        "description": "Undelivered spot purchase_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00034",
        "description": "Undelivered spot purchase_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00035",
        "description": "Undelivered spot purchase_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00036",
        "description": "Undelivered spot purchase_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00037",
        "description": "Forward purchase_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00038",
        "description": "Forward purchase_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00039",
        "description": "Forward purchase_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00040",
        "description": "Forward purchase_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00041",
        "description": "Option, Swaps, Derivatives_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00042",
        "description": "Option, Swaps, Derivatives_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00043",
        "description": "Option, Swaps, Derivatives_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00044",
        "description": "Option, Swaps, Derivatives_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00045",
        "description": "Other assets_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00046",
        "description": "Other assets_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00047",
        "description": "Other assets_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00048",
        "description": "Other assets_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00049",
        "description": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00050",
        "description": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00051",
        "description": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00052",
        "description": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00053",
        "description": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00054",
        "description": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00055",
        "description": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00056",
        "description": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00057",
        "description": "Due to banks abroad_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00058",
        "description": "Due to banks abroad_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00059",
        "description": "Due to banks abroad_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00060",
        "description": "Due to banks abroad_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00061",
        "description": "Foreign currency deposits_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00062",
        "description": "Foreign currency deposits_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00063",
        "description": "Foreign currency deposits_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00064",
        "description": "Foreign currency deposits_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00065",
        "description": "Accrued interest payable_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00066",
        "description": "Accrued interest payable_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00067",
        "description": "Accrued interest payable_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00068",
        "description": "Accrued interest payable_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00069",
        "description": "Other liabilities_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00070",
        "description": "Other liabilities_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00071",
        "description": "Other liabilities_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00072",
        "description": "Other liabilities_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00073",
        "description": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00074",
        "description": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00075",
        "description": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00076",
        "description": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00077",
        "description": "Undelivered spot sales_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00078",
        "description": "Undelivered spot sales_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00079",
        "description": "Undelivered spot sales_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00080",
        "description": "Undelivered spot sales_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00081",
        "description": "Forward sales_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00082",
        "description": "Forward sales_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00083",
        "description": "Forward sales_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00084",
        "description": "Forward sales_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00085",
        "description": "Option, Swaps, Derivatives_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00086",
        "description": "Option, Swaps, Derivatives_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00087",
        "description": "Option, Swaps, Derivatives_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00088",
        "description": "Option, Swaps, Derivatives_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00089",
        "description": "Letter of credit_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00090",
        "description": "Letter of credit_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00091",
        "description": "Letter of credit_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00092",
        "description": "Letter of credit_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00093",
        "description": "Guarantees_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00094",
        "description": "Guarantees_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00095",
        "description": "Guarantees_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00096",
        "description": "Guarantees_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00097",
        "description": "Other liabilities_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00098",
        "description": "Other liabilities_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00099",
        "description": "Other liabilities_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00100",
        "description": "Other liabilities_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00101",
        "description": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00102",
        "description": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00103",
        "description": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00104",
        "description": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00105",
        "description": "Net long position (where assets less liabilities is +)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00106",
        "description": "Net long position (where assets less liabilities is +)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00107",
        "description": "Net long position (where assets less liabilities is +)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00108",
        "description": "Net long position (where assets less liabilities is +)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00109",
        "description": "Net short position (where assests less liabilities is -)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00110",
        "description": "Net short position (where assests less liabilities is -)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00111",
        "description": "Net short position (where assests less liabilities is -)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00112",
        "description": "Net short position (where assests less liabilities is -)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00113",
        "description": "Mid Exchange Rate_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00114",
        "description": "Mid Exchange Rate_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00115",
        "description": "Mid Exchange Rate_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00116",
        "description": "Mid Exchange Rate_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00117",
        "description": "Net long position in Birr (3.1*4)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00118",
        "description": "Net long position in Birr (3.1*4)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00119",
        "description": "Net long position in Birr (3.1*4)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00120",
        "description": "Net long position in Birr (3.1*4)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00121",
        "description": "Net short position in Birr (3.2*4)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00122",
        "description": "Net short position in Birr (3.2*4)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00123",
        "description": "Net short position in Birr (3.2*4)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00124",
        "description": "Net short position in Birr (3.2*4)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00125",
        "description": "Net open position (Greater of 5 or 6)_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00126",
        "description": "Net open position (Greater of 5 or 6)_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00127",
        "description": "Net open position (Greater of 5 or 6)_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00128",
        "description": "Net open position (Greater of 5 or 6)_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00129",
        "description": "Overall Foreign Exchange Position_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00130",
        "description": "Overall Foreign Exchange Position_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00131",
        "description": "Overall Foreign Exchange Position_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00132",
        "description": "Overall Foreign Exchange Position_Others",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00133",
        "description": "Total long Positions in FX (Sum of row 5)_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00134",
        "description": "Total Short Positions in FX (Sum of 6)_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00135",
        "description": "Max (Total Long Positions; Total Short Positions)_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00136",
        "description": "Gold Position (absolute value)_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00137",
        "description": "Net Global Open Position (Rows 9 + 10)_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00138",
        "description": "Total Capital Charge for FX Risk (Row 11*11%)_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00139",
        "description": "TOTAL RWA for FX = Row 12 * 9.1_Gold",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00140",
        "description": "Borrowings_USD",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00141",
        "description": "Borrowings_Euros",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00142",
        "description": "Borrowings_GBP",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "172_00143",
        "description": "Borrowings_Others",
        "dataType": "NUMERIC",
        "required": false
    }
];

export const F6001_CELL_MAPPING: F6001CellMapping[] = [
    {
        "code": "172_00001",
        "row": 17,
        "col": "C",
        "desc": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_USD"
    },
    {
        "code": "172_00002",
        "row": 17,
        "col": "D",
        "desc": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Euros"
    },
    {
        "code": "172_00003",
        "row": 17,
        "col": "E",
        "desc": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_GBP"
    },
    {
        "code": "172_00004",
        "row": 17,
        "col": "F",
        "desc": "On-balance Sheet Items (Sum of 1.1.1 to 1.1.6)_Others"
    },
    {
        "code": "172_00005",
        "row": 18,
        "col": "C",
        "desc": "Currency on hand_USD"
    },
    {
        "code": "172_00006",
        "row": 18,
        "col": "D",
        "desc": "Currency on hand_Euros"
    },
    {
        "code": "172_00007",
        "row": 18,
        "col": "E",
        "desc": "Currency on hand_GBP"
    },
    {
        "code": "172_00008",
        "row": 18,
        "col": "F",
        "desc": "Currency on hand_Others"
    },
    {
        "code": "172_00009",
        "row": 19,
        "col": "C",
        "desc": "Due from banks_USD"
    },
    {
        "code": "172_00010",
        "row": 19,
        "col": "D",
        "desc": "Due from banks_Euros"
    },
    {
        "code": "172_00011",
        "row": 19,
        "col": "E",
        "desc": "Due from banks_GBP"
    },
    {
        "code": "172_00012",
        "row": 19,
        "col": "F",
        "desc": "Due from banks_Others"
    },
    {
        "code": "172_00013",
        "row": 20,
        "col": "C",
        "desc": "Cheques and items in transit_USD"
    },
    {
        "code": "172_00014",
        "row": 20,
        "col": "D",
        "desc": "Cheques and items in transit_Euros"
    },
    {
        "code": "172_00015",
        "row": 20,
        "col": "E",
        "desc": "Cheques and items in transit_GBP"
    },
    {
        "code": "172_00016",
        "row": 20,
        "col": "F",
        "desc": "Cheques and items in transit_Others"
    },
    {
        "code": "172_00017",
        "row": 21,
        "col": "C",
        "desc": "Loans & advances_USD"
    },
    {
        "code": "172_00018",
        "row": 21,
        "col": "D",
        "desc": "Loans & advances_Euros"
    },
    {
        "code": "172_00019",
        "row": 21,
        "col": "E",
        "desc": "Loans & advances_GBP"
    },
    {
        "code": "172_00020",
        "row": 21,
        "col": "F",
        "desc": "Loans & advances_Others"
    },
    {
        "code": "172_00021",
        "row": 22,
        "col": "C",
        "desc": "Accrued inte_USD"
    },
    {
        "code": "172_00022",
        "row": 22,
        "col": "D",
        "desc": "Accrued inte_Euros"
    },
    {
        "code": "172_00023",
        "row": 22,
        "col": "E",
        "desc": "Accrued inte_GBP"
    },
    {
        "code": "172_00024",
        "row": 22,
        "col": "F",
        "desc": "Accrued inte_Others"
    },
    {
        "code": "172_00025",
        "row": 23,
        "col": "C",
        "desc": "Other Assets_USD"
    },
    {
        "code": "172_00026",
        "row": 23,
        "col": "D",
        "desc": "Other Assets_Euros"
    },
    {
        "code": "172_00027",
        "row": 23,
        "col": "E",
        "desc": "Other Assets_GBP"
    },
    {
        "code": "172_00028",
        "row": 23,
        "col": "F",
        "desc": "Other Assets_Others"
    },
    {
        "code": "172_00029",
        "row": 24,
        "col": "C",
        "desc": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_USD"
    },
    {
        "code": "172_00030",
        "row": 24,
        "col": "D",
        "desc": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_Euros"
    },
    {
        "code": "172_00031",
        "row": 24,
        "col": "E",
        "desc": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_GBP"
    },
    {
        "code": "172_00032",
        "row": 24,
        "col": "F",
        "desc": "Off-balance sheet Items (Sum of 1.2 to 1.2.4)_Others"
    },
    {
        "code": "172_00033",
        "row": 25,
        "col": "C",
        "desc": "Undelivered spot purchase_USD"
    },
    {
        "code": "172_00034",
        "row": 25,
        "col": "D",
        "desc": "Undelivered spot purchase_Euros"
    },
    {
        "code": "172_00035",
        "row": 25,
        "col": "E",
        "desc": "Undelivered spot purchase_GBP"
    },
    {
        "code": "172_00036",
        "row": 25,
        "col": "F",
        "desc": "Undelivered spot purchase_Others"
    },
    {
        "code": "172_00037",
        "row": 26,
        "col": "C",
        "desc": "Forward purchase_USD"
    },
    {
        "code": "172_00038",
        "row": 26,
        "col": "D",
        "desc": "Forward purchase_Euros"
    },
    {
        "code": "172_00039",
        "row": 26,
        "col": "E",
        "desc": "Forward purchase_GBP"
    },
    {
        "code": "172_00040",
        "row": 26,
        "col": "F",
        "desc": "Forward purchase_Others"
    },
    {
        "code": "172_00041",
        "row": 27,
        "col": "C",
        "desc": "Option, Swaps, Derivatives_USD"
    },
    {
        "code": "172_00042",
        "row": 27,
        "col": "D",
        "desc": "Option, Swaps, Derivatives_Euros"
    },
    {
        "code": "172_00043",
        "row": 27,
        "col": "E",
        "desc": "Option, Swaps, Derivatives_GBP"
    },
    {
        "code": "172_00044",
        "row": 27,
        "col": "F",
        "desc": "Option, Swaps, Derivatives_Others"
    },
    {
        "code": "172_00045",
        "row": 28,
        "col": "C",
        "desc": "Other assets_USD"
    },
    {
        "code": "172_00046",
        "row": 28,
        "col": "D",
        "desc": "Other assets_Euros"
    },
    {
        "code": "172_00047",
        "row": 28,
        "col": "E",
        "desc": "Other assets_GBP"
    },
    {
        "code": "172_00048",
        "row": 28,
        "col": "F",
        "desc": "Other assets_Others"
    },
    {
        "code": "172_00049",
        "row": 29,
        "col": "C",
        "desc": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_USD"
    },
    {
        "code": "172_00050",
        "row": 29,
        "col": "D",
        "desc": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_Euros"
    },
    {
        "code": "172_00051",
        "row": 29,
        "col": "E",
        "desc": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_GBP"
    },
    {
        "code": "172_00052",
        "row": 29,
        "col": "F",
        "desc": "Total Foreign Currency Assets (Sum of 1.1 & 1.2)_Others"
    },
    {
        "code": "172_00053",
        "row": 31,
        "col": "C",
        "desc": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_USD"
    },
    {
        "code": "172_00054",
        "row": 31,
        "col": "D",
        "desc": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Euros"
    },
    {
        "code": "172_00055",
        "row": 31,
        "col": "E",
        "desc": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_GBP"
    },
    {
        "code": "172_00056",
        "row": 31,
        "col": "F",
        "desc": "On-balance Sheet Items (Sum of 2.1.1 to 2.1.5)_Others"
    },
    {
        "code": "172_00057",
        "row": 32,
        "col": "C",
        "desc": "Due to banks abroad_USD"
    },
    {
        "code": "172_00058",
        "row": 32,
        "col": "D",
        "desc": "Due to banks abroad_Euros"
    },
    {
        "code": "172_00059",
        "row": 32,
        "col": "E",
        "desc": "Due to banks abroad_GBP"
    },
    {
        "code": "172_00060",
        "row": 32,
        "col": "F",
        "desc": "Due to banks abroad_Others"
    },
    {
        "code": "172_00061",
        "row": 33,
        "col": "C",
        "desc": "Foreign currency deposits_USD"
    },
    {
        "code": "172_00062",
        "row": 33,
        "col": "D",
        "desc": "Foreign currency deposits_Euros"
    },
    {
        "code": "172_00063",
        "row": 33,
        "col": "E",
        "desc": "Foreign currency deposits_GBP"
    },
    {
        "code": "172_00064",
        "row": 33,
        "col": "F",
        "desc": "Foreign currency deposits_Others"
    },
    {
        "code": "172_00065",
        "row": 22,
        "col": "C",
        "desc": "Accrued interest payable_USD"
    },
    {
        "code": "172_00066",
        "row": 22,
        "col": "D",
        "desc": "Accrued interest payable_Euros"
    },
    {
        "code": "172_00067",
        "row": 22,
        "col": "E",
        "desc": "Accrued interest payable_GBP"
    },
    {
        "code": "172_00068",
        "row": 22,
        "col": "F",
        "desc": "Accrued interest payable_Others"
    },
    {
        "code": "172_00069",
        "row": 36,
        "col": "C",
        "desc": "Other liabilities_USD"
    },
    {
        "code": "172_00070",
        "row": 36,
        "col": "D",
        "desc": "Other liabilities_Euros"
    },
    {
        "code": "172_00071",
        "row": 36,
        "col": "E",
        "desc": "Other liabilities_GBP"
    },
    {
        "code": "172_00072",
        "row": 36,
        "col": "F",
        "desc": "Other liabilities_Others"
    },
    {
        "code": "172_00073",
        "row": 37,
        "col": "C",
        "desc": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_USD"
    },
    {
        "code": "172_00074",
        "row": 37,
        "col": "D",
        "desc": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Euros"
    },
    {
        "code": "172_00075",
        "row": 37,
        "col": "E",
        "desc": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_GBP"
    },
    {
        "code": "172_00076",
        "row": 37,
        "col": "F",
        "desc": "Off-balance Sheet Items (Sum of 2.2.1 to 2.2.6)_Others"
    },
    {
        "code": "172_00077",
        "row": 38,
        "col": "C",
        "desc": "Undelivered spot sales_USD"
    },
    {
        "code": "172_00078",
        "row": 38,
        "col": "D",
        "desc": "Undelivered spot sales_Euros"
    },
    {
        "code": "172_00079",
        "row": 38,
        "col": "E",
        "desc": "Undelivered spot sales_GBP"
    },
    {
        "code": "172_00080",
        "row": 38,
        "col": "F",
        "desc": "Undelivered spot sales_Others"
    },
    {
        "code": "172_00081",
        "row": 39,
        "col": "C",
        "desc": "Forward sales_USD"
    },
    {
        "code": "172_00082",
        "row": 39,
        "col": "D",
        "desc": "Forward sales_Euros"
    },
    {
        "code": "172_00083",
        "row": 39,
        "col": "E",
        "desc": "Forward sales_GBP"
    },
    {
        "code": "172_00084",
        "row": 39,
        "col": "F",
        "desc": "Forward sales_Others"
    },
    {
        "code": "172_00085",
        "row": 27,
        "col": "C",
        "desc": "Option, Swaps, Derivatives_USD"
    },
    {
        "code": "172_00086",
        "row": 27,
        "col": "D",
        "desc": "Option, Swaps, Derivatives_Euros"
    },
    {
        "code": "172_00087",
        "row": 27,
        "col": "E",
        "desc": "Option, Swaps, Derivatives_GBP"
    },
    {
        "code": "172_00088",
        "row": 27,
        "col": "F",
        "desc": "Option, Swaps, Derivatives_Others"
    },
    {
        "code": "172_00089",
        "row": 41,
        "col": "C",
        "desc": "Letter of credit_USD"
    },
    {
        "code": "172_00090",
        "row": 41,
        "col": "D",
        "desc": "Letter of credit_Euros"
    },
    {
        "code": "172_00091",
        "row": 41,
        "col": "E",
        "desc": "Letter of credit_GBP"
    },
    {
        "code": "172_00092",
        "row": 41,
        "col": "F",
        "desc": "Letter of credit_Others"
    },
    {
        "code": "172_00093",
        "row": 42,
        "col": "C",
        "desc": "Guarantees_USD"
    },
    {
        "code": "172_00094",
        "row": 42,
        "col": "D",
        "desc": "Guarantees_Euros"
    },
    {
        "code": "172_00095",
        "row": 42,
        "col": "E",
        "desc": "Guarantees_GBP"
    },
    {
        "code": "172_00096",
        "row": 42,
        "col": "F",
        "desc": "Guarantees_Others"
    },
    {
        "code": "172_00097",
        "row": 43,
        "col": "C",
        "desc": "Other liabilities_USD"
    },
    {
        "code": "172_00098",
        "row": 43,
        "col": "D",
        "desc": "Other liabilities_Euros"
    },
    {
        "code": "172_00099",
        "row": 43,
        "col": "E",
        "desc": "Other liabilities_GBP"
    },
    {
        "code": "172_00100",
        "row": 43,
        "col": "F",
        "desc": "Other liabilities_Others"
    },
    {
        "code": "172_00101",
        "row": 44,
        "col": "C",
        "desc": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_USD"
    },
    {
        "code": "172_00102",
        "row": 44,
        "col": "D",
        "desc": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_Euros"
    },
    {
        "code": "172_00103",
        "row": 44,
        "col": "E",
        "desc": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_GBP"
    },
    {
        "code": "172_00104",
        "row": 44,
        "col": "F",
        "desc": "Total Foreign Currency Liabilities (Sum of 2.1 & 2.2)_Others"
    },
    {
        "code": "172_00105",
        "row": 46,
        "col": "C",
        "desc": "Net long position (where assets less liabilities is +)_USD"
    },
    {
        "code": "172_00106",
        "row": 46,
        "col": "D",
        "desc": "Net long position (where assets less liabilities is +)_Euros"
    },
    {
        "code": "172_00107",
        "row": 46,
        "col": "E",
        "desc": "Net long position (where assets less liabilities is +)_GBP"
    },
    {
        "code": "172_00108",
        "row": 46,
        "col": "F",
        "desc": "Net long position (where assets less liabilities is +)_Others"
    },
    {
        "code": "172_00109",
        "row": 47,
        "col": "C",
        "desc": "Net short position (where assests less liabilities is -)_USD"
    },
    {
        "code": "172_00110",
        "row": 47,
        "col": "D",
        "desc": "Net short position (where assests less liabilities is -)_Euros"
    },
    {
        "code": "172_00111",
        "row": 47,
        "col": "E",
        "desc": "Net short position (where assests less liabilities is -)_GBP"
    },
    {
        "code": "172_00112",
        "row": 47,
        "col": "F",
        "desc": "Net short position (where assests less liabilities is -)_Others"
    },
    {
        "code": "172_00113",
        "row": 48,
        "col": "C",
        "desc": "Mid Exchange Rate_USD"
    },
    {
        "code": "172_00114",
        "row": 48,
        "col": "D",
        "desc": "Mid Exchange Rate_Euros"
    },
    {
        "code": "172_00115",
        "row": 48,
        "col": "E",
        "desc": "Mid Exchange Rate_GBP"
    },
    {
        "code": "172_00116",
        "row": 48,
        "col": "F",
        "desc": "Mid Exchange Rate_Others"
    },
    {
        "code": "172_00117",
        "row": 49,
        "col": "C",
        "desc": "Net long position in Birr (3.1*4)_USD"
    },
    {
        "code": "172_00118",
        "row": 49,
        "col": "D",
        "desc": "Net long position in Birr (3.1*4)_Euros"
    },
    {
        "code": "172_00119",
        "row": 49,
        "col": "E",
        "desc": "Net long position in Birr (3.1*4)_GBP"
    },
    {
        "code": "172_00120",
        "row": 49,
        "col": "F",
        "desc": "Net long position in Birr (3.1*4)_Others"
    },
    {
        "code": "172_00121",
        "row": 50,
        "col": "C",
        "desc": "Net short position in Birr (3.2*4)_USD"
    },
    {
        "code": "172_00122",
        "row": 50,
        "col": "D",
        "desc": "Net short position in Birr (3.2*4)_Euros"
    },
    {
        "code": "172_00123",
        "row": 50,
        "col": "E",
        "desc": "Net short position in Birr (3.2*4)_GBP"
    },
    {
        "code": "172_00124",
        "row": 50,
        "col": "F",
        "desc": "Net short position in Birr (3.2*4)_Others"
    },
    {
        "code": "172_00125",
        "row": 51,
        "col": "C",
        "desc": "Net open position (Greater of 5 or 6)_USD"
    },
    {
        "code": "172_00126",
        "row": 51,
        "col": "D",
        "desc": "Net open position (Greater of 5 or 6)_Euros"
    },
    {
        "code": "172_00127",
        "row": 51,
        "col": "E",
        "desc": "Net open position (Greater of 5 or 6)_GBP"
    },
    {
        "code": "172_00128",
        "row": 51,
        "col": "F",
        "desc": "Net open position (Greater of 5 or 6)_Others"
    },
    {
        "code": "172_00129",
        "row": 52,
        "col": "C",
        "desc": "Overall Foreign Exchange Position_USD"
    },
    {
        "code": "172_00130",
        "row": 52,
        "col": "D",
        "desc": "Overall Foreign Exchange Position_Euros"
    },
    {
        "code": "172_00131",
        "row": 52,
        "col": "E",
        "desc": "Overall Foreign Exchange Position_GBP"
    },
    {
        "code": "172_00132",
        "row": 52,
        "col": "F",
        "desc": "Overall Foreign Exchange Position_Others"
    },
    {
        "code": "172_00133",
        "row": 53,
        "col": "G",
        "desc": "Total long Positions in FX (Sum of row 5)_Gold"
    },
    {
        "code": "172_00134",
        "row": 54,
        "col": "G",
        "desc": "Total Short Positions in FX (Sum of 6)_Gold"
    },
    {
        "code": "172_00135",
        "row": 55,
        "col": "G",
        "desc": "Max (Total Long Positions; Total Short Positions)_Gold"
    },
    {
        "code": "172_00136",
        "row": 56,
        "col": "G",
        "desc": "Gold Position (absolute value)_Gold"
    },
    {
        "code": "172_00137",
        "row": 57,
        "col": "G",
        "desc": "Net Global Open Position (Rows 9 + 10)_Gold"
    },
    {
        "code": "172_00138",
        "row": 58,
        "col": "G",
        "desc": "Total Capital Charge for FX Risk (Row 11*11%)_Gold"
    },
    {
        "code": "172_00139",
        "row": 59,
        "col": "G",
        "desc": "TOTAL RWA for FX = Row 12 * 9.1_Gold"
    },
    {
        "code": "172_00140",
        "row": 34,
        "col": "C",
        "desc": "Borrowings_USD"
    },
    {
        "code": "172_00141",
        "row": 34,
        "col": "D",
        "desc": "Borrowings_Euros"
    },
    {
        "code": "172_00142",
        "row": 34,
        "col": "E",
        "desc": "Borrowings_GBP"
    },
    {
        "code": "172_00143",
        "row": 34,
        "col": "F",
        "desc": "Borrowings_Others"
    }
];

export interface F6001ReturnItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType?: string;
    _required?: boolean;
}

export interface F6001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number | string;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: F6001ReturnItem[];
    DynamicItemsList: any[];
}
