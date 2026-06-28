/**
 * Example: Basic OCR Processing
 * Demonstrates simple file processing and data extraction
 */

import {
  processContractWithOCR,
  extractSalaryFromText,
  validateExtractedData,
} from '@crewport/ocr-extractor';

export async function basicExample(file: File) {
  // Process file with OCR
  const result = await processContractWithOCR(file);

  if (result.error) {
    console.error('OCR failed:', result.error);
    return;
  }

  // Print extracted text
  console.log('Extracted Text:');
  console.log(result.text);
  console.log('\nSalary Data:');
  console.log(result.salaryData);

  // Validate data
  const validation = validateExtractedData(result.salaryData);
  if (!validation.isValid) {
    console.warn('Missing fields:', validation.missingFields);
  }
  if (validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }

  return result.salaryData;
}
