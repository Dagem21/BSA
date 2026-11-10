// @ts-nocheck

export interface C2001ItemDefinition {
    code: string;
    description: string;
    dataType: string;
    required: boolean;
}

export interface C2001CellMapping {
    code: string;
    row: number;
    col: string;
    desc: string;
}

export const C2001_ITEM_DEFINITIONS: C2001ItemDefinition[] = [
    {
        "code": "168_00001",
        "description": "Cash Items (=1.1+1.2+1.3)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00002",
        "description": "Cash Items (=1.1+1.2+1.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00003",
        "description": "Cash Items (=1.1+1.2+1.3)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00004",
        "description": "Cash Items (=1.1+1.2+1.3)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00005",
        "description": "Cash Items (=1.1+1.2+1.3)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00006",
        "description": "Cash on Hand (Local and Foreign Currency)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00007",
        "description": "Cash on Hand (Local and Foreign Currency)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00008",
        "description": "Cash on Hand (Local and Foreign Currency)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00009",
        "description": "Cash on Hand (Local and Foreign Currency)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00010",
        "description": "Cash on Hand (Local and Foreign Currency)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00011",
        "description": "Gold Bullion - In Vault_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00012",
        "description": "Gold Bullion - In Vault_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00013",
        "description": "Gold Bullion - In Vault_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00014",
        "description": "Gold Bullion - In Vault_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00015",
        "description": "Gold Bullion - In Vault_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00016",
        "description": "Cash items in the process of collection_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00017",
        "description": "Cash items in the process of collection_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00018",
        "description": "Cash items in the process of collection_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00019",
        "description": "Cash items in the process of collection_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00020",
        "description": "Cash items in the process of collection_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00021",
        "description": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00022",
        "description": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00023",
        "description": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00024",
        "description": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00025",
        "description": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00026",
        "description": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00027",
        "description": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00028",
        "description": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00029",
        "description": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00030",
        "description": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00031",
        "description": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00032",
        "description": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00033",
        "description": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00034",
        "description": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00035",
        "description": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00036",
        "description": "Claims on or exposure to BIS, ECB, EC and IMF_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00037",
        "description": "Claims on or exposure to BIS, ECB, EC and IMF_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00038",
        "description": "Claims on or exposure to BIS, ECB, EC and IMF_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00039",
        "description": "Claims on or exposure to BIS, ECB, EC and IMF_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00040",
        "description": "Claims on or exposure to BIS, ECB, EC and IMF_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00041",
        "description": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00042",
        "description": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00043",
        "description": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00044",
        "description": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00045",
        "description": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00046",
        "description": "Credit Risk Assessment of Ethiopia_AAA to AA-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00047",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00048",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00049",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00050",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00051",
        "description": "Other Sovereign exposures_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00052",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00053",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00054",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00055",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00056",
        "description": "Other Sovereign exposures_BBB+ to BBB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00057",
        "description": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00058",
        "description": "BBB+ to BBB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00059",
        "description": "BBB+ to BBB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00060",
        "description": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00061",
        "description": "Other Sovereign exposures_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00062",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00063",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00064",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00065",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00066",
        "description": "Other Sovereign exposures_Below B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00067",
        "description": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00068",
        "description": "Below B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00069",
        "description": "Below B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00070",
        "description": "Below B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00071",
        "description": "Other Sovereign exposures_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00072",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00073",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00074",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00075",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00076",
        "description": "Exposures to State Owned Enterprises (=3.1+3.2)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00077",
        "description": "Exposures to State Owned Enterprises (=3.1+3.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00078",
        "description": "Exposures to State Owned Enterprises (=3.1+3.2)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00079",
        "description": "Exposures to State Owned Enterprises (=3.1+3.2)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00080",
        "description": "Exposures to State Owned Enterprises (=3.1+3.2)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00081",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00082",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00083",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00084",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00085",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00086",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00087",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00088",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00089",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00090",
        "description": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00091",
        "description": "Credit Risk Assessment of Ethiopia_AAA to AA-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00092",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00093",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00094",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00095",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00096",
        "description": "Other State-Owned Enterprises (SOEs)_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00097",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00098",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00099",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00100",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00101",
        "description": "Other State-Owned Enterprises (SOEs)_BBB+ to BBB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00102",
        "description": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00103",
        "description": "BBB+ to BBB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00104",
        "description": "BBB+ to BBB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00105",
        "description": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00106",
        "description": "Other State-Owned Enterprises (SOEs)_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00107",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00108",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00109",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00110",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00111",
        "description": "Other State-Owned Enterprises (SOEs)_Below B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00112",
        "description": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00113",
        "description": "Below B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00114",
        "description": "Below B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00115",
        "description": "Below B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00116",
        "description": "Other State-Owned Enterprises (SOEs)_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00117",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00118",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00119",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00120",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00121",
        "description": "Exposures to Multilateral Development Banks (=4.1+4.2)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00122",
        "description": "Exposures to Multilateral Development Banks (=4.1+4.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00123",
        "description": "Exposures to Multilateral Development Banks (=4.1+4.2)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00124",
        "description": "Exposures to Multilateral Development Banks (=4.1+4.2)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00125",
        "description": "Exposures to Multilateral Development Banks (=4.1+4.2)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00126",
        "description": "Exposure to MDBs eligible for 0 percent risk weight._Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00127",
        "description": "Exposure to MDBs eligible for 0 percent risk weight._Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00128",
        "description": "Exposure to MDBs eligible for 0 percent risk weight._Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00129",
        "description": "Exposure to MDBs eligible for 0 percent risk weight._Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00130",
        "description": "Exposure to MDBs eligible for 0 percent risk weight._Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00131",
        "description": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00132",
        "description": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00133",
        "description": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00134",
        "description": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00135",
        "description": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00136",
        "description": "RW of MDBs_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00137",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00138",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00139",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00140",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00141",
        "description": "Other RW of MDBs_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00142",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00143",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00144",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00145",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00146",
        "description": "Other RW of MDBs_BBB+ to BBB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00147",
        "description": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00148",
        "description": "BBB+ to BBB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00149",
        "description": "BBB+ to BBB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00150",
        "description": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00151",
        "description": "Other RW of MDBs_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00152",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00153",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00154",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00155",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00156",
        "description": "Other RW of MDBs_Below B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00157",
        "description": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00158",
        "description": "Below B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00159",
        "description": "Below B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00160",
        "description": "Below B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00161",
        "description": "Other RW of MDBs_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00162",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00163",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00164",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00165",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00166",
        "description": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00167",
        "description": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00168",
        "description": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00169",
        "description": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00170",
        "description": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00171",
        "description": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00172",
        "description": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00173",
        "description": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00174",
        "description": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00175",
        "description": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00176",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_AAA to AA-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00177",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00178",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00179",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00180",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00181",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00182",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00183",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00184",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00185",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00186",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_BBB+ to BBB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00187",
        "description": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00188",
        "description": "BBB+ to BBB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00189",
        "description": "BBB+ to BBB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00190",
        "description": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00191",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00192",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00193",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00194",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00195",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00196",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_Below B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00197",
        "description": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00198",
        "description": "Below B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00199",
        "description": "Below B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00200",
        "description": "Below B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00201",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00202",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00203",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00204",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00205",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00206",
        "description": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00207",
        "description": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00208",
        "description": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00209",
        "description": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00210",
        "description": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00211",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_AAA to AA-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00212",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00213",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00214",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00215",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00216",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00217",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00218",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00219",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00220",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00221",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_BBB+ to BBB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00222",
        "description": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00223",
        "description": "BBB+ to BBB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00224",
        "description": "BBB+ to BBB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00225",
        "description": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00226",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00227",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00228",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00229",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00230",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00231",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_Below B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00232",
        "description": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00233",
        "description": "Below B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00234",
        "description": "Below B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00235",
        "description": "Below B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00236",
        "description": "Credit assessment of Bank, Securities firms and other financial institutions_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00237",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00238",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00239",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00240",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00241",
        "description": "Exposures with original maturity of three months or less denominated and funded in Birr_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00242",
        "description": "Exposures with original maturity of three months or less denominated and funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00243",
        "description": "Exposures with original maturity of three months or less denominated and funded in Birr_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00244",
        "description": "Exposures with original maturity of three months or less denominated and funded in Birr_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00245",
        "description": "Exposures with original maturity of three months or less denominated and funded in Birr_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00246",
        "description": "Exposures to Covered Bonds (=6.1+6.2)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00247",
        "description": "Exposures to Covered Bonds (=6.1+6.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00248",
        "description": "Exposures to Covered Bonds (=6.1+6.2)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00249",
        "description": "Exposures to Covered Bonds (=6.1+6.2)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00250",
        "description": "Exposures to Covered Bonds (=6.1+6.2)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00251",
        "description": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00252",
        "description": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00253",
        "description": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00254",
        "description": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00255",
        "description": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00256",
        "description": "Credit Assessment of the issue-specific or the issuer’s_AAA to AA-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00257",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00258",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00259",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00260",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00261",
        "description": "Credit Assessment of the issue-specific or the issuer’s_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00262",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00263",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00264",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00265",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00266",
        "description": "Credit Assessment of the issue-specific or the issuer’s_BBB+ to BBB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00267",
        "description": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00268",
        "description": "BBB+ to BBB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00269",
        "description": "BBB+ to BBB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00270",
        "description": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00271",
        "description": "Credit Assessment of the issue-specific or the issuer’s_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00272",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00273",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00274",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00275",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00276",
        "description": "Credit Assessment of the issue-specific or the issuer’s_Below B-",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00277",
        "description": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00278",
        "description": "Below B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00279",
        "description": "Below B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00280",
        "description": "Below B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00281",
        "description": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00282",
        "description": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00283",
        "description": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00284",
        "description": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00285",
        "description": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00286",
        "description": "Based on the RW of the Issuing bank_20%_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00287",
        "description": "0.2_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00288",
        "description": "0.2_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00289",
        "description": "0.2_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00290",
        "description": "0.2_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00291",
        "description": "Based on the RW of the Issuing bank_50%_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00292",
        "description": "0.5_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00293",
        "description": "0.5_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00294",
        "description": "0.5_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00295",
        "description": "0.5_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00296",
        "description": "Based on the RW of the Issuing bank_100%_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00297",
        "description": "Based on the RW of the Issuing bank_100%_Credit Risk Grade_(A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00298",
        "description": "Based on the RW of the Issuing bank_100%_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00299",
        "description": "Based on the RW of the Issuing bank_100%_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00300",
        "description": "Based on the RW of the Issuing bank_100%_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00301",
        "description": "Based on the RW of the Issuing bank_100%_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00302",
        "description": "Based on the RW of the Issuing bank_150%_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00303",
        "description": "1.5_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00304",
        "description": "1.5_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00305",
        "description": "1.5_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00306",
        "description": "1.5_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00307",
        "description": "Exposures to Corporates (=7.1+7.2)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00308",
        "description": "Exposures to Corporates (=7.1+7.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00309",
        "description": "Exposures to Corporates (=7.1+7.2)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00310",
        "description": "Exposures to Corporates (=7.1+7.2)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00311",
        "description": "Exposures to Corporates (=7.1+7.2)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00312",
        "description": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00313",
        "description": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00314",
        "description": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00315",
        "description": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00316",
        "description": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00317",
        "description": "External credit rating of corporate_AAA to AA-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00318",
        "description": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00319",
        "description": "AAA to AA-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00320",
        "description": "AAA to AA-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00321",
        "description": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00322",
        "description": "External credit rating of corporate_A+ to A-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00323",
        "description": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00324",
        "description": "A+ to A-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00325",
        "description": "A+ to A-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00326",
        "description": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00327",
        "description": "External credit rating of corporate_BBB+ to BB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00328",
        "description": "BBB+ to BB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00329",
        "description": "BBB+ to BB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00330",
        "description": "BBB+ to BB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00331",
        "description": "BBB+ to BB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00332",
        "description": "External credit rating of corporate_BB+ to B-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00333",
        "description": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00334",
        "description": "BB+ to B-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00335",
        "description": "BB+ to B-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00336",
        "description": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00337",
        "description": "External credit rating of corporate_Below BB-_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00338",
        "description": "Below BB-_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00339",
        "description": "Below BB-_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00340",
        "description": "Below BB-_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00341",
        "description": "Below BB-_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00342",
        "description": "External credit rating of corporate_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00343",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00344",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00345",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00346",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00347",
        "description": "Exposure to Corporate SMEs_Unrated_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00348",
        "description": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00349",
        "description": "Unrated_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00350",
        "description": "Unrated_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00351",
        "description": "Unrated_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00352",
        "description": "Specialized lending_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00353",
        "description": "Specialized lending_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00354",
        "description": "Specialized lending_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00355",
        "description": "Specialized lending_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00356",
        "description": "Specialized lending_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00357",
        "description": "Project finance pre-operational phase_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00358",
        "description": "Project finance pre-operational phase_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00359",
        "description": "Project finance pre-operational phase_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00360",
        "description": "Project finance pre-operational phase_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00361",
        "description": "Project finance pre-operational phase_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00362",
        "description": "Project finance operational phase_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00363",
        "description": "Project finance operational phase_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00364",
        "description": "Project finance operational phase_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00365",
        "description": "Project finance operational phase_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00366",
        "description": "Project finance operational phase_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00367",
        "description": "Project finance operational phase (high quality)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00368",
        "description": "Project finance operational phase (high quality)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00369",
        "description": "Project finance operational phase (high quality)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00370",
        "description": "Project finance operational phase (high quality)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00371",
        "description": "Project finance operational phase (high quality)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00372",
        "description": "Object finance and commodity finance_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00373",
        "description": "Object finance and commodity finance_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00374",
        "description": "Object finance and commodity finance_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00375",
        "description": "Object finance and commodity finance_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00376",
        "description": "Object finance and commodity finance_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00377",
        "description": "Retail Exposures (individuals or small business) (=8.1+8.2)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00378",
        "description": "Retail Exposures (individuals or small business) (=8.1+8.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00379",
        "description": "Retail Exposures (individuals or small business) (=8.1+8.2)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00380",
        "description": "Retail Exposures (individuals or small business) (=8.1+8.2)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00381",
        "description": "Retail Exposures (individuals or small business) (=8.1+8.2)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00382",
        "description": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00383",
        "description": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00384",
        "description": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00385",
        "description": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00386",
        "description": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00387",
        "description": "Revolving credits & lines of credit (including credit cards and overdrafts)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00388",
        "description": "Revolving credits & lines of credit (including credit cards and overdrafts)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00389",
        "description": "Revolving credits & lines of credit (including credit cards and overdrafts)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00390",
        "description": "Revolving credits & lines of credit (including credit cards and overdrafts)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00391",
        "description": "Revolving credits & lines of credit (including credit cards and overdrafts)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00392",
        "description": "Personal term loans and leases_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00393",
        "description": "Personal term loans and leases_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00394",
        "description": "Personal term loans and leases_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00395",
        "description": "Personal term loans and leases_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00396",
        "description": "Personal term loans and leases_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00397",
        "description": "Small business facilities and commitments_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00398",
        "description": "Small business facilities and commitments_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00399",
        "description": "Small business facilities and commitments_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00400",
        "description": "Small business facilities and commitments_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00401",
        "description": "Small business facilities and commitments_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00402",
        "description": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00403",
        "description": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00404",
        "description": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00405",
        "description": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00406",
        "description": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00407",
        "description": "Real estate exposures (performing) (=9.1+9.2)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00408",
        "description": "Real estate exposures (performing) (=9.1+9.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00409",
        "description": "Real estate exposures (performing) (=9.1+9.2)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00410",
        "description": "Real estate exposures (performing) (=9.1+9.2)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00411",
        "description": "Real estate exposures (performing) (=9.1+9.2)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00412",
        "description": "Exposure to Residential Real estate occupied by the owner or rented not past due_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00413",
        "description": "Exposure to Residential Real estate occupied by the owner or rented not past due_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00414",
        "description": "Exposure to Residential Real estate occupied by the owner or rented not past due_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00415",
        "description": "Exposure to Residential Real estate occupied by the owner or rented not past due_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00416",
        "description": "Exposure to Residential Real estate occupied by the owner or rented not past due_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00417",
        "description": "Exposure to Commercial real estates_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00418",
        "description": "Exposure to Commercial real estates_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00419",
        "description": "Exposure to Commercial real estates_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00420",
        "description": "Exposure to Commercial real estates_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00421",
        "description": "Exposure to Commercial real estates_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00422",
        "description": "Defaulted Exposure (=10.1+10.2+10.3)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00423",
        "description": "Defaulted Exposure (=10.1+10.2+10.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00424",
        "description": "Defaulted Exposure (=10.1+10.2+10.3)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00425",
        "description": "Defaulted Exposure (=10.1+10.2+10.3)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00426",
        "description": "Defaulted Exposure (=10.1+10.2+10.3)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00427",
        "description": "Unsecured portion, where specific provisions => 20%_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00428",
        "description": "Unsecured portion, where specific provisions => 20%_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00429",
        "description": "Unsecured portion, where specific provisions => 20%_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00430",
        "description": "Unsecured portion, where specific provisions => 20%_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00431",
        "description": "Unsecured portion, where specific provisions => 20%_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00432",
        "description": "Unsecured portion, where specific provisions < 20%_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00433",
        "description": "Unsecured portion, where specific provisions < 20%_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00434",
        "description": "Unsecured portion, where specific provisions < 20%_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00435",
        "description": "Unsecured portion, where specific provisions < 20%_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00436",
        "description": "Unsecured portion, where specific provisions < 20%_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00437",
        "description": "Residential real estate exposures_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00438",
        "description": "Residential real estate exposures_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00439",
        "description": "Residential real estate exposures_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00440",
        "description": "Residential real estate exposures_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00441",
        "description": "Residential real estate exposures_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00442",
        "description": "Other exposures (=11.1+11.2+11.3)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00443",
        "description": "Other exposures (=11.1+11.2+11.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00444",
        "description": "Other exposures (=11.1+11.2+11.3)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00445",
        "description": "Other exposures (=11.1+11.2+11.3)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00446",
        "description": "Other exposures (=11.1+11.2+11.3)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00447",
        "description": "Fixed Assets_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00448",
        "description": "Fixed Assets_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00449",
        "description": "Fixed Assets_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00450",
        "description": "Fixed Assets_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00451",
        "description": "Fixed Assets_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00452",
        "description": "Investment that are not deducted from Capital_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00453",
        "description": "Investment that are not deducted from Capital_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00454",
        "description": "Investment that are not deducted from Capital_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00455",
        "description": "Investment that are not deducted from Capital_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00456",
        "description": "Investment that are not deducted from Capital_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00457",
        "description": "Others_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00458",
        "description": "Others_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00459",
        "description": "Others_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00460",
        "description": "Others_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00461",
        "description": "Others_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00462",
        "description": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00463",
        "description": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00464",
        "description": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00465",
        "description": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00466",
        "description": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00467",
        "description": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Total Exposure",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00468",
        "description": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Exposure without Credit Risk Mitigation (CRM)*_(B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00469",
        "description": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Exposures with CRM coverage**_(C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00470",
        "description": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Risk Weight_(D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00471",
        "description": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Risk Weighted Assets_E=(B+C)* D/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00472",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00473",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00474",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00475",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00476",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00477",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00478",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00479",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00480",
        "description": "Interest Rate Related Contracts (=1.1+1.2+1.3)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00481",
        "description": "Residual maturity 1 year or less_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00482",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00483",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00484",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00485",
        "description": "Residual maturity 1 year or less_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00486",
        "description": "Residual maturity 1 year or less_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00487",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00488",
        "description": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00489",
        "description": "Residual maturity 1 year or less_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00490",
        "description": "Residual maturity > 1 year to 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00491",
        "description": "Residual maturity > 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00492",
        "description": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00493",
        "description": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00494",
        "description": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00495",
        "description": "Residual maturity > 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00496",
        "description": "Residual maturity > 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00497",
        "description": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00498",
        "description": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00499",
        "description": "Residual maturity > 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00500",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00501",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00502",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00503",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00504",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00505",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00506",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00507",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00508",
        "description": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00509",
        "description": "Residual maturity 1 year or less_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00510",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00511",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00512",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00513",
        "description": "Residual maturity 1 year or less_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00514",
        "description": "Residual maturity 1 year or less_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00515",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00516",
        "description": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00517",
        "description": "Residual maturity 1 year or less_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00518",
        "description": "Residual maturity > 1 year to 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00519",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00520",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00521",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00522",
        "description": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00523",
        "description": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00524",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00525",
        "description": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00526",
        "description": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00527",
        "description": "Residual maturity > 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00528",
        "description": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00529",
        "description": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00530",
        "description": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00531",
        "description": "Residual maturity > 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00532",
        "description": "Residual maturity > 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00533",
        "description": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00534",
        "description": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00535",
        "description": "Residual maturity > 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00536",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00537",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00538",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00539",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00540",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00541",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00542",
        "description": "Equity Contracts (=3.1+3.2+3.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00543",
        "description": "Equity Contracts (=3.1+3.2+3.3)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00544",
        "description": "Equity Contracts (=3.1+3.2+3.3)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00545",
        "description": "Residual maturity 1 year or less_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00546",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00547",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00548",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00549",
        "description": "Residual maturity 1 year or less_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00550",
        "description": "Residual maturity 1 year or less_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00551",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00552",
        "description": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00553",
        "description": "Residual maturity 1 year or less_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00554",
        "description": "Residual maturity > 1 year to 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00555",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00556",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00557",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00558",
        "description": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00559",
        "description": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00560",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00561",
        "description": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00562",
        "description": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00563",
        "description": "Residual maturity > 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00564",
        "description": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00565",
        "description": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00566",
        "description": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00567",
        "description": "Residual maturity > 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00568",
        "description": "Residual maturity > 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00569",
        "description": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00570",
        "description": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00571",
        "description": "Residual maturity > 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00572",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00573",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00574",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00575",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00576",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00577",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00578",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00579",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00580",
        "description": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00581",
        "description": "Residual maturity 1 year or less_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00582",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00583",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00584",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00585",
        "description": "Residual maturity 1 year or less_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00586",
        "description": "Residual maturity 1 year or less_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00587",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00588",
        "description": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00589",
        "description": "Residual maturity 1 year or less_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00590",
        "description": "Residual maturity > 1 year to 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00591",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00592",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00593",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00594",
        "description": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00595",
        "description": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00596",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00597",
        "description": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00598",
        "description": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00599",
        "description": "Residual maturity > 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00600",
        "description": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00601",
        "description": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00602",
        "description": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00603",
        "description": "Residual maturity > 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00604",
        "description": "Residual maturity > 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00605",
        "description": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00606",
        "description": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00607",
        "description": "Residual maturity > 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00608",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00609",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00610",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00611",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00612",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00613",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00614",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00615",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00616",
        "description": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00617",
        "description": "Residual maturity 1 year or less_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00618",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00619",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00620",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00621",
        "description": "Residual maturity 1 year or less_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00622",
        "description": "Residual maturity 1 year or less_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00623",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00624",
        "description": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00625",
        "description": "Residual maturity 1 year or less_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00626",
        "description": "Residual maturity > 1 year to 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00627",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00628",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00629",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00630",
        "description": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00631",
        "description": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00632",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00633",
        "description": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00634",
        "description": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00635",
        "description": "Residual maturity > 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00636",
        "description": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00637",
        "description": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00638",
        "description": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00639",
        "description": "Residual maturity > 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00640",
        "description": "Residual maturity > 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00641",
        "description": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00642",
        "description": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00643",
        "description": "Residual maturity > 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00644",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00645",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00646",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00647",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00648",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00649",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00650",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00651",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00652",
        "description": "Other Market Related Contracts (=6.1+6.2+6.3)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00653",
        "description": "Residual maturity 1 year or less_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00654",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00655",
        "description": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00656",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00657",
        "description": "Residual maturity 1 year or less_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00658",
        "description": "Residual maturity 1 year or less_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00659",
        "description": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00660",
        "description": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00661",
        "description": "Residual maturity 1 year or less_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00662",
        "description": "Residual maturity > 1 year to 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00663",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00664",
        "description": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00665",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00666",
        "description": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00667",
        "description": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00668",
        "description": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00669",
        "description": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00670",
        "description": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00671",
        "description": "Residual maturity > 5 years_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00672",
        "description": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00673",
        "description": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00674",
        "description": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00675",
        "description": "Residual maturity > 5 years_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00676",
        "description": "Residual maturity > 5 years_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00677",
        "description": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00678",
        "description": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00679",
        "description": "Residual maturity > 5 years_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00680",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00681",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00682",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00683",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00684",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00685",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00686",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00687",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00688",
        "description": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00689",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Add-On (A)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00690",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Exposures without CRM_Replacement cost of contracts (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00691",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Exposures without CRM_Notional Principal amounts (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00692",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Credit equivalent exposure D=B+(C*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00693",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Replacement cost of contracts (E)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00694",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Notional Principal amounts (F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00695",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Credit equivalent exposure pre-CRM G=E+(F*A)/100",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00696",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_RW of Counterparty or Guarantee (H)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00697",
        "description": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_RWA             I=(D+G)*H",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00698",
        "description": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_C = Collateral (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00699",
        "description": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_HFX = 0.08, if C and E in different currencies, else 0 (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00700",
        "description": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_RW of the counterparty (D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00701",
        "description": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_RWA E=Max {0;1.15*A –(0.85 -C)*B}*D",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00702",
        "description": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_C = Collateral (B)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00703",
        "description": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_HFX = 0.08, if C and E in different currencies, else 0 (C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00704",
        "description": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_RW of the counterparty (D)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00705",
        "description": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_RWA E=Max {0;1.15*A –(0.85 -C)*B}*D",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00706",
        "description": "Total Risk Weighted Assets for Credit Risk (=B+C)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00707",
        "description": "TOTAL On-balance Sheet Credit Risk RWA",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00708",
        "description": "TOTAL Off-balance Sheet Credit Risk RWA (=C.1+C.2+C.3)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00709",
        "description": "Total Off-balance Sheet (Non-Derivatives and SFT)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00710",
        "description": "Total Off-balance Sheet OTC Derivatives Credit RWA",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00711",
        "description": "Total Off-balance Sheet SFT Credit Risk RWA",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00712",
        "description": "Total Capital For Credit Risk (=E+F)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00713",
        "description": "Total On-balance Sheet Credit Risk Capital (=B*11%)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00714",
        "description": "Total Off-balance Sheet Credit Risk Capital (=C*11%)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00715",
        "description": "Commitments that are unconditionally cancellable at any time by the bank without prior notice, or that effectively provide for automatic cancellation due to deterioration in a borrower’s creditworthiness (e.g. loan commitment) shall be applied CCF of 10% (=Sum of 1.1 up to 1.10)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00716",
        "description": "Applies to both the issuing and confirming banks of short-term self-liquidating trade letters of credit arising from the movement of goods (e.g. documentary credits collateralized by the underlying shipment, letter of credit, except standby letter of credit) shall be applied CCF of 20% (=Sum of 2.1 up to 2.10)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00717",
        "description": "Commitments, regardless of the maturity of the underlying facility, unless they qualify for a lower CCF, shall be applied CCF of 40% (=Sum of 3.1 up to 3.10)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00718",
        "description": "Certain transaction-related contingent items including performance bonds, bid bonds, warranties and standby letters of credit related to particular transactions, shall be applied CCF of 50%. (=Sum of 4.1 up to 4.10)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00719",
        "description": "Note issuance facilities (NIFs) and revolving underwriting facilities (RUFs) regardless of the maturity of the underlying facility, shall be applied CCF of 50 %. ( =Sum of 5.1 up to 5.10).",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00720",
        "description": "Direct credit substitutes, e.g. general guarantees of indebtedness (including standby letters of credit serving as financial guarantees for loans and securities) and acceptances (including endorsements with the character of acceptances), shall be applied CCF of 100% (=Sum of 6.1 up to 6.10).",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00721",
        "description": "Sale and repurchase agreements and asset sales with recourse where the credit risk remains with the bank, shall be applied CCF of 100% (=Sum of 7.1 up to 7.10)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00722",
        "description": "Lending of banks’ securities or the posting of securities as collateral by banks, including instances where these arise out of repo-style transactions (i.e. repurchase/reverse repurchase and securities lending/securities borrowing transactions), shall be applied CCF of 100% (=Sum of 8.1 up to 8.10)",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00723",
        "description": "Forward asset purchases, forward deposits and partly paid shares and securities which represent commitments with certain drawdown and shall be weighted according to the type of asset and not accordingly to the type of counterparty with whom the transaction has been entered into, shall be applied CCF of 100% (=Sum of 9.1 up to 9.10).",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00724",
        "description": "Off-balance sheet items that are credit substitutes not explicitly included in any other category, shall be applied CCF of 100% (=Sum of 10.1 up to 10.10).",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00725",
        "description": "Total Off-Balance Sheet (Non-Derivatives and SFT) Credit RWA (=Sum of 1 up to 10 )",
        "dataType": "NUMERIC",
        "required": false
    },
    {
        "code": "168_00726",
        "description": "Total Off-Balance Sheet (Non-Market) Credit Risk CAPITAL (=11*11%)",
        "dataType": "NUMERIC",
        "required": false
    }
];

export const C2001_CELL_MAPPING: C2001CellMapping[] = [
    {
        "code": "168_00001",
        "row": 18,
        "col": "C",
        "desc": "Cash Items (=1.1+1.2+1.3)_Total Exposure"
    },
    {
        "code": "168_00002",
        "row": 18,
        "col": "E",
        "desc": "Cash Items (=1.1+1.2+1.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00003",
        "row": 18,
        "col": "F",
        "desc": "Cash Items (=1.1+1.2+1.3)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00004",
        "row": 18,
        "col": "G",
        "desc": "Cash Items (=1.1+1.2+1.3)_Risk Weight_(D)"
    },
    {
        "code": "168_00005",
        "row": 18,
        "col": "H",
        "desc": "Cash Items (=1.1+1.2+1.3)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00006",
        "row": 19,
        "col": "C",
        "desc": "Cash on Hand (Local and Foreign Currency)_Total Exposure"
    },
    {
        "code": "168_00007",
        "row": 19,
        "col": "E",
        "desc": "Cash on Hand (Local and Foreign Currency)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00008",
        "row": 19,
        "col": "F",
        "desc": "Cash on Hand (Local and Foreign Currency)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00009",
        "row": 19,
        "col": "G",
        "desc": "Cash on Hand (Local and Foreign Currency)_Risk Weight_(D)"
    },
    {
        "code": "168_00010",
        "row": 19,
        "col": "H",
        "desc": "Cash on Hand (Local and Foreign Currency)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00011",
        "row": 20,
        "col": "C",
        "desc": "Gold Bullion - In Vault_Total Exposure"
    },
    {
        "code": "168_00012",
        "row": 20,
        "col": "E",
        "desc": "Gold Bullion - In Vault_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00013",
        "row": 20,
        "col": "F",
        "desc": "Gold Bullion - In Vault_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00014",
        "row": 20,
        "col": "G",
        "desc": "Gold Bullion - In Vault_Risk Weight_(D)"
    },
    {
        "code": "168_00015",
        "row": 20,
        "col": "H",
        "desc": "Gold Bullion - In Vault_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00016",
        "row": 21,
        "col": "C",
        "desc": "Cash items in the process of collection_Total Exposure"
    },
    {
        "code": "168_00017",
        "row": 21,
        "col": "E",
        "desc": "Cash items in the process of collection_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00018",
        "row": 21,
        "col": "F",
        "desc": "Cash items in the process of collection_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00019",
        "row": 21,
        "col": "G",
        "desc": "Cash items in the process of collection_Risk Weight_(D)"
    },
    {
        "code": "168_00020",
        "row": 21,
        "col": "H",
        "desc": "Cash items in the process of collection_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00021",
        "row": 22,
        "col": "C",
        "desc": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Total Exposure"
    },
    {
        "code": "168_00022",
        "row": 22,
        "col": "E",
        "desc": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00023",
        "row": 22,
        "col": "F",
        "desc": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00024",
        "row": 22,
        "col": "G",
        "desc": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Risk Weight_(D)"
    },
    {
        "code": "168_00025",
        "row": 22,
        "col": "H",
        "desc": "Exposures to Sovereigns (=2.1+2.2+2.3+2.4)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00026",
        "row": 23,
        "col": "C",
        "desc": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Total Exposure"
    },
    {
        "code": "168_00027",
        "row": 23,
        "col": "E",
        "desc": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00028",
        "row": 23,
        "col": "F",
        "desc": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00029",
        "row": 23,
        "col": "G",
        "desc": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Risk Weight_(D)"
    },
    {
        "code": "168_00030",
        "row": 23,
        "col": "H",
        "desc": "Deposit at NBE, T-Bills, bonds issued by FDRE Gov. and other exposures FDRE Gov. & NBE denominated & funded in Birr_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00031",
        "row": 24,
        "col": "C",
        "desc": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Total Exposure"
    },
    {
        "code": "168_00032",
        "row": 24,
        "col": "E",
        "desc": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00033",
        "row": 24,
        "col": "F",
        "desc": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00034",
        "row": 24,
        "col": "G",
        "desc": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Risk Weight_(D)"
    },
    {
        "code": "168_00035",
        "row": 24,
        "col": "H",
        "desc": "Claims on Regional Governments and Chartered City Administration, denominated and funded in Birr_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00036",
        "row": 25,
        "col": "C",
        "desc": "Claims on or exposure to BIS, ECB, EC and IMF_Total Exposure"
    },
    {
        "code": "168_00037",
        "row": 25,
        "col": "E",
        "desc": "Claims on or exposure to BIS, ECB, EC and IMF_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00038",
        "row": 25,
        "col": "F",
        "desc": "Claims on or exposure to BIS, ECB, EC and IMF_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00039",
        "row": 25,
        "col": "G",
        "desc": "Claims on or exposure to BIS, ECB, EC and IMF_Risk Weight_(D)"
    },
    {
        "code": "168_00040",
        "row": 25,
        "col": "H",
        "desc": "Claims on or exposure to BIS, ECB, EC and IMF_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00041",
        "row": 26,
        "col": "C",
        "desc": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Total Exposure"
    },
    {
        "code": "168_00042",
        "row": 26,
        "col": "E",
        "desc": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00043",
        "row": 26,
        "col": "F",
        "desc": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00044",
        "row": 26,
        "col": "G",
        "desc": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Risk Weight_(D)"
    },
    {
        "code": "168_00045",
        "row": 26,
        "col": "H",
        "desc": "Other Sovereign exposures (FDRE, NBE, Regional Governments and Chartered City Administrations)denominated and funded in FCY(=2.4.1+2.4.2+2.4.3+2.4.4+2.4.5+2.4.6)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00046",
        "row": 27,
        "col": "C",
        "desc": "Credit Risk Assessment of Ethiopia_AAA to AA-_Total Exposure"
    },
    {
        "code": "168_00047",
        "row": 27,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00048",
        "row": 27,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00049",
        "row": 27,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00050",
        "row": 27,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00051",
        "row": 28,
        "col": "C",
        "desc": "Other Sovereign exposures_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00052",
        "row": 28,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00053",
        "row": 28,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00054",
        "row": 28,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00055",
        "row": 28,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00056",
        "row": 29,
        "col": "C",
        "desc": "Other Sovereign exposures_BBB+ to BBB-_Total Exposure"
    },
    {
        "code": "168_00057",
        "row": 29,
        "col": "E",
        "desc": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00058",
        "row": 29,
        "col": "F",
        "desc": "BBB+ to BBB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00059",
        "row": 29,
        "col": "G",
        "desc": "BBB+ to BBB-_Risk Weight_(D)"
    },
    {
        "code": "168_00060",
        "row": 29,
        "col": "H",
        "desc": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00061",
        "row": 30,
        "col": "C",
        "desc": "Other Sovereign exposures_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00062",
        "row": 30,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00063",
        "row": 30,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00064",
        "row": 30,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00065",
        "row": 30,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00066",
        "row": 31,
        "col": "C",
        "desc": "Other Sovereign exposures_Below B-_Total Exposure"
    },
    {
        "code": "168_00067",
        "row": 31,
        "col": "E",
        "desc": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00068",
        "row": 31,
        "col": "F",
        "desc": "Below B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00069",
        "row": 31,
        "col": "G",
        "desc": "Below B-_Risk Weight_(D)"
    },
    {
        "code": "168_00070",
        "row": 31,
        "col": "H",
        "desc": "Below B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00071",
        "row": 32,
        "col": "C",
        "desc": "Other Sovereign exposures_Unrated_Total Exposure"
    },
    {
        "code": "168_00072",
        "row": 32,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00073",
        "row": 32,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00074",
        "row": 32,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00075",
        "row": 32,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00076",
        "row": 33,
        "col": "C",
        "desc": "Exposures to State Owned Enterprises (=3.1+3.2)_Total Exposure"
    },
    {
        "code": "168_00077",
        "row": 33,
        "col": "E",
        "desc": "Exposures to State Owned Enterprises (=3.1+3.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00078",
        "row": 33,
        "col": "F",
        "desc": "Exposures to State Owned Enterprises (=3.1+3.2)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00079",
        "row": 33,
        "col": "G",
        "desc": "Exposures to State Owned Enterprises (=3.1+3.2)_Risk Weight_(D)"
    },
    {
        "code": "168_00080",
        "row": 33,
        "col": "H",
        "desc": "Exposures to State Owned Enterprises (=3.1+3.2)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00081",
        "row": 34,
        "col": "C",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Total Exposure"
    },
    {
        "code": "168_00082",
        "row": 34,
        "col": "E",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00083",
        "row": 34,
        "col": "F",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00084",
        "row": 34,
        "col": "G",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Risk Weight_(D)"
    },
    {
        "code": "168_00085",
        "row": 34,
        "col": "H",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominated and funded in Birr_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00086",
        "row": 35,
        "col": "C",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Total Exposure"
    },
    {
        "code": "168_00087",
        "row": 35,
        "col": "E",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00088",
        "row": 35,
        "col": "F",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00089",
        "row": 35,
        "col": "G",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Risk Weight_(D)"
    },
    {
        "code": "168_00090",
        "row": 35,
        "col": "H",
        "desc": "Exposures to State-Owned Enterprises (SOEs) denominatedand funded in FCY (=3.2.1+3.2.2+3.2.3+3.2.4+3.2.5+3.2.6)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00091",
        "row": 36,
        "col": "C",
        "desc": "Credit Risk Assessment of Ethiopia_AAA to AA-_Total Exposure"
    },
    {
        "code": "168_00092",
        "row": 36,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00093",
        "row": 36,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00094",
        "row": 36,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00095",
        "row": 36,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00096",
        "row": 37,
        "col": "C",
        "desc": "Other State-Owned Enterprises (SOEs)_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00097",
        "row": 37,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00098",
        "row": 37,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00099",
        "row": 37,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00100",
        "row": 37,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00101",
        "row": 38,
        "col": "C",
        "desc": "Other State-Owned Enterprises (SOEs)_BBB+ to BBB-_Total Exposure"
    },
    {
        "code": "168_00102",
        "row": 38,
        "col": "E",
        "desc": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00103",
        "row": 38,
        "col": "F",
        "desc": "BBB+ to BBB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00104",
        "row": 38,
        "col": "G",
        "desc": "BBB+ to BBB-_Risk Weight_(D)"
    },
    {
        "code": "168_00105",
        "row": 38,
        "col": "H",
        "desc": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00106",
        "row": 39,
        "col": "C",
        "desc": "Other State-Owned Enterprises (SOEs)_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00107",
        "row": 39,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00108",
        "row": 39,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00109",
        "row": 39,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00110",
        "row": 39,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00111",
        "row": 40,
        "col": "C",
        "desc": "Other State-Owned Enterprises (SOEs)_Below B-_Total Exposure"
    },
    {
        "code": "168_00112",
        "row": 40,
        "col": "E",
        "desc": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00113",
        "row": 40,
        "col": "F",
        "desc": "Below B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00114",
        "row": 40,
        "col": "G",
        "desc": "Below B-_Risk Weight_(D)"
    },
    {
        "code": "168_00115",
        "row": 40,
        "col": "H",
        "desc": "Below B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00116",
        "row": 41,
        "col": "C",
        "desc": "Other State-Owned Enterprises (SOEs)_Unrated_Total Exposure"
    },
    {
        "code": "168_00117",
        "row": 41,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00118",
        "row": 41,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00119",
        "row": 41,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00120",
        "row": 41,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00121",
        "row": 42,
        "col": "C",
        "desc": "Exposures to Multilateral Development Banks (=4.1+4.2)_Total Exposure"
    },
    {
        "code": "168_00122",
        "row": 42,
        "col": "E",
        "desc": "Exposures to Multilateral Development Banks (=4.1+4.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00123",
        "row": 42,
        "col": "F",
        "desc": "Exposures to Multilateral Development Banks (=4.1+4.2)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00124",
        "row": 42,
        "col": "G",
        "desc": "Exposures to Multilateral Development Banks (=4.1+4.2)_Risk Weight_(D)"
    },
    {
        "code": "168_00125",
        "row": 42,
        "col": "H",
        "desc": "Exposures to Multilateral Development Banks (=4.1+4.2)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00126",
        "row": 43,
        "col": "C",
        "desc": "Exposure to MDBs eligible for 0 percent risk weight._Total Exposure"
    },
    {
        "code": "168_00127",
        "row": 43,
        "col": "E",
        "desc": "Exposure to MDBs eligible for 0 percent risk weight._Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00128",
        "row": 43,
        "col": "F",
        "desc": "Exposure to MDBs eligible for 0 percent risk weight._Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00129",
        "row": 43,
        "col": "G",
        "desc": "Exposure to MDBs eligible for 0 percent risk weight._Risk Weight_(D)"
    },
    {
        "code": "168_00130",
        "row": 43,
        "col": "H",
        "desc": "Exposure to MDBs eligible for 0 percent risk weight._Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00131",
        "row": 44,
        "col": "C",
        "desc": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Total Exposure"
    },
    {
        "code": "168_00132",
        "row": 44,
        "col": "E",
        "desc": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00133",
        "row": 44,
        "col": "F",
        "desc": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00134",
        "row": 44,
        "col": "G",
        "desc": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Risk Weight_(D)"
    },
    {
        "code": "168_00135",
        "row": 44,
        "col": "H",
        "desc": "Other MDBs (=4.2.1+4.2.2+4.2.3+4.2.4+4.2.5+4.2.6)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00136",
        "row": 45,
        "col": "C",
        "desc": "RW of MDBs_Total Exposure"
    },
    {
        "code": "168_00137",
        "row": 45,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00138",
        "row": 45,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00139",
        "row": 45,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00140",
        "row": 45,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00141",
        "row": 46,
        "col": "C",
        "desc": "Other RW of MDBs_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00142",
        "row": 46,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00143",
        "row": 46,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00144",
        "row": 46,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00145",
        "row": 46,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00146",
        "row": 47,
        "col": "C",
        "desc": "Other RW of MDBs_BBB+ to BBB-_Total Exposure"
    },
    {
        "code": "168_00147",
        "row": 47,
        "col": "E",
        "desc": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00148",
        "row": 47,
        "col": "F",
        "desc": "BBB+ to BBB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00149",
        "row": 47,
        "col": "G",
        "desc": "BBB+ to BBB-_Risk Weight_(D)"
    },
    {
        "code": "168_00150",
        "row": 47,
        "col": "H",
        "desc": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00151",
        "row": 48,
        "col": "C",
        "desc": "Other RW of MDBs_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00152",
        "row": 48,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00153",
        "row": 48,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00154",
        "row": 48,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00155",
        "row": 48,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00156",
        "row": 49,
        "col": "C",
        "desc": "Other RW of MDBs_Below B-_Total Exposure"
    },
    {
        "code": "168_00157",
        "row": 49,
        "col": "E",
        "desc": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00158",
        "row": 49,
        "col": "F",
        "desc": "Below B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00159",
        "row": 49,
        "col": "G",
        "desc": "Below B-_Risk Weight_(D)"
    },
    {
        "code": "168_00160",
        "row": 49,
        "col": "H",
        "desc": "Below B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00161",
        "row": 50,
        "col": "C",
        "desc": "Other RW of MDBs_Unrated_Total Exposure"
    },
    {
        "code": "168_00162",
        "row": 50,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00163",
        "row": 50,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00164",
        "row": 50,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00165",
        "row": 50,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00166",
        "row": 51,
        "col": "C",
        "desc": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Total Exposure"
    },
    {
        "code": "168_00167",
        "row": 51,
        "col": "E",
        "desc": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00168",
        "row": 51,
        "col": "F",
        "desc": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00169",
        "row": 51,
        "col": "G",
        "desc": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Risk Weight_(D)"
    },
    {
        "code": "168_00170",
        "row": 51,
        "col": "H",
        "desc": "Exposures to Banks, Securities firms and other financial institutions (=5.1+5.2+5.3)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00171",
        "row": 52,
        "col": "C",
        "desc": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Total Exposure"
    },
    {
        "code": "168_00172",
        "row": 52,
        "col": "E",
        "desc": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00173",
        "row": 52,
        "col": "F",
        "desc": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00174",
        "row": 52,
        "col": "G",
        "desc": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Risk Weight_(D)"
    },
    {
        "code": "168_00175",
        "row": 52,
        "col": "H",
        "desc": "Exposures with original maturity of more than three months (=5.1.1+5.1.2+5.1.3+5.1.4+5.1.5+5.1.6)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00176",
        "row": 53,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_AAA to AA-_Total Exposure"
    },
    {
        "code": "168_00177",
        "row": 53,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00178",
        "row": 53,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00179",
        "row": 53,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00180",
        "row": 53,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00181",
        "row": 54,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00182",
        "row": 54,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00183",
        "row": 54,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00184",
        "row": 54,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00185",
        "row": 54,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00186",
        "row": 55,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_BBB+ to BBB-_Total Exposure"
    },
    {
        "code": "168_00187",
        "row": 55,
        "col": "E",
        "desc": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00188",
        "row": 55,
        "col": "F",
        "desc": "BBB+ to BBB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00189",
        "row": 55,
        "col": "G",
        "desc": "BBB+ to BBB-_Risk Weight_(D)"
    },
    {
        "code": "168_00190",
        "row": 55,
        "col": "H",
        "desc": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00191",
        "row": 56,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00192",
        "row": 56,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00193",
        "row": 56,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00194",
        "row": 56,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00195",
        "row": 56,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00196",
        "row": 57,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_Below B-_Total Exposure"
    },
    {
        "code": "168_00197",
        "row": 57,
        "col": "E",
        "desc": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00198",
        "row": 57,
        "col": "F",
        "desc": "Below B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00199",
        "row": 57,
        "col": "G",
        "desc": "Below B-_Risk Weight_(D)"
    },
    {
        "code": "168_00200",
        "row": 57,
        "col": "H",
        "desc": "Below B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00201",
        "row": 58,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_Unrated_Total Exposure"
    },
    {
        "code": "168_00202",
        "row": 58,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00203",
        "row": 58,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00204",
        "row": 58,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00205",
        "row": 58,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00206",
        "row": 59,
        "col": "C",
        "desc": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Total Exposure"
    },
    {
        "code": "168_00207",
        "row": 59,
        "col": "E",
        "desc": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00208",
        "row": 59,
        "col": "F",
        "desc": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00209",
        "row": 59,
        "col": "G",
        "desc": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Risk Weight_(D)"
    },
    {
        "code": "168_00210",
        "row": 59,
        "col": "H",
        "desc": "Exposures with original maturity of three months or less (=5.2.1+5.2.2+5.2.3+5.2.4+5.2.5+5.2.6)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00211",
        "row": 60,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_AAA to AA-_Total Exposure"
    },
    {
        "code": "168_00212",
        "row": 60,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00213",
        "row": 60,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00214",
        "row": 60,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00215",
        "row": 60,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00216",
        "row": 61,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00217",
        "row": 61,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00218",
        "row": 61,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00219",
        "row": 61,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00220",
        "row": 61,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00221",
        "row": 62,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_BBB+ to BBB-_Total Exposure"
    },
    {
        "code": "168_00222",
        "row": 62,
        "col": "E",
        "desc": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00223",
        "row": 62,
        "col": "F",
        "desc": "BBB+ to BBB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00224",
        "row": 62,
        "col": "G",
        "desc": "BBB+ to BBB-_Risk Weight_(D)"
    },
    {
        "code": "168_00225",
        "row": 62,
        "col": "H",
        "desc": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00226",
        "row": 63,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00227",
        "row": 63,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00228",
        "row": 63,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00229",
        "row": 63,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00230",
        "row": 63,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00231",
        "row": 64,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_Below B-_Total Exposure"
    },
    {
        "code": "168_00232",
        "row": 64,
        "col": "E",
        "desc": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00233",
        "row": 64,
        "col": "F",
        "desc": "Below B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00234",
        "row": 64,
        "col": "G",
        "desc": "Below B-_Risk Weight_(D)"
    },
    {
        "code": "168_00235",
        "row": 64,
        "col": "H",
        "desc": "Below B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00236",
        "row": 65,
        "col": "C",
        "desc": "Credit assessment of Bank, Securities firms and other financial institutions_Unrated_Total Exposure"
    },
    {
        "code": "168_00237",
        "row": 65,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00238",
        "row": 65,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00239",
        "row": 65,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00240",
        "row": 65,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00241",
        "row": 66,
        "col": "C",
        "desc": "Exposures with original maturity of three months or less denominated and funded in Birr_Total Exposure"
    },
    {
        "code": "168_00242",
        "row": 66,
        "col": "E",
        "desc": "Exposures with original maturity of three months or less denominated and funded in Birr_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00243",
        "row": 66,
        "col": "F",
        "desc": "Exposures with original maturity of three months or less denominated and funded in Birr_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00244",
        "row": 66,
        "col": "G",
        "desc": "Exposures with original maturity of three months or less denominated and funded in Birr_Risk Weight_(D)"
    },
    {
        "code": "168_00245",
        "row": 66,
        "col": "H",
        "desc": "Exposures with original maturity of three months or less denominated and funded in Birr_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00246",
        "row": 67,
        "col": "C",
        "desc": "Exposures to Covered Bonds (=6.1+6.2)_Total Exposure"
    },
    {
        "code": "168_00247",
        "row": 67,
        "col": "E",
        "desc": "Exposures to Covered Bonds (=6.1+6.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00248",
        "row": 67,
        "col": "F",
        "desc": "Exposures to Covered Bonds (=6.1+6.2)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00249",
        "row": 67,
        "col": "G",
        "desc": "Exposures to Covered Bonds (=6.1+6.2)_Risk Weight_(D)"
    },
    {
        "code": "168_00250",
        "row": 67,
        "col": "H",
        "desc": "Exposures to Covered Bonds (=6.1+6.2)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00251",
        "row": 68,
        "col": "C",
        "desc": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Total Exposure"
    },
    {
        "code": "168_00252",
        "row": 68,
        "col": "E",
        "desc": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00253",
        "row": 68,
        "col": "F",
        "desc": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00254",
        "row": 68,
        "col": "G",
        "desc": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Risk Weight_(D)"
    },
    {
        "code": "168_00255",
        "row": 68,
        "col": "H",
        "desc": "Covered bonds that meet criteria to be risk-weighted based on the issue-specific rating or the issuer’s RW (=6.1.1+6.1.2+6.1.3+6.1.4+6.1.5)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00256",
        "row": 69,
        "col": "C",
        "desc": "Credit Assessment of the issue-specific or the issuer’s_AAA to AA-_Total Exposure"
    },
    {
        "code": "168_00257",
        "row": 69,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00258",
        "row": 69,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00259",
        "row": 69,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00260",
        "row": 69,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00261",
        "row": 70,
        "col": "C",
        "desc": "Credit Assessment of the issue-specific or the issuer’s_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00262",
        "row": 70,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00263",
        "row": 70,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00264",
        "row": 70,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00265",
        "row": 70,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00266",
        "row": 71,
        "col": "C",
        "desc": "Credit Assessment of the issue-specific or the issuer’s_BBB+ to BBB-_Total Exposure"
    },
    {
        "code": "168_00267",
        "row": 71,
        "col": "E",
        "desc": "BBB+ to BBB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00268",
        "row": 71,
        "col": "F",
        "desc": "BBB+ to BBB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00269",
        "row": 71,
        "col": "G",
        "desc": "BBB+ to BBB-_Risk Weight_(D)"
    },
    {
        "code": "168_00270",
        "row": 71,
        "col": "H",
        "desc": "BBB+ to BBB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00271",
        "row": 72,
        "col": "C",
        "desc": "Credit Assessment of the issue-specific or the issuer’s_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00272",
        "row": 72,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00273",
        "row": 72,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00274",
        "row": 72,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00275",
        "row": 72,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00276",
        "row": 73,
        "col": "C",
        "desc": "Credit Assessment of the issue-specific or the issuer’s_Below B-"
    },
    {
        "code": "168_00277",
        "row": 73,
        "col": "E",
        "desc": "Below B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00278",
        "row": 73,
        "col": "F",
        "desc": "Below B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00279",
        "row": 73,
        "col": "G",
        "desc": "Below B-_Risk Weight_(D)"
    },
    {
        "code": "168_00280",
        "row": 73,
        "col": "H",
        "desc": "Below B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00281",
        "row": 74,
        "col": "C",
        "desc": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Total Exposure"
    },
    {
        "code": "168_00282",
        "row": 74,
        "col": "E",
        "desc": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00283",
        "row": 74,
        "col": "F",
        "desc": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00284",
        "row": 74,
        "col": "G",
        "desc": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Risk Weight_(D)"
    },
    {
        "code": "168_00285",
        "row": 74,
        "col": "H",
        "desc": "For unrated covered bonds (=6.2.1+6.2.2+6.2.3+6.2.4)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00286",
        "row": 75,
        "col": "C",
        "desc": "Based on the RW of the Issuing bank_20%_Total Exposure"
    },
    {
        "code": "168_00287",
        "row": 75,
        "col": "E",
        "desc": "0.2_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00288",
        "row": 75,
        "col": "F",
        "desc": "0.2_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00289",
        "row": 75,
        "col": "G",
        "desc": "0.2_Risk Weight_(D)"
    },
    {
        "code": "168_00290",
        "row": 75,
        "col": "H",
        "desc": "0.2_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00291",
        "row": 76,
        "col": "C",
        "desc": "Based on the RW of the Issuing bank_50%_Total Exposure"
    },
    {
        "code": "168_00292",
        "row": 76,
        "col": "E",
        "desc": "0.5_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00293",
        "row": 76,
        "col": "F",
        "desc": "0.5_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00294",
        "row": 76,
        "col": "G",
        "desc": "0.5_Risk Weight_(D)"
    },
    {
        "code": "168_00295",
        "row": 76,
        "col": "H",
        "desc": "0.5_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00296",
        "row": 77,
        "col": "C",
        "desc": "Based on the RW of the Issuing bank_100%_Total Exposure"
    },
    {
        "code": "168_00297",
        "row": 77,
        "col": "D",
        "desc": "Based on the RW of the Issuing bank_100%_Credit Risk Grade_(A)"
    },
    {
        "code": "168_00298",
        "row": 77,
        "col": "E",
        "desc": "Based on the RW of the Issuing bank_100%_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00299",
        "row": 77,
        "col": "F",
        "desc": "Based on the RW of the Issuing bank_100%_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00300",
        "row": 77,
        "col": "G",
        "desc": "Based on the RW of the Issuing bank_100%_Risk Weight_(D)"
    },
    {
        "code": "168_00301",
        "row": 77,
        "col": "H",
        "desc": "Based on the RW of the Issuing bank_100%_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00302",
        "row": 78,
        "col": "C",
        "desc": "Based on the RW of the Issuing bank_150%_Total Exposure"
    },
    {
        "code": "168_00303",
        "row": 78,
        "col": "E",
        "desc": "1.5_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00304",
        "row": 78,
        "col": "F",
        "desc": "1.5_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00305",
        "row": 78,
        "col": "G",
        "desc": "1.5_Risk Weight_(D)"
    },
    {
        "code": "168_00306",
        "row": 78,
        "col": "H",
        "desc": "1.5_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00307",
        "row": 79,
        "col": "C",
        "desc": "Exposures to Corporates (=7.1+7.2)_Total Exposure"
    },
    {
        "code": "168_00308",
        "row": 79,
        "col": "E",
        "desc": "Exposures to Corporates (=7.1+7.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00309",
        "row": 79,
        "col": "F",
        "desc": "Exposures to Corporates (=7.1+7.2)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00310",
        "row": 79,
        "col": "G",
        "desc": "Exposures to Corporates (=7.1+7.2)_Risk Weight_(D)"
    },
    {
        "code": "168_00311",
        "row": 79,
        "col": "H",
        "desc": "Exposures to Corporates (=7.1+7.2)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00312",
        "row": 80,
        "col": "C",
        "desc": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Total Exposure"
    },
    {
        "code": "168_00313",
        "row": 80,
        "col": "E",
        "desc": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00314",
        "row": 80,
        "col": "F",
        "desc": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00315",
        "row": 80,
        "col": "G",
        "desc": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Risk Weight_(D)"
    },
    {
        "code": "168_00316",
        "row": 80,
        "col": "H",
        "desc": "Exposure to General Corporates (=7.1.1+7.1.2+7.1.3+7.1.4+7.1.5+7.1.6+7.1.7)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00317",
        "row": 81,
        "col": "C",
        "desc": "External credit rating of corporate_AAA to AA-_Total Exposure"
    },
    {
        "code": "168_00318",
        "row": 81,
        "col": "E",
        "desc": "AAA to AA-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00319",
        "row": 81,
        "col": "F",
        "desc": "AAA to AA-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00320",
        "row": 81,
        "col": "G",
        "desc": "AAA to AA-_Risk Weight_(D)"
    },
    {
        "code": "168_00321",
        "row": 81,
        "col": "H",
        "desc": "AAA to AA-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00322",
        "row": 82,
        "col": "C",
        "desc": "External credit rating of corporate_A+ to A-_Total Exposure"
    },
    {
        "code": "168_00323",
        "row": 82,
        "col": "E",
        "desc": "A+ to A-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00324",
        "row": 82,
        "col": "F",
        "desc": "A+ to A-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00325",
        "row": 82,
        "col": "G",
        "desc": "A+ to A-_Risk Weight_(D)"
    },
    {
        "code": "168_00326",
        "row": 82,
        "col": "H",
        "desc": "A+ to A-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00327",
        "row": 83,
        "col": "C",
        "desc": "External credit rating of corporate_BBB+ to BB-_Total Exposure"
    },
    {
        "code": "168_00328",
        "row": 83,
        "col": "E",
        "desc": "BBB+ to BB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00329",
        "row": 83,
        "col": "F",
        "desc": "BBB+ to BB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00330",
        "row": 83,
        "col": "G",
        "desc": "BBB+ to BB-_Risk Weight_(D)"
    },
    {
        "code": "168_00331",
        "row": 83,
        "col": "H",
        "desc": "BBB+ to BB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00332",
        "row": 84,
        "col": "C",
        "desc": "External credit rating of corporate_BB+ to B-_Total Exposure"
    },
    {
        "code": "168_00333",
        "row": 84,
        "col": "E",
        "desc": "BB+ to B-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00334",
        "row": 84,
        "col": "F",
        "desc": "BB+ to B-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00335",
        "row": 84,
        "col": "G",
        "desc": "BB+ to B-_Risk Weight_(D)"
    },
    {
        "code": "168_00336",
        "row": 84,
        "col": "H",
        "desc": "BB+ to B-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00337",
        "row": 85,
        "col": "C",
        "desc": "External credit rating of corporate_Below BB-_Total Exposure"
    },
    {
        "code": "168_00338",
        "row": 85,
        "col": "E",
        "desc": "Below BB-_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00339",
        "row": 85,
        "col": "F",
        "desc": "Below BB-_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00340",
        "row": 85,
        "col": "G",
        "desc": "Below BB-_Risk Weight_(D)"
    },
    {
        "code": "168_00341",
        "row": 85,
        "col": "H",
        "desc": "Below BB-_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00342",
        "row": 86,
        "col": "C",
        "desc": "External credit rating of corporate_Unrated_Total Exposure"
    },
    {
        "code": "168_00343",
        "row": 86,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00344",
        "row": 86,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00345",
        "row": 86,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00346",
        "row": 86,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00347",
        "row": 87,
        "col": "C",
        "desc": "Exposure to Corporate SMEs_Unrated_Total Exposure"
    },
    {
        "code": "168_00348",
        "row": 87,
        "col": "E",
        "desc": "Unrated_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00349",
        "row": 87,
        "col": "F",
        "desc": "Unrated_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00350",
        "row": 87,
        "col": "G",
        "desc": "Unrated_Risk Weight_(D)"
    },
    {
        "code": "168_00351",
        "row": 87,
        "col": "H",
        "desc": "Unrated_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00352",
        "row": 88,
        "col": "C",
        "desc": "Specialized lending_Total Exposure"
    },
    {
        "code": "168_00353",
        "row": 88,
        "col": "E",
        "desc": "Specialized lending_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00354",
        "row": 88,
        "col": "F",
        "desc": "Specialized lending_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00355",
        "row": 88,
        "col": "G",
        "desc": "Specialized lending_Risk Weight_(D)"
    },
    {
        "code": "168_00356",
        "row": 88,
        "col": "H",
        "desc": "Specialized lending_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00357",
        "row": 89,
        "col": "C",
        "desc": "Project finance pre-operational phase_Total Exposure"
    },
    {
        "code": "168_00358",
        "row": 89,
        "col": "E",
        "desc": "Project finance pre-operational phase_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00359",
        "row": 89,
        "col": "F",
        "desc": "Project finance pre-operational phase_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00360",
        "row": 89,
        "col": "G",
        "desc": "Project finance pre-operational phase_Risk Weight_(D)"
    },
    {
        "code": "168_00361",
        "row": 89,
        "col": "H",
        "desc": "Project finance pre-operational phase_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00362",
        "row": 90,
        "col": "C",
        "desc": "Project finance operational phase_Total Exposure"
    },
    {
        "code": "168_00363",
        "row": 90,
        "col": "E",
        "desc": "Project finance operational phase_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00364",
        "row": 90,
        "col": "F",
        "desc": "Project finance operational phase_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00365",
        "row": 90,
        "col": "G",
        "desc": "Project finance operational phase_Risk Weight_(D)"
    },
    {
        "code": "168_00366",
        "row": 90,
        "col": "H",
        "desc": "Project finance operational phase_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00367",
        "row": 91,
        "col": "C",
        "desc": "Project finance operational phase (high quality)_Total Exposure"
    },
    {
        "code": "168_00368",
        "row": 91,
        "col": "E",
        "desc": "Project finance operational phase (high quality)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00369",
        "row": 91,
        "col": "F",
        "desc": "Project finance operational phase (high quality)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00370",
        "row": 91,
        "col": "G",
        "desc": "Project finance operational phase (high quality)_Risk Weight_(D)"
    },
    {
        "code": "168_00371",
        "row": 91,
        "col": "H",
        "desc": "Project finance operational phase (high quality)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00372",
        "row": 92,
        "col": "C",
        "desc": "Object finance and commodity finance_Total Exposure"
    },
    {
        "code": "168_00373",
        "row": 92,
        "col": "E",
        "desc": "Object finance and commodity finance_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00374",
        "row": 92,
        "col": "F",
        "desc": "Object finance and commodity finance_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00375",
        "row": 92,
        "col": "G",
        "desc": "Object finance and commodity finance_Risk Weight_(D)"
    },
    {
        "code": "168_00376",
        "row": 92,
        "col": "H",
        "desc": "Object finance and commodity finance_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00377",
        "row": 93,
        "col": "C",
        "desc": "Retail Exposures (individuals or small business) (=8.1+8.2)_Total Exposure"
    },
    {
        "code": "168_00378",
        "row": 93,
        "col": "E",
        "desc": "Retail Exposures (individuals or small business) (=8.1+8.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00379",
        "row": 93,
        "col": "F",
        "desc": "Retail Exposures (individuals or small business) (=8.1+8.2)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00380",
        "row": 93,
        "col": "G",
        "desc": "Retail Exposures (individuals or small business) (=8.1+8.2)_Risk Weight_(D)"
    },
    {
        "code": "168_00381",
        "row": 93,
        "col": "H",
        "desc": "Retail Exposures (individuals or small business) (=8.1+8.2)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00382",
        "row": 94,
        "col": "C",
        "desc": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Total Exposure"
    },
    {
        "code": "168_00383",
        "row": 94,
        "col": "E",
        "desc": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00384",
        "row": 94,
        "col": "F",
        "desc": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00385",
        "row": 94,
        "col": "G",
        "desc": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Risk Weight_(D)"
    },
    {
        "code": "168_00386",
        "row": 94,
        "col": "H",
        "desc": "Exposures that meet the criteria for inclusion in the Regulatory Retail Portfolio (=8.1.1+8.1.2+8.1.3)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00387",
        "row": 95,
        "col": "C",
        "desc": "Revolving credits & lines of credit (including credit cards and overdrafts)_Total Exposure"
    },
    {
        "code": "168_00388",
        "row": 95,
        "col": "E",
        "desc": "Revolving credits & lines of credit (including credit cards and overdrafts)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00389",
        "row": 95,
        "col": "F",
        "desc": "Revolving credits & lines of credit (including credit cards and overdrafts)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00390",
        "row": 95,
        "col": "G",
        "desc": "Revolving credits & lines of credit (including credit cards and overdrafts)_Risk Weight_(D)"
    },
    {
        "code": "168_00391",
        "row": 95,
        "col": "H",
        "desc": "Revolving credits & lines of credit (including credit cards and overdrafts)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00392",
        "row": 96,
        "col": "C",
        "desc": "Personal term loans and leases_Total Exposure"
    },
    {
        "code": "168_00393",
        "row": 96,
        "col": "E",
        "desc": "Personal term loans and leases_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00394",
        "row": 96,
        "col": "F",
        "desc": "Personal term loans and leases_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00395",
        "row": 96,
        "col": "G",
        "desc": "Personal term loans and leases_Risk Weight_(D)"
    },
    {
        "code": "168_00396",
        "row": 96,
        "col": "H",
        "desc": "Personal term loans and leases_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00397",
        "row": 97,
        "col": "C",
        "desc": "Small business facilities and commitments_Total Exposure"
    },
    {
        "code": "168_00398",
        "row": 97,
        "col": "E",
        "desc": "Small business facilities and commitments_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00399",
        "row": 97,
        "col": "F",
        "desc": "Small business facilities and commitments_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00400",
        "row": 97,
        "col": "G",
        "desc": "Small business facilities and commitments_Risk Weight_(D)"
    },
    {
        "code": "168_00401",
        "row": 97,
        "col": "H",
        "desc": "Small business facilities and commitments_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00402",
        "row": 98,
        "col": "C",
        "desc": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Total Exposure"
    },
    {
        "code": "168_00403",
        "row": 98,
        "col": "E",
        "desc": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00404",
        "row": 98,
        "col": "F",
        "desc": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00405",
        "row": 98,
        "col": "G",
        "desc": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Risk Weight_(D)"
    },
    {
        "code": "168_00406",
        "row": 98,
        "col": "H",
        "desc": "Other Retail exposures that do not meet criteria for Inclusion Regulatory Retail Portfolio_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00407",
        "row": 99,
        "col": "C",
        "desc": "Real estate exposures (performing) (=9.1+9.2)_Total Exposure"
    },
    {
        "code": "168_00408",
        "row": 99,
        "col": "E",
        "desc": "Real estate exposures (performing) (=9.1+9.2)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00409",
        "row": 99,
        "col": "F",
        "desc": "Real estate exposures (performing) (=9.1+9.2)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00410",
        "row": 99,
        "col": "G",
        "desc": "Real estate exposures (performing) (=9.1+9.2)_Risk Weight_(D)"
    },
    {
        "code": "168_00411",
        "row": 99,
        "col": "H",
        "desc": "Real estate exposures (performing) (=9.1+9.2)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00412",
        "row": 100,
        "col": "C",
        "desc": "Exposure to Residential Real estate occupied by the owner or rented not past due_Total Exposure"
    },
    {
        "code": "168_00413",
        "row": 100,
        "col": "E",
        "desc": "Exposure to Residential Real estate occupied by the owner or rented not past due_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00414",
        "row": 100,
        "col": "F",
        "desc": "Exposure to Residential Real estate occupied by the owner or rented not past due_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00415",
        "row": 100,
        "col": "G",
        "desc": "Exposure to Residential Real estate occupied by the owner or rented not past due_Risk Weight_(D)"
    },
    {
        "code": "168_00416",
        "row": 100,
        "col": "H",
        "desc": "Exposure to Residential Real estate occupied by the owner or rented not past due_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00417",
        "row": 101,
        "col": "C",
        "desc": "Exposure to Commercial real estates_Total Exposure"
    },
    {
        "code": "168_00418",
        "row": 101,
        "col": "E",
        "desc": "Exposure to Commercial real estates_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00419",
        "row": 101,
        "col": "F",
        "desc": "Exposure to Commercial real estates_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00420",
        "row": 101,
        "col": "G",
        "desc": "Exposure to Commercial real estates_Risk Weight_(D)"
    },
    {
        "code": "168_00421",
        "row": 101,
        "col": "H",
        "desc": "Exposure to Commercial real estates_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00422",
        "row": 102,
        "col": "C",
        "desc": "Defaulted Exposure (=10.1+10.2+10.3)_Total Exposure"
    },
    {
        "code": "168_00423",
        "row": 102,
        "col": "E",
        "desc": "Defaulted Exposure (=10.1+10.2+10.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00424",
        "row": 102,
        "col": "F",
        "desc": "Defaulted Exposure (=10.1+10.2+10.3)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00425",
        "row": 102,
        "col": "G",
        "desc": "Defaulted Exposure (=10.1+10.2+10.3)_Risk Weight_(D)"
    },
    {
        "code": "168_00426",
        "row": 102,
        "col": "H",
        "desc": "Defaulted Exposure (=10.1+10.2+10.3)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00427",
        "row": 103,
        "col": "C",
        "desc": "Unsecured portion, where specific provisions => 20%_Total Exposure"
    },
    {
        "code": "168_00428",
        "row": 103,
        "col": "E",
        "desc": "Unsecured portion, where specific provisions => 20%_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00429",
        "row": 103,
        "col": "F",
        "desc": "Unsecured portion, where specific provisions => 20%_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00430",
        "row": 103,
        "col": "G",
        "desc": "Unsecured portion, where specific provisions => 20%_Risk Weight_(D)"
    },
    {
        "code": "168_00431",
        "row": 103,
        "col": "H",
        "desc": "Unsecured portion, where specific provisions => 20%_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00432",
        "row": 104,
        "col": "C",
        "desc": "Unsecured portion, where specific provisions < 20%_Total Exposure"
    },
    {
        "code": "168_00433",
        "row": 104,
        "col": "E",
        "desc": "Unsecured portion, where specific provisions < 20%_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00434",
        "row": 104,
        "col": "F",
        "desc": "Unsecured portion, where specific provisions < 20%_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00435",
        "row": 104,
        "col": "G",
        "desc": "Unsecured portion, where specific provisions < 20%_Risk Weight_(D)"
    },
    {
        "code": "168_00436",
        "row": 104,
        "col": "H",
        "desc": "Unsecured portion, where specific provisions < 20%_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00437",
        "row": 105,
        "col": "C",
        "desc": "Residential real estate exposures_Total Exposure"
    },
    {
        "code": "168_00438",
        "row": 105,
        "col": "E",
        "desc": "Residential real estate exposures_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00439",
        "row": 105,
        "col": "F",
        "desc": "Residential real estate exposures_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00440",
        "row": 105,
        "col": "G",
        "desc": "Residential real estate exposures_Risk Weight_(D)"
    },
    {
        "code": "168_00441",
        "row": 105,
        "col": "H",
        "desc": "Residential real estate exposures_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00442",
        "row": 106,
        "col": "C",
        "desc": "Other exposures (=11.1+11.2+11.3)_Total Exposure"
    },
    {
        "code": "168_00443",
        "row": 106,
        "col": "E",
        "desc": "Other exposures (=11.1+11.2+11.3)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00444",
        "row": 106,
        "col": "F",
        "desc": "Other exposures (=11.1+11.2+11.3)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00445",
        "row": 106,
        "col": "G",
        "desc": "Other exposures (=11.1+11.2+11.3)_Risk Weight_(D)"
    },
    {
        "code": "168_00446",
        "row": 106,
        "col": "H",
        "desc": "Other exposures (=11.1+11.2+11.3)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00447",
        "row": 107,
        "col": "C",
        "desc": "Fixed Assets_Total Exposure"
    },
    {
        "code": "168_00448",
        "row": 107,
        "col": "E",
        "desc": "Fixed Assets_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00449",
        "row": 107,
        "col": "F",
        "desc": "Fixed Assets_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00450",
        "row": 107,
        "col": "G",
        "desc": "Fixed Assets_Risk Weight_(D)"
    },
    {
        "code": "168_00451",
        "row": 107,
        "col": "H",
        "desc": "Fixed Assets_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00452",
        "row": 108,
        "col": "C",
        "desc": "Investment that are not deducted from Capital_Total Exposure"
    },
    {
        "code": "168_00453",
        "row": 108,
        "col": "E",
        "desc": "Investment that are not deducted from Capital_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00454",
        "row": 108,
        "col": "F",
        "desc": "Investment that are not deducted from Capital_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00455",
        "row": 108,
        "col": "G",
        "desc": "Investment that are not deducted from Capital_Risk Weight_(D)"
    },
    {
        "code": "168_00456",
        "row": 108,
        "col": "H",
        "desc": "Investment that are not deducted from Capital_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00457",
        "row": 109,
        "col": "C",
        "desc": "Others_Total Exposure"
    },
    {
        "code": "168_00458",
        "row": 109,
        "col": "E",
        "desc": "Others_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00459",
        "row": 109,
        "col": "F",
        "desc": "Others_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00460",
        "row": 109,
        "col": "G",
        "desc": "Others_Risk Weight_(D)"
    },
    {
        "code": "168_00461",
        "row": 109,
        "col": "H",
        "desc": "Others_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00462",
        "row": 110,
        "col": "C",
        "desc": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Total Exposure"
    },
    {
        "code": "168_00463",
        "row": 110,
        "col": "E",
        "desc": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00464",
        "row": 110,
        "col": "F",
        "desc": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00465",
        "row": 110,
        "col": "G",
        "desc": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Risk Weight_(D)"
    },
    {
        "code": "168_00466",
        "row": 110,
        "col": "H",
        "desc": "Total On Balance Sheet Credit Risk RWA (= Sum of 1 up to 11)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00467",
        "row": 111,
        "col": "C",
        "desc": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Total Exposure"
    },
    {
        "code": "168_00468",
        "row": 111,
        "col": "E",
        "desc": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Exposure without Credit Risk Mitigation (CRM)*_(B)"
    },
    {
        "code": "168_00469",
        "row": 111,
        "col": "F",
        "desc": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Exposures with CRM coverage**_(C)"
    },
    {
        "code": "168_00470",
        "row": 111,
        "col": "G",
        "desc": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Risk Weight_(D)"
    },
    {
        "code": "168_00471",
        "row": 111,
        "col": "H",
        "desc": "Total On Balance Sheet Credit Risk Capital (=12*11%)_Risk Weighted Assets_E=(B+C)* D/100"
    },
    {
        "code": "168_00472",
        "row": 240,
        "col": "C",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Add-On (A)"
    },
    {
        "code": "168_00473",
        "row": 240,
        "col": "D",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00474",
        "row": 240,
        "col": "E",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00475",
        "row": 240,
        "col": "F",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00476",
        "row": 240,
        "col": "G",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00477",
        "row": 240,
        "col": "H",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00478",
        "row": 240,
        "col": "I",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00479",
        "row": 240,
        "col": "J",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00480",
        "row": 240,
        "col": "K",
        "desc": "Interest Rate Related Contracts (=1.1+1.2+1.3)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00481",
        "row": 241,
        "col": "C",
        "desc": "Residual maturity 1 year or less_Add-On (A)"
    },
    {
        "code": "168_00482",
        "row": 241,
        "col": "D",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00483",
        "row": 241,
        "col": "E",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00484",
        "row": 241,
        "col": "F",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00485",
        "row": 241,
        "col": "G",
        "desc": "Residual maturity 1 year or less_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00486",
        "row": 241,
        "col": "H",
        "desc": "Residual maturity 1 year or less_Notional Principal amounts (F)"
    },
    {
        "code": "168_00487",
        "row": 241,
        "col": "I",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00488",
        "row": 241,
        "col": "J",
        "desc": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00489",
        "row": 241,
        "col": "K",
        "desc": "Residual maturity 1 year or less_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00490",
        "row": 242,
        "col": "C",
        "desc": "Residual maturity > 1 year to 5 years_Add-On (A)"
    },
    {
        "code": "168_00491",
        "row": 243,
        "col": "C",
        "desc": "Residual maturity > 5 years_Add-On (A)"
    },
    {
        "code": "168_00492",
        "row": 243,
        "col": "D",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00493",
        "row": 243,
        "col": "E",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00494",
        "row": 243,
        "col": "F",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00495",
        "row": 243,
        "col": "G",
        "desc": "Residual maturity > 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00496",
        "row": 243,
        "col": "H",
        "desc": "Residual maturity > 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00497",
        "row": 243,
        "col": "I",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00498",
        "row": 243,
        "col": "J",
        "desc": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00499",
        "row": 243,
        "col": "K",
        "desc": "Residual maturity > 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00500",
        "row": 244,
        "col": "C",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Add-On (A)"
    },
    {
        "code": "168_00501",
        "row": 244,
        "col": "D",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00502",
        "row": 244,
        "col": "E",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00503",
        "row": 244,
        "col": "F",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00504",
        "row": 244,
        "col": "G",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00505",
        "row": 244,
        "col": "H",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00506",
        "row": 244,
        "col": "I",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00507",
        "row": 244,
        "col": "J",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00508",
        "row": 244,
        "col": "K",
        "desc": "Foreign Exchange & Gold Contracts (=2.1+2.2+2.3)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00509",
        "row": 245,
        "col": "C",
        "desc": "Residual maturity 1 year or less_Add-On (A)"
    },
    {
        "code": "168_00510",
        "row": 245,
        "col": "D",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00511",
        "row": 245,
        "col": "E",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00512",
        "row": 245,
        "col": "F",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00513",
        "row": 245,
        "col": "G",
        "desc": "Residual maturity 1 year or less_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00514",
        "row": 245,
        "col": "H",
        "desc": "Residual maturity 1 year or less_Notional Principal amounts (F)"
    },
    {
        "code": "168_00515",
        "row": 245,
        "col": "I",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00516",
        "row": 245,
        "col": "J",
        "desc": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00517",
        "row": 245,
        "col": "K",
        "desc": "Residual maturity 1 year or less_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00518",
        "row": 246,
        "col": "C",
        "desc": "Residual maturity > 1 year to 5 years_Add-On (A)"
    },
    {
        "code": "168_00519",
        "row": 246,
        "col": "D",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00520",
        "row": 246,
        "col": "E",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00521",
        "row": 246,
        "col": "F",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00522",
        "row": 246,
        "col": "G",
        "desc": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00523",
        "row": 246,
        "col": "H",
        "desc": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00524",
        "row": 246,
        "col": "I",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00525",
        "row": 246,
        "col": "J",
        "desc": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00526",
        "row": 246,
        "col": "K",
        "desc": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00527",
        "row": 247,
        "col": "C",
        "desc": "Residual maturity > 5 years_Add-On (A)"
    },
    {
        "code": "168_00528",
        "row": 247,
        "col": "D",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00529",
        "row": 247,
        "col": "E",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00530",
        "row": 247,
        "col": "F",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00531",
        "row": 247,
        "col": "G",
        "desc": "Residual maturity > 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00532",
        "row": 247,
        "col": "H",
        "desc": "Residual maturity > 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00533",
        "row": 247,
        "col": "I",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00534",
        "row": 247,
        "col": "J",
        "desc": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00535",
        "row": 247,
        "col": "K",
        "desc": "Residual maturity > 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00536",
        "row": 248,
        "col": "C",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Add-On (A)"
    },
    {
        "code": "168_00537",
        "row": 248,
        "col": "D",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00538",
        "row": 248,
        "col": "E",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00539",
        "row": 248,
        "col": "F",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00540",
        "row": 248,
        "col": "G",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00541",
        "row": 248,
        "col": "H",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00542",
        "row": 248,
        "col": "I",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00543",
        "row": 248,
        "col": "J",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00544",
        "row": 248,
        "col": "K",
        "desc": "Equity Contracts (=3.1+3.2+3.3)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00545",
        "row": 249,
        "col": "C",
        "desc": "Residual maturity 1 year or less_Add-On (A)"
    },
    {
        "code": "168_00546",
        "row": 249,
        "col": "D",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00547",
        "row": 249,
        "col": "E",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00548",
        "row": 249,
        "col": "F",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00549",
        "row": 249,
        "col": "G",
        "desc": "Residual maturity 1 year or less_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00550",
        "row": 249,
        "col": "H",
        "desc": "Residual maturity 1 year or less_Notional Principal amounts (F)"
    },
    {
        "code": "168_00551",
        "row": 249,
        "col": "I",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00552",
        "row": 249,
        "col": "J",
        "desc": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00553",
        "row": 249,
        "col": "K",
        "desc": "Residual maturity 1 year or less_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00554",
        "row": 250,
        "col": "C",
        "desc": "Residual maturity > 1 year to 5 years_Add-On (A)"
    },
    {
        "code": "168_00555",
        "row": 250,
        "col": "D",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00556",
        "row": 250,
        "col": "E",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00557",
        "row": 250,
        "col": "F",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00558",
        "row": 250,
        "col": "G",
        "desc": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00559",
        "row": 250,
        "col": "H",
        "desc": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00560",
        "row": 250,
        "col": "I",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00561",
        "row": 250,
        "col": "J",
        "desc": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00562",
        "row": 250,
        "col": "K",
        "desc": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00563",
        "row": 251,
        "col": "C",
        "desc": "Residual maturity > 5 years_Add-On (A)"
    },
    {
        "code": "168_00564",
        "row": 251,
        "col": "D",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00565",
        "row": 251,
        "col": "E",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00566",
        "row": 251,
        "col": "F",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00567",
        "row": 251,
        "col": "G",
        "desc": "Residual maturity > 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00568",
        "row": 251,
        "col": "H",
        "desc": "Residual maturity > 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00569",
        "row": 251,
        "col": "I",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00570",
        "row": 251,
        "col": "J",
        "desc": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00571",
        "row": 251,
        "col": "K",
        "desc": "Residual maturity > 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00572",
        "row": 252,
        "col": "C",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Add-On (A)"
    },
    {
        "code": "168_00573",
        "row": 252,
        "col": "D",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00574",
        "row": 252,
        "col": "E",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00575",
        "row": 252,
        "col": "F",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00576",
        "row": 252,
        "col": "G",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00577",
        "row": 252,
        "col": "H",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00578",
        "row": 252,
        "col": "I",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00579",
        "row": 252,
        "col": "J",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00580",
        "row": 252,
        "col": "K",
        "desc": "Precious Metal Contracts (Other Than Gold) (=4.1+4.2+4.3)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00581",
        "row": 253,
        "col": "C",
        "desc": "Residual maturity 1 year or less_Add-On (A)"
    },
    {
        "code": "168_00582",
        "row": 253,
        "col": "D",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00583",
        "row": 253,
        "col": "E",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00584",
        "row": 253,
        "col": "F",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00585",
        "row": 253,
        "col": "G",
        "desc": "Residual maturity 1 year or less_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00586",
        "row": 253,
        "col": "H",
        "desc": "Residual maturity 1 year or less_Notional Principal amounts (F)"
    },
    {
        "code": "168_00587",
        "row": 253,
        "col": "I",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00588",
        "row": 253,
        "col": "J",
        "desc": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00589",
        "row": 253,
        "col": "K",
        "desc": "Residual maturity 1 year or less_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00590",
        "row": 254,
        "col": "C",
        "desc": "Residual maturity > 1 year to 5 years_Add-On (A)"
    },
    {
        "code": "168_00591",
        "row": 254,
        "col": "D",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00592",
        "row": 254,
        "col": "E",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00593",
        "row": 254,
        "col": "F",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00594",
        "row": 254,
        "col": "G",
        "desc": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00595",
        "row": 254,
        "col": "H",
        "desc": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00596",
        "row": 254,
        "col": "I",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00597",
        "row": 254,
        "col": "J",
        "desc": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00598",
        "row": 254,
        "col": "K",
        "desc": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00599",
        "row": 255,
        "col": "C",
        "desc": "Residual maturity > 5 years_Add-On (A)"
    },
    {
        "code": "168_00600",
        "row": 255,
        "col": "D",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00601",
        "row": 255,
        "col": "E",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00602",
        "row": 255,
        "col": "F",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00603",
        "row": 255,
        "col": "G",
        "desc": "Residual maturity > 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00604",
        "row": 255,
        "col": "H",
        "desc": "Residual maturity > 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00605",
        "row": 255,
        "col": "I",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00606",
        "row": 255,
        "col": "J",
        "desc": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00607",
        "row": 255,
        "col": "K",
        "desc": "Residual maturity > 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00608",
        "row": 256,
        "col": "C",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Add-On (A)"
    },
    {
        "code": "168_00609",
        "row": 256,
        "col": "D",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00610",
        "row": 256,
        "col": "E",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00611",
        "row": 256,
        "col": "F",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00612",
        "row": 256,
        "col": "G",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00613",
        "row": 256,
        "col": "H",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00614",
        "row": 256,
        "col": "I",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00615",
        "row": 256,
        "col": "J",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00616",
        "row": 256,
        "col": "K",
        "desc": "Other Commodities Contracts (Other Than Precious Metals) (=5.1+5.2+5.3)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00617",
        "row": 257,
        "col": "C",
        "desc": "Residual maturity 1 year or less_Add-On (A)"
    },
    {
        "code": "168_00618",
        "row": 257,
        "col": "D",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00619",
        "row": 257,
        "col": "E",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00620",
        "row": 257,
        "col": "F",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00621",
        "row": 257,
        "col": "G",
        "desc": "Residual maturity 1 year or less_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00622",
        "row": 257,
        "col": "H",
        "desc": "Residual maturity 1 year or less_Notional Principal amounts (F)"
    },
    {
        "code": "168_00623",
        "row": 257,
        "col": "I",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00624",
        "row": 257,
        "col": "J",
        "desc": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00625",
        "row": 257,
        "col": "K",
        "desc": "Residual maturity 1 year or less_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00626",
        "row": 258,
        "col": "C",
        "desc": "Residual maturity > 1 year to 5 years_Add-On (A)"
    },
    {
        "code": "168_00627",
        "row": 258,
        "col": "D",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00628",
        "row": 258,
        "col": "E",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00629",
        "row": 258,
        "col": "F",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00630",
        "row": 258,
        "col": "G",
        "desc": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00631",
        "row": 258,
        "col": "H",
        "desc": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00632",
        "row": 258,
        "col": "I",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00633",
        "row": 258,
        "col": "J",
        "desc": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00634",
        "row": 258,
        "col": "K",
        "desc": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00635",
        "row": 259,
        "col": "C",
        "desc": "Residual maturity > 5 years_Add-On (A)"
    },
    {
        "code": "168_00636",
        "row": 259,
        "col": "D",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00637",
        "row": 259,
        "col": "E",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00638",
        "row": 259,
        "col": "F",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00639",
        "row": 259,
        "col": "G",
        "desc": "Residual maturity > 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00640",
        "row": 259,
        "col": "H",
        "desc": "Residual maturity > 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00641",
        "row": 259,
        "col": "I",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00642",
        "row": 259,
        "col": "J",
        "desc": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00643",
        "row": 259,
        "col": "K",
        "desc": "Residual maturity > 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00644",
        "row": 260,
        "col": "C",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Add-On (A)"
    },
    {
        "code": "168_00645",
        "row": 260,
        "col": "D",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00646",
        "row": 260,
        "col": "E",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00647",
        "row": 260,
        "col": "F",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00648",
        "row": 260,
        "col": "G",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00649",
        "row": 260,
        "col": "H",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00650",
        "row": 260,
        "col": "I",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00651",
        "row": 260,
        "col": "J",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00652",
        "row": 260,
        "col": "K",
        "desc": "Other Market Related Contracts (=6.1+6.2+6.3)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00653",
        "row": 261,
        "col": "C",
        "desc": "Residual maturity 1 year or less_Add-On (A)"
    },
    {
        "code": "168_00654",
        "row": 261,
        "col": "D",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00655",
        "row": 261,
        "col": "E",
        "desc": "Residual maturity 1 year or less_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00656",
        "row": 261,
        "col": "F",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00657",
        "row": 261,
        "col": "G",
        "desc": "Residual maturity 1 year or less_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00658",
        "row": 261,
        "col": "H",
        "desc": "Residual maturity 1 year or less_Notional Principal amounts (F)"
    },
    {
        "code": "168_00659",
        "row": 261,
        "col": "I",
        "desc": "Residual maturity 1 year or less_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00660",
        "row": 261,
        "col": "J",
        "desc": "Residual maturity 1 year or less_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00661",
        "row": 261,
        "col": "K",
        "desc": "Residual maturity 1 year or less_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00662",
        "row": 262,
        "col": "C",
        "desc": "Residual maturity > 1 year to 5 years_Add-On (A)"
    },
    {
        "code": "168_00663",
        "row": 262,
        "col": "D",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00664",
        "row": 262,
        "col": "E",
        "desc": "Residual maturity > 1 year to 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00665",
        "row": 262,
        "col": "F",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00666",
        "row": 262,
        "col": "G",
        "desc": "Residual maturity > 1 year to 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00667",
        "row": 262,
        "col": "H",
        "desc": "Residual maturity > 1 year to 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00668",
        "row": 262,
        "col": "I",
        "desc": "Residual maturity > 1 year to 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00669",
        "row": 262,
        "col": "J",
        "desc": "Residual maturity > 1 year to 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00670",
        "row": 262,
        "col": "K",
        "desc": "Residual maturity > 1 year to 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00671",
        "row": 263,
        "col": "C",
        "desc": "Residual maturity > 5 years_Add-On (A)"
    },
    {
        "code": "168_00672",
        "row": 263,
        "col": "D",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00673",
        "row": 263,
        "col": "E",
        "desc": "Residual maturity > 5 years_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00674",
        "row": 263,
        "col": "F",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00675",
        "row": 263,
        "col": "G",
        "desc": "Residual maturity > 5 years_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00676",
        "row": 263,
        "col": "H",
        "desc": "Residual maturity > 5 years_Notional Principal amounts (F)"
    },
    {
        "code": "168_00677",
        "row": 263,
        "col": "I",
        "desc": "Residual maturity > 5 years_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00678",
        "row": 263,
        "col": "J",
        "desc": "Residual maturity > 5 years_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00679",
        "row": 263,
        "col": "K",
        "desc": "Residual maturity > 5 years_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00680",
        "row": 264,
        "col": "C",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Add-On (A)"
    },
    {
        "code": "168_00681",
        "row": 264,
        "col": "D",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00682",
        "row": 264,
        "col": "E",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00683",
        "row": 264,
        "col": "F",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00684",
        "row": 264,
        "col": "G",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00685",
        "row": 264,
        "col": "H",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00686",
        "row": 264,
        "col": "I",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00687",
        "row": 264,
        "col": "J",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00688",
        "row": 264,
        "col": "K",
        "desc": "Total Off Balance Sheet OTC Derivatives Credit Risk Weighted Assets (= Sum of 1 up to 6)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00689",
        "row": 265,
        "col": "C",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Add-On (A)"
    },
    {
        "code": "168_00690",
        "row": 265,
        "col": "D",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Exposures without CRM_Replacement cost of contracts (B)"
    },
    {
        "code": "168_00691",
        "row": 265,
        "col": "E",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Exposures without CRM_Notional Principal amounts (C)"
    },
    {
        "code": "168_00692",
        "row": 265,
        "col": "F",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Credit equivalent exposure D=B+(C*A)/100"
    },
    {
        "code": "168_00693",
        "row": 265,
        "col": "G",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Replacement cost of contracts (E)"
    },
    {
        "code": "168_00694",
        "row": 265,
        "col": "H",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Notional Principal amounts (F)"
    },
    {
        "code": "168_00695",
        "row": 265,
        "col": "I",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_Credit equivalent exposure pre-CRM G=E+(F*A)/100"
    },
    {
        "code": "168_00696",
        "row": 265,
        "col": "J",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_RW of Counterparty or Guarantee (H)"
    },
    {
        "code": "168_00697",
        "row": 265,
        "col": "K",
        "desc": "Total Required Capital For Off-balance sheet (Derivative) assets (=7*11%)_RWA             I=(D+G)*H"
    },
    {
        "code": "168_00698",
        "row": 291,
        "col": "C",
        "desc": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_C = Collateral (B)"
    },
    {
        "code": "168_00699",
        "row": 291,
        "col": "D",
        "desc": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_HFX = 0.08, if C and E in different currencies, else 0 (C)"
    },
    {
        "code": "168_00700",
        "row": 291,
        "col": "E",
        "desc": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_RW of the counterparty (D)"
    },
    {
        "code": "168_00701",
        "row": 291,
        "col": "F",
        "desc": "Total Off Balance Sheet SFT Credit Risk RWA (Sum SFT 1 up to SFT 11…)_RWA E=Max {0;1.15*A –(0.85 -C)*B}*D"
    },
    {
        "code": "168_00702",
        "row": 292,
        "col": "C",
        "desc": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_C = Collateral (B)"
    },
    {
        "code": "168_00703",
        "row": 292,
        "col": "D",
        "desc": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_HFX = 0.08, if C and E in different currencies, else 0 (C)"
    },
    {
        "code": "168_00704",
        "row": 292,
        "col": "E",
        "desc": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_RW of the counterparty (D)"
    },
    {
        "code": "168_00705",
        "row": 292,
        "col": "F",
        "desc": "Total Off Balance Sheet SFT Credit Risk Capital (=1*11%)_RWA E=Max {0;1.15*A –(0.85 -C)*B}*D"
    },
    {
        "code": "168_00706",
        "row": 297,
        "col": "C",
        "desc": "Total Risk Weighted Assets for Credit Risk (=B+C)"
    },
    {
        "code": "168_00707",
        "row": 298,
        "col": "C",
        "desc": "TOTAL On-balance Sheet Credit Risk RWA"
    },
    {
        "code": "168_00708",
        "row": 299,
        "col": "C",
        "desc": "TOTAL Off-balance Sheet Credit Risk RWA (=C.1+C.2+C.3)"
    },
    {
        "code": "168_00709",
        "row": 300,
        "col": "C",
        "desc": "Total Off-balance Sheet (Non-Derivatives and SFT)"
    },
    {
        "code": "168_00710",
        "row": 301,
        "col": "C",
        "desc": "Total Off-balance Sheet OTC Derivatives Credit RWA"
    },
    {
        "code": "168_00711",
        "row": 302,
        "col": "C",
        "desc": "Total Off-balance Sheet SFT Credit Risk RWA"
    },
    {
        "code": "168_00712",
        "row": 303,
        "col": "C",
        "desc": "Total Capital For Credit Risk (=E+F)"
    },
    {
        "code": "168_00713",
        "row": 304,
        "col": "C",
        "desc": "Total On-balance Sheet Credit Risk Capital (=B*11%)"
    },
    {
        "code": "168_00714",
        "row": 305,
        "col": "C",
        "desc": "Total Off-balance Sheet Credit Risk Capital (=C*11%)"
    },
    {
        "code": "168_00715",
        "row": 122,
        "col": "I",
        "desc": "Commitments that are unconditionally cancellable at any time by the bank without prior notice, or that effectively provide for automatic cancellation due to deterioration in a borrower’s creditworthiness (e.g. loan commitment) shall be applied CCF of 10% (=Sum of 1.1 up to 1.10)"
    },
    {
        "code": "168_00716",
        "row": 133,
        "col": "I",
        "desc": "Applies to both the issuing and confirming banks of short-term self-liquidating trade letters of credit arising from the movement of goods (e.g. documentary credits collateralized by the underlying shipment, letter of credit, except standby letter of credit) shall be applied CCF of 20% (=Sum of 2.1 up to 2.10)"
    },
    {
        "code": "168_00717",
        "row": 144,
        "col": "I",
        "desc": "Commitments, regardless of the maturity of the underlying facility, unless they qualify for a lower CCF, shall be applied CCF of 40% (=Sum of 3.1 up to 3.10)"
    },
    {
        "code": "168_00718",
        "row": 155,
        "col": "I",
        "desc": "Certain transaction-related contingent items including performance bonds, bid bonds, warranties and standby letters of credit related to particular transactions, shall be applied CCF of 50%. (=Sum of 4.1 up to 4.10)"
    },
    {
        "code": "168_00719",
        "row": 166,
        "col": "I",
        "desc": "Note issuance facilities (NIFs) and revolving underwriting facilities (RUFs) regardless of the maturity of the underlying facility, shall be applied CCF of 50 %. ( =Sum of 5.1 up to 5.10)."
    },
    {
        "code": "168_00720",
        "row": 177,
        "col": "I",
        "desc": "Direct credit substitutes, e.g. general guarantees of indebtedness (including standby letters of credit serving as financial guarantees for loans and securities) and acceptances (including endorsements with the character of acceptances), shall be applied CCF of 100% (=Sum of 6.1 up to 6.10)."
    },
    {
        "code": "168_00721",
        "row": 188,
        "col": "I",
        "desc": "Sale and repurchase agreements and asset sales with recourse where the credit risk remains with the bank, shall be applied CCF of 100% (=Sum of 7.1 up to 7.10)"
    },
    {
        "code": "168_00722",
        "row": 199,
        "col": "I",
        "desc": "Lending of banks’ securities or the posting of securities as collateral by banks, including instances where these arise out of repo-style transactions (i.e. repurchase/reverse repurchase and securities lending/securities borrowing transactions), shall be applied CCF of 100% (=Sum of 8.1 up to 8.10)"
    },
    {
        "code": "168_00723",
        "row": 210,
        "col": "I",
        "desc": "Forward asset purchases, forward deposits and partly paid shares and securities which represent commitments with certain drawdown and shall be weighted according to the type of asset and not accordingly to the type of counterparty with whom the transaction has been entered into, shall be applied CCF of 100% (=Sum of 9.1 up to 9.10)."
    },
    {
        "code": "168_00724",
        "row": 221,
        "col": "I",
        "desc": "Off-balance sheet items that are credit substitutes not explicitly included in any other category, shall be applied CCF of 100% (=Sum of 10.1 up to 10.10)."
    },
    {
        "code": "168_00725",
        "row": 232,
        "col": "I",
        "desc": "Total Off-Balance Sheet (Non-Derivatives and SFT) Credit RWA (=Sum of 1 up to 10 )"
    },
    {
        "code": "168_00726",
        "row": 233,
        "col": "I",
        "desc": "Total Off-Balance Sheet (Non-Market) Credit Risk CAPITAL (=11*11%)"
    }
];

export interface DynamicSubItem {
    Code: string;
    Value: string;
    _description: string;
    _dataType: string;
    _required: boolean;
}

export interface DynamicAreaEntry {
    Area: number;
    _areaName: string;
    DynamicItems: DynamicSubItem[];
}

export interface C2001JsonData {
    ReturnKey: string;
    InstCode: string;
    FinYear: number;
    StartDate: string;
    EndDate: string;
    ReturnItemsList: Array<{
        Code: string;
        Value: string;
        _description: string;
        _dataType: string;
        _required?: boolean;
    }>;
    DynamicItemsList: DynamicAreaEntry[];
}
