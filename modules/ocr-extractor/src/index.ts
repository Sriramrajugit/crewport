/**
 * @crewport/ocr-extractor
 * 
 * OCR text extraction and salary data parsing module
 * Extracts employee and salary information from contract documents using Tesseract.js
 */

export { processContractWithOCR } from './ocr';
export {
    extractSalaryFromText,
    extractCustomField,
    validateExtractedData,
} from './textExtractor';
export type {
    ExtractedSalary,
    OCRResult,
    OCROptions,
} from './types';
