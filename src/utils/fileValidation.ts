import * as XLSX from "xlsx";

const EXPECTED_SHEET_NAME = "M_LCPLC001";

const REQUIRED_CELL_CHECKS: Array<{
    cell: string;
    expected: string;
    exactMatch?: boolean;
}> = [
    // Document Header
    { cell: "A1", expected: "M_LCPLC001", exactMatch: true },
    { cell: "A4", expected: "Loan Classification and Provisioning" },

    // Metadata Labels
    { cell: "A8", expected: "Instiution Code" },
    { cell: "A9", expected: "Financial Year" },
    { cell: "A10", expected: "Start Date" },
    { cell: "A11", expected: "End Date" },

    // Table Column Headers (Row 14)
    { cell: "A14", expected: "Code" },
    { cell: "B14", expected: "Loan classification" },
    { cell: "D14", expected: "Deductible collateral" },
    { cell: "H14", expected: "Provisioning rate" },
    { cell: "I14", expected: "Required provision" },
    { cell: "J14", expected: "Accumulated provision held" },
    { cell: "K14", expected: "Excess/shortfall in provisions" },

    // Table Sub-headers (Row 15)
    { cell: "C15", expected: "Amount" },
    { cell: "D15", expected: "Cash/cash substitute" },
    { cell: "E15", expected: "Net recoverable value" },
    { cell: "F15", expected: "Total" },
    { cell: "G15", expected: "Net loans and advances" }
];

export interface StructuralValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

/**
 * Validates whether an uploaded File matches the LC001 template structure.
 */
export async function validateLC001Template(
    file: File
): Promise<StructuralValidationResult> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, {
            type: "array"
        });

        // 1. Check sheet existence
        if (!workbook.SheetNames.includes(EXPECTED_SHEET_NAME)) {
            return {
                isValid: false,
                errorMessage: `Missing required worksheet "${EXPECTED_SHEET_NAME}".`
            };
        }

        const worksheet: XLSX.WorkSheet = workbook.Sheets[EXPECTED_SHEET_NAME];

        const getCellText = (cellAddress: string): string => {
            const cell: XLSX.CellObject | undefined = worksheet[cellAddress];
            return cell && cell.v !== undefined ? String(cell.v).trim() : "";
        };

        // 2. Validate structural anchor cells
        for (const check of REQUIRED_CELL_CHECKS) {
            const actualValue = getCellText(check.cell);
            const isMatch = check.exactMatch
                ? actualValue === check.expected
                : actualValue
                      .toLowerCase()
                      .includes(check.expected.toLowerCase());

            if (!isMatch) {
                return {
                    isValid: false,
                    errorMessage: `Template structure mismatch at cell ${check.cell}. Expected "${check.expected}".`
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
