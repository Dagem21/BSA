import * as XLSX from "xlsx";

const REQUIRED_CELL_CHECKS: Array<{
    cell: string;
    expected: string;
    exactMatch?: boolean;
}> = [
    { cell: "B8", expected: "Instiution Code" },
    { cell: "B9", expected: "Financial Year" },
    { cell: "B10", expected: "Start Date" },
    { cell: "B11", expected: "End Date" },
    { cell: "A8", expected: "Instiution Code", exactMatch: true }
];

const REQUIRED_VALUE_CHECKS: Array<{
    cell: string;
    expected?: string;
    exactMatch?: boolean;
}> = [
    { cell: "C8", expected: "0000001", exactMatch: true },
    { cell: "C9" },
    { cell: "C10" },
    { cell: "C11" }
];

export interface StructuralValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

export async function validateNN001Template(
    file: File,
    expectedReportId?: string
): Promise<StructuralValidationResult> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, {
            type: "array"
        });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            return {
                isValid: false,
                errorMessage: "Uploaded Excel file contains no worksheets."
            };
        }

        const EXPECTED_SHEET_NAME =
            workbook.SheetNames.find((s) => s.toUpperCase() === "NBE") ||
            workbook.SheetNames[0];

        const worksheet: XLSX.WorkSheet = workbook.Sheets[EXPECTED_SHEET_NAME];
        if (!worksheet) {
            return {
                isValid: false,
                errorMessage: `Worksheet "${EXPECTED_SHEET_NAME}" not found.`
            };
        }

        const getCellText = (cellAddress: string): string => {
            const cell: XLSX.CellObject | undefined = worksheet[cellAddress];
            return cell && cell.v !== undefined ? String(cell.v).trim() : "";
        };

        const codeA1 = getCellText("A1").toUpperCase();
        const headerRow4 = getCellText("A4").toLowerCase();
        const headerRow14 = getCellText("B14").toLowerCase();

        // If specific report ID validation requested
        if (expectedReportId) {
            const cleanId = expectedReportId.toUpperCase();
            if (cleanId.includes("NN001") || cleanId.includes("NACNN001")) {
                const isNN001 =
                    codeA1.includes("NACNN001") ||
                    codeA1.includes("NN001") ||
                    headerRow4.includes("non-accrual") ||
                    headerRow14.includes("counterparty");
                if (!isNN001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact NN001 Excel template file."
                    };
                }
            } else if (cleanId.includes("OL001") || cleanId.includes("COL_ACQ_18M_OL001")) {
                const isOL001 =
                    codeA1.includes("COL_ACQ_18M_OL001") ||
                    codeA1.includes("OL001") ||
                    headerRow4.includes("collateralized properties") ||
                    headerRow14.includes("name of borrower");
                if (!isOL001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact OL001 Excel template file."
                    };
                }
            } else if (cleanId.includes("MA001") || cleanId.includes("NBE_MAT_ANL_MA001")) {
                const isMA001 =
                    codeA1.includes("NBE_MAT_ANL_MA001") ||
                    codeA1.includes("MA001") ||
                    headerRow4.includes("maturity of assets");
                if (!isMA001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact MA001 Excel template file."
                    };
                }
            } else if (cleanId.includes("MK001") || cleanId.includes("KEY BALANCE SHEET")) {
                const isMK001 =
                    codeA1.includes("MK001") ||
                    codeA1.includes("KEY BALANCE SHEET") ||
                    headerRow4.includes("key balance sheet");
                if (!isMK001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact MK001 Excel template file."
                    };
                }
            } else if (cleanId.includes("KK001") || cleanId.includes("M_CC")) {
                const isKK001 =
                    codeA1.includes("KK001") ||
                    codeA1.includes("M_CC") ||
                    headerRow4.includes("capital adequacy");
                if (!isKK001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact KK001 Excel template file."
                    };
                }
            } else if (cleanId.includes("RL002") || cleanId.includes("REGRL002") || cleanId.includes("LOAN_RAN")) {
                const isRL002 =
                    codeA1.includes("RL002") ||
                    codeA1.includes("REGRL002") ||
                    codeA1.includes("LOAN_RAN") ||
                    headerRow4.includes("range and region");
                if (!isRL002) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact REGRL002 Excel template file."
                    };
                }
            } else if (cleanId.includes("MD002") || cleanId.includes("CDBY") || cleanId.includes("SECTOR AND REG")) {
                const isMD002 =
                    codeA1.includes("MD002") ||
                    codeA1.includes("CDBY") ||
                    headerRow4.includes("deposits by sector and region");
                if (!isMD002) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact MD002 Excel template file."
                    };
                }
            } else if (cleanId.includes("DPWADP001") || cleanId.includes("DPW")) {
                const isDPWADP001 =
                    codeA1.includes("DPWADP001") ||
                    headerRow4.includes("interest-free banks") ||
                    headerRow4.includes("deposit profit rates");
                if (!isDPWADP001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact DPWADP001 Excel template file."
                    };
                }
            } else if (cleanId.includes("LB002") || cleanId.includes("BOR_TEN_PER_LB002")) {
                const isLB002 =
                    codeA1.includes("LB002") ||
                    codeA1.includes("BOR_TEN_PER_LB002") ||
                    headerRow4.includes("large exposures") ||
                    headerRow4.includes("exceed ten percent");
                if (!isLB002) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact LB002 Excel template file."
                    };
                }
            } else if (cleanId.includes("MB001") || cleanId.includes("MB001MB001")) {
                const isMB001 =
                    codeA1.includes("MB001") ||
                    headerRow4.includes("monthly balance sheet");
                if (!isMB001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact MB001 Excel template file."
                    };
                }
            } else if (cleanId.includes("SRR")) {
                const isSRR =
                    codeA1.includes("SRR") ||
                    headerRow4.includes("statutory reserve");
                if (!isSRR) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact SRRYY001 Excel template file."
                    };
                }
            } else if (cleanId.includes("RB001") || cleanId.includes("RESERVE BASE")) {
                const isRB001 =
                    codeA1.includes("RB001") ||
                    codeA1.includes("RESERVE BASE") ||
                    headerRow4.includes("reserve base");
                if (!isRB001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact RB001 Excel template file."
                    };
                }
            } else if (cleanId.includes("ZS001")) {
                const isZS001 =
                    codeA1.includes("ZS001") ||
                    codeA1.includes("LSR") ||
                    getCellText("A17").toLowerCase().includes("net current liabilities") ||
                    getCellText("B9").toLowerCase().includes("instiution");
                if (!isZS001) {
                    return {
                        isValid: false,
                        errorMessage:
                            "This is not the exact ZS001 Excel template file."
                    };
                }
            }
        }

        // Check if file matches OP001 layout (B8: Instiution Code) or ZS001 layout (B9: Instiution code)
        const isOP001 = getCellText("B8").toLowerCase().includes("instiution");
        const isZS001 = getCellText("B9").toLowerCase().includes("instiution");
        const isNN001Header = getCellText("A8").toLowerCase().includes("instiution") || codeA1.includes("NACNN001");

        if (!isOP001 && !isZS001 && !isNN001Header) {
            // Flexible check: ensure at least one institution code label exists
            const hasHeader = REQUIRED_CELL_CHECKS.some((check) =>
                getCellText(check.cell)
                    .toLowerCase()
                    .includes("instiution")
            );
            if (!hasHeader && getCellText("B9") === "" && getCellText("B8") === "" && getCellText("A8") === "") {
                return {
                    isValid: false,
                    errorMessage: "Template structure mismatch. Expected Institution Code header."
                };
            }
        }

        return { isValid: true };
    } catch (err: unknown) {
        return {
            isValid: false,
            errorMessage:
                "Unable to parse file. Please upload a valid Excel template."
        };
    }
}

