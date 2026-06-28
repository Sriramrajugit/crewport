/**
 * Example: Next.js API Route
 * Demonstrates server-side usage in a Next.js API route
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  processContractWithOCR,
  validateExtractedData,
} from '@crewport/ocr-extractor';

/**
 * POST /api/extract-contract
 * 
 * Processes contract image and extracts salary data
 * 
 * Request:
 *   - Multipart form data with 'contract' file field
 * 
 * Response:
 *   - 200: { success: true, salaryData: {...} }
 *   - 400: { error: string, missingFields?: string[], warnings?: string[] }
 *   - 500: { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('contract') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No contract file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // ValidateFile size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File must be smaller than 10MB' },
        { status: 400 }
      );
    }

    // Process with OCR
    const result = await processContractWithOCR(file, {
      language: 'eng',
      logProgress: false,
    });

    // Handle OCR errors
    if (result.error) {
      return NextResponse.json(
        { error: `OCR processing failed: ${result.error}` },
        { status: 400 }
      );
    }

    // Validate extracted data
    const validation = validateExtractedData(result.salaryData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Extraction validation failed',
          missingFields: validation.missingFields,
          warnings: validation.warnings,
          partialData: result.salaryData,
        },
        { status: 400 }
      );
    }

    // Log extracted data (for debugging)
    console.log('[OCR API] Extracted data for', result.salaryData.full_name);

    // Return extracted data
    return NextResponse.json(
      {
        success: true,
        salaryData: result.salaryData,
        warnings: validation.warnings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[OCR API] Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
