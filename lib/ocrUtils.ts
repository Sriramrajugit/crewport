import Tesseract from 'tesseract.js';

export interface ExtractedSalary {
    full_name?: string;
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

// Extract salary information from OCR text
export function extractSalaryFromText(text: string): ExtractedSalary {
    const salaryData: ExtractedSalary = {};
    
    // Patterns to match employee details - more flexible
    const detailPatterns = {
        full_name: /(?:Full\s*Name|Employee\s*Name|Name|A\.|MR\.|MRS\.|MS\.)\s*[:\s=>]+\s*([A-Za-z\s]+?)(?:\n|$|Date|&|Passport|Nationality)/i,
        nationality: /Nationality\s*[:\s=>]+\s*([A-Za-z\s]+?)(?:\n|$|Vessel|Date|&|Position|Rank)/i,
    };

    // Extract text details
    Object.entries(detailPatterns).forEach(([key, pattern]) => {
        const match = text.match(pattern);
        if (match && match[1]) {
            let value = match[1].trim();
            // Clean up extra spaces
            value = value.replace(/\s+/g, ' ');
            if (value && value.length > 0 && value.length < 100) {
                salaryData[key as keyof ExtractedSalary] = value as any;
            }
        }
    });
    
    // Patterns to match salary fields - much more flexible patterns
    const patterns = {
        basic_salary: /(?:Basic|Base)\s*(?:Wages?|Salary)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        fixed_overtime: /(?:Fixed|OT)\s*(?:Over[\s-]?time|OT)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        leave_wages: /Leave\s*Wages?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        other_allowances: /(?:Seniority|Other|Additional)\s*[/\w\s]*Allowances?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        travel_wages: /Travel\s*Wages?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        hra: /HRA.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        joining_expenses: /Joining\s*(?:Expenses?)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        onboard_allowance_short_manning: /(?:Onboard|Short[\s-]?Manning).*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
    };

    // Extract values using patterns
    Object.entries(patterns).forEach(([key, pattern]) => {
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

// Process image file with OCR and extract salary
export async function processContractWithOCR(file: File): Promise<{
    text: string;
    salaryData: ExtractedSalary;
    error?: string;
}> {
    try {
        // Create a reader to convert file to base64
        const reader = new FileReader();
        
        return new Promise((resolve) => {
            reader.onload = async () => {
                try {
                    const result = await Tesseract.recognize(
                        reader.result as string,
                        'eng',
                        {
                            logger: (m) => {
                                // Progress logging disabled
                            }
                        }
                    );

                    const extractedText = result.data.text;
                    const salaryData = extractSalaryFromText(extractedText);
                    resolve({
                        text: extractedText,
                        salaryData,
                    });

                    // Clean up Tesseract worker
                    try {
                        await (Tesseract as any).terminate();
                    } catch (err) {
                        // Cleanup error ignored
                    }
                } catch (error) {
                    resolve({
                        text: '',
                        salaryData: {},
                        error: (error as Error).message,
                    });
                }
            };

            reader.onerror = () => {
                resolve({
                    text: '',
                    salaryData: {},
                    error: 'Failed to read file',
                });
            };
            reader.readAsDataURL(file);
        });
    } catch (error) {
        console.error('[OCR] Outer error:', error);
        return {
            text: '',
            salaryData: {},
            error: (error as Error).message,
        };
    }
}
