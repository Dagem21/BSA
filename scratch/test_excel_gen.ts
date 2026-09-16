import { generateExcelFromJson } from "../src/utils/jsonToExcel";
import { LB002Format } from "../src/utils/services/LB002/jsonFormat";
import * as path from "path";
import * as fs from "fs";

async function test() {
    const sampleRows = [
        {
            counterpartyName: "AMG STEEL FACTORY/ABDULHAKIMMOHAMM",
            exposureType: "AL",
            exposureSector: "Export",
            approvedLimit: "8707",
            onBalanceExposure: "6727.03",
            offBalanceExposure: "791.98",
            totalOutstanding: "7519.01",
            maturityDate: "2027-03-07T00:00:00",
            capital: "197320.25",
            exposurePctCapital: "3.81",
            status: "Pass",
            collateralType: "Bank Share",
            collateralValue: "3439.20"
        }
    ];

    const json = LB002Format("BOR_TEN_PER_LB002", "0000001", 2026, "2026-08-01T00:00:00", "2026-08-31T00:00:00", sampleRows);
    const outPath = path.join(__dirname, "test_out.xlsx");
    await generateExcelFromJson(json, outPath);
    console.log("Excel generated successfully at:", outPath, "Size:", fs.statSync(outPath).size);
}

test().catch(console.error);
