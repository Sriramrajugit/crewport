import Tesseract from 'tesseract.js';
import { ExtractedSalary, OCRResult, OCROptions } from './types';
import { extractSalaryFromText } from './textExtractor';

/**
 * Process an image file with OCR and extract salary data
 * 
 * @param file - Image file to process (PNG, JPG, JPEG, etc.)
 * @param options - Optional configuration for OCR processing
 * @returns Promise resolving to OCRResult with extracted text and salary data
 * 
 * @example
 * ```typescript
 * const file = event.target.files[0];
 * const result = await processContractWithOCR(file);
 * if (!result.error) {
 *   console.log('Extracted Salary:', result.salaryData);
 * }
 * ```
 */
export async function processContractWithOCR(
    file: File,
    options: OCROptions = {}
): Promise<OCRResult> {
    const { language = 'eng', logProgress = false } = options;

    try {
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onload = async () => {
                try {
                    if (logProgress) {
                        console.log('[OCR] Starting Tesseract recognition...');
                    }

                    const result = await Tesseract.recognize(
                        reader.result as string,
                        language,
                        {
                            logger: (m) => {
                                if (logProgress) {
                                    console.log('[OCR] Progress:', m);
                                }
                            }
                        }
                    );

                    const extractedText = result.data.text;
                    const salaryData = extractSalaryFromText(extractedText);

                    if (logProgress) {
                        console.log('[OCR] Recognition completed');
                    }

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
                    console.error('[OCR] Recognition error:', error);
                    resolve({
                        text: '',
                        salaryData: {},
                        error: (error as Error).message,
                    });
                }
            };

            reader.onerror = () => {
                console.error('[OCR] File read error');
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
