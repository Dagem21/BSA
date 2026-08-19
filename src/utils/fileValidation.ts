import * as XLSX from "xlsx";

const REQUIRED_CELL_CHECKS: Array<{
    cell: string;
    expected: string;
    exactMatch?: boolean;
}> = [
    { cell: "B8", expected: "Instiution Code" },
    { cell: "B9", expected: "Financial Year" },
    { cell: "B10", expected: "Start Date" },
    { cell: "B11", expected: "End Date" }
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

/**
 * Validates whether an uploaded File matches the LC001 template structure.
 */
export async function validateTemplate(
    file: File
): Promise<StructuralValidationResult> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, {
            type: "array"
        });

        if (workbook.SheetNames.length !== 1) {
            return {
                isValid: false,
                errorMessage: `Found "${workbook.SheetNames.length} sheets.".`
            };
        }

        const EXPECTED_SHEET_NAME = workbook.SheetNames[0];

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

        for (const check of REQUIRED_VALUE_CHECKS) {
            const actualValue = getCellText(check.cell);
            const isValid = check.exactMatch
                ? actualValue === check.expected
                : actualValue;

            if (!isValid) {
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
