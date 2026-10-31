import { readFile } from "fs/promises";
import path from "path";
import { SE002 } from "@/generated/prisma";

const REGION_MAP: Record<string, string> = {
    "ADDIS ABABA": "Addis Ababa",
    AFAR: "Afar",
    AMHARA: "Amhara",
    "BENSHANGUL GUMUZ": "Benishangul",
    "CENTAL ETHIOPIA": "CERS",
    "DIRE DAWA": "Dire Dawa",
    GAMBELLA: "Gambela",
    HARARI: "Harari",
    OROMIYA: "Oromia",
    SIDAMA: "Sidama",
    SOMALE: "Somalia",
    SWER: "SWERS",
    "South Ethiopia": "SERS",
    TIGRAY: "Tigray"
};
const LOAN_TYPE_MAP: Record<string, string> = {
    "Term Loan": "Term loan",
    Overdraft: "Overdraft",
    "Merch. Ent": "Merch. Loan*",
    URBAN: "Urban",
    RURAL: "Rural"
};
const OWNERSHIP_MAP: Record<string, string> = {
    "Public Enterprise": "Public Enterprise",
    "Private AND Cooperative": "Private & Coop.",
    "Regional Govt": "Regional Gov't",
    Banks: "Banks",
    Others: "Others*"
};

export const jsonFormat = async (
    returnKey: string,
    instCode: string,
    finYear: number,
    startDate: string,
    endDate: string,
    rawData: SE002[]
) => {
    const templateDir = path.join(process.cwd(), "templates", "json");
    const filePath = path.join(templateDir, "./SE002.json");
    const data = await readFile(filePath, "utf-8");
    const json = JSON.parse(data);

    json.ReturnKey = returnKey;
    json.InstCode = instCode;
    json.FinYear = finYear;
    json.StartDate = startDate;
    json.EndDate = endDate;

    const itemMap = new Map();
    json.ReturnItemsList?.forEach((item: any, index: number) => {
        const desc = item?._description;
        if (desc) {
            const descForm = desc
                ?.split("_")
                .map((it: string) => it.trim())
                .join("_");
            if (!itemMap.has(descForm)) {
                itemMap.set(descForm, []);
            }
            itemMap.get(descForm).push(index);
        }
    });

    for (let i = 0; i < rawData.length; i++) {
        const element = rawData[i];

        if (!element.REGION || !element.OWNERSHIP) continue;

        const region = REGION_MAP[element.REGION];
        const loanType = LOAN_TYPE_MAP[element.LOAN_TYPE || ""];
        const ownership = OWNERSHIP_MAP[element.OWNERSHIP];

        const amount_desc = `${region}_${loanType ? loanType + "_" : ""}${ownership}_Amount`;
        const no_borr_desc = `${region}_${loanType ? loanType + "_" : ""}${ownership}_# of Borrowers`;
        const no_acc_desc = `${region}_${loanType ? loanType + "_" : ""}${ownership}_# of Accounts`;

        let availableIndices = itemMap.get(amount_desc);
        if (availableIndices && availableIndices.length > 0) {
            const itemIndex = availableIndices.shift();
            json.ReturnItemsList[itemIndex].Value =
                element.AMOUNT?.toString() || "0";
        } else {
            console.warn(
                `Warning: Key '${amount_desc}' has no remaining unused entries in template.json`
            );
        }

        availableIndices = itemMap.get(no_borr_desc);
        if (availableIndices && availableIndices.length > 0) {
            const itemIndex = availableIndices.shift();
            json.ReturnItemsList[itemIndex].Value =
                element.NO_BORROWER?.toString() || "0";
        } else {
            console.warn(
                `Warning: Key '${no_borr_desc}' has no remaining unused entries in template.json`
            );
        }

        availableIndices = itemMap.get(no_acc_desc);
        if (availableIndices && availableIndices.length > 0) {
            const itemIndex = availableIndices.shift();
            json.ReturnItemsList[itemIndex].Value =
                element.NO_ACCOUNT?.toString() || "0";
        } else {
            console.warn(
                `Warning: Key '${no_acc_desc}' has no remaining unused entries in template.json`
            );
        }
    }

    return json;
};
