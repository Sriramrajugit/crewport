/**
 * Extracted salary and employee data from OCR processing
 */
export interface ExtractedSalary {
    full_name?: string;
    date_of_birth?: string;
    nationality?: string;
    basic_salary?: number;
    fixed_overtime?: number;
    leave_wages?: number;
    other_allowances?: number;
    travel_wages?: number;
    hra?: number;
    joining_expenses?: number;
    onboard_allowance_short_manning?: number;
}

/**
 * Result of OCR processing
 */
export interface OCRResult {
    text: string;
    salaryData: ExtractedSalary;
    error?: string;
}

/**
 * Options for OCR processing
 */
export interface OCROptions {
    language?: string;
    logProgress?: boolean;
}
