import { ExtractedSalary } from './types';

/**
 * Extract salary information from OCR-recognized text
 * Uses regex patterns to identify and extract salary and employee data
 * 
 * @param text - Raw text from OCR recognition
 * @returns ExtractedSalary object with parsed data
 */
export function extractSalaryFromText(text: string): ExtractedSalary {
    const salaryData: ExtractedSalary = {};

    // Log raw text for debugging
    console.log('[OCR] Raw extracted text:', text.substring(0, 800));
    console.log('[OCR] Text length:', text.length);

    // STRICT patterns - match LABEL followed by value
    // This prevents picking up wrong text
    const detailPatterns = {
        full_name: /(?:Full\s*Name|Employee\s*Name|Crew\s*Name|Name|A\.|MR\.|MRS\.|MS\.?|SHRI|CAPT|CAPTAIN)\s*[:=>\-]*\s*([A-Z][A-Za-z\s.,'-]{2,50}?)(?:\n|,|$|\s{3,}|Date|DOB|&|Passport|Nationality|Age|India)/i,
        // Match ANY date pattern more aggressively - look for numbers in date format anywhere
        date_of_birth: /(?:date\s*(?:of\s*)?birth|dob|birth\s*date|d\.o\.b|d\s*o\s*b)\s*[:=>\-\s]*(\d{1,2}\s*[-\/\.\s]\s*\d{1,2}\s*[-\/\.\s]\s*\d{2,4}|\d{2,4}\s*[-\/\.\s]\s*\d{1,2}\s*[-\/\.\s]\s*\d{1,2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/i,
        // Simplified nationality pattern - just look for "Nationality" followed by = or : and capture the country name
        nationality: /nationality\s*[=:]\s*([A-Za-z]+)/i,
    };

    // Extract text details with logging
    Object.entries(detailPatterns).forEach(([key, pattern]) => {
        const match = text.match(pattern);
        
        if (key === 'nationality' && match) {
            console.log('[OCR] Nationality MATCH found:', match[0]);
            console.log('[OCR] Nationality captured value:', match[1]);
        }
        
        if (match && match[1]) {
            let value = match[1].trim();
            console.log('[OCR]', key, '- Raw captured:', JSON.stringify(value));
            
            // Clean up extra spaces
            value = value.replace(/\s+/g, ' ');
            
            // Special handling for different field types
            if (key === 'date_of_birth') {
                // Clean up date delimiters but keep the date format
                value = value.replace(/\s+/g, '');  // Remove all spaces for date
                value = value.replace(/(?<!\d)([-\/.\s])(?!\d)/g, '');  // Remove standalone delimiters
                // Re-add proper delimiter (forward slash)
                const dateMatch = value.match(/^(\d{1,2})[-\/.\s]*(\d{1,2})[-\/.\s]*(\d{2,4})$/);
                if (dateMatch) {
                    value = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
                }
            } else if (key === 'nationality') {
                console.log('[OCR] Nationality - Before cleanup:', JSON.stringify(value));
                // Remove any trailing numbers, special chars, only keep letters and spaces
                value = value.replace(/[^A-Za-z\s]/g, '');
                console.log('[OCR] Nationality - After cleanup:', JSON.stringify(value));
            } else if (key === 'full_name') {
                // Remove trailing numbers but keep the name
                value = value.replace(/\s*\d{2,}[-\/]*\d*.*$/i, '').trim();
            }
            
            if (value && value.length > 1 && value.length < 100) {
                console.log('[OCR] ✓ ACCEPTED', key, ':', value);
                salaryData[key as keyof ExtractedSalary] = value as any;
            } else {
                console.log('[OCR] ✗ REJECTED', key, ':', value, '(length:', value.length, ')');
            }
        } else {
            // Show what we're looking for when not found
            console.log('[OCR] Not found:', key);
            // Debug specific keywords
            if (key === 'nationality') {
                const hasNationality = text.toLowerCase().includes('nationality');
                const hasNational = text.toLowerCase().includes('national');
                const hasCountry = text.toLowerCase().includes('country');
                console.log('[OCR] DEBUG nationality:', {hasNationality, hasNational, hasCountry});
                
                // If it has the word, show what's around it
                if (hasNationality) {
                    const idx = text.toLowerCase().indexOf('nationality');
                    const context = text.substring(Math.max(0, idx - 20), Math.min(text.length, idx + 150));
                    console.log('[OCR] DEBUG nationality context:', context);
                }
            }
        }
    });

    // Patterns to match salary fields
    const salaryPatterns: Record<keyof Omit<ExtractedSalary, 'full_name' | 'date_of_birth' | 'nationality'>, RegExp> = {
        basic_salary: /(?:Basic|Base)\s*(?:Wages?|Salary)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        fixed_overtime: /(?:Fixed|OT)\s*(?:Over[\s-]?time|OT)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        leave_wages: /Leave\s*Wages?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        other_allowances: /(?:Seniority|Other|Additional)\s*[/\w\s]*Allowances?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        travel_wages: /Travel\s*Wages?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        hra: /HRA.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        joining_expenses: /Joining\s*(?:Expenses?)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        onboard_allowance_short_manning: /(?:Onboard|Short[\s-]?Manning).*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
    };

    // Extract salary values using patterns
    Object.entries(salaryPatterns).forEach(([key, pattern]) => {
        const match = text.match(pattern);
        if (match && match[1]) {
            const value = parseFloat(match[1]);
            if (!isNaN(value)) {
                (salaryData as any)[key] = value;
            }
        }
    });

    return salaryData;
}

/**
 * Add custom extraction pattern to the salary data
 * Useful for extracting additional fields specific to your use case
 * 
 * @param text - Raw OCR text
 * @param fieldName - Name of the field to extract
 * @param pattern - Regex pattern to match the field
 * @param isNumeric - Whether to parse as number (default: false)
 * @returns Extracted value or null if not found
 */
export function extractCustomField(
    text: string,
    fieldName: string,
    pattern: RegExp,
    isNumeric: boolean = false
): string | number | null {
    const match = text.match(pattern);
    if (!match || !match[1]) {
        return null;
    }

    const value = match[1].trim();
    if (isNumeric) {
        const numValue = parseFloat(value);
        return isNaN(numValue) ? null : numValue;
    }

    return value;
}

/**
 * Validate extracted salary data - check if all required salary fields are present
 * 
 * @param salaryData - Extracted salary data
 * @returns Object with validation results
 */
export function validateExtractedData(salaryData: ExtractedSalary): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
} {
    const requiredFields = [
        'basic_salary',
        'fixed_overtime',
        'leave_wages',
        'other_allowances'
    ];

    const missingFields = requiredFields.filter(
        (field) => !(field in salaryData && salaryData[field as keyof ExtractedSalary] !== undefined)
    );

    const warnings: string[] = [];

    if (!salaryData.full_name) {
        warnings.push('Missing employee name');
    }
    if (!salaryData.date_of_birth) {
        warnings.push('Missing date of birth');
    }
    if (!salaryData.nationality) {
        warnings.push('Missing nationality information');
    }

    return {
        isValid: missingFields.length === 0,
        missingFields,
        warnings,
    };
}
