# @crewport/ocr-extractor

A powerful OCR text extraction and salary data parsing module for maritime contracts and employment documents. Built with TypeScript and Tesseract.js.

## Features

- 📄 **OCR Text Extraction** - Convert images to text using Tesseract.js
- 💰 **Salary Data Parsing** - Automatically extract salary components from contract documents
- 👤 **Employee Information** - Extract name, nationality, and other employee details
- 🔍 **Custom Field Extraction** - Define custom regex patterns for additional fields
- ✅ **Data Validation** - Validate extracted data and identify missing fields
- 📦 **Reusable Module** - Use across multiple projects with consistent API
- 🎯 **Type-Safe** - Full TypeScript support with proper type definitions

## Installation

```bash
npm install @crewport/ocr-extractor tesseract.js
```

Or with yarn:

```bash
yarn add @crewport/ocr-extractor tesseract.js
```

## Quick Start

### Basic Usage

```typescript
import { processContractWithOCR } from '@crewport/ocr-extractor';

// Process an image file
const file = event.target.files[0];
const result = await processContractWithOCR(file);

if (!result.error) {
  console.log('Extracted Text:', result.text);
  console.log('Salary Data:', result.salaryData);
} else {
  console.error('OCR Error:', result.error);
}
```

### With Options

```typescript
const result = await processContractWithOCR(file, {
  language: 'eng',      // OCR language (default: 'eng')
  logProgress: true     // Enable progress logging (default: false)
});
```

## API Reference

### Functions

#### `processContractWithOCR(file, options?)`

Process an image file with OCR and extract salary data.

**Parameters:**
- `file: File` - Image file to process (PNG, JPG, JPEG, etc.)
- `options?: OCROptions` - Optional configuration
  - `language?: string` - OCR language code (default: 'eng')
  - `logProgress?: boolean` - Enable console logging (default: false)

**Returns:** `Promise<OCRResult>`

```typescript
interface OCRResult {
  text: string;              // Raw OCR text
  salaryData: ExtractedSalary; // Parsed salary data
  error?: string;            // Error message if failed
}
```

#### `extractSalaryFromText(text)`

Extract salary information from raw OCR text.

**Parameters:**
- `text: string` - Raw text from OCR recognition

**Returns:** `ExtractedSalary`

```typescript
import { extractSalaryFromText } from '@crewport/ocr-extractor';

const salaryData = extractSalaryFromText(rawOCRText);
console.log(salaryData.basic_salary); // 5000
```

#### `extractCustomField(text, fieldName, pattern, isNumeric?)`

Extract a custom field using a regex pattern.

**Parameters:**
- `text: string` - OCR text
- `fieldName: string` - Field name (for reference)
- `pattern: RegExp` - Regex pattern to match
- `isNumeric?: boolean` - Parse as number (default: false)

**Returns:** `string | number | null`

```typescript
const employeeId = extractCustomField(
  ocrText,
  'employeeId',
  /Employee\s*ID\s*[:\s=>]+(\d+)/i,
  true
);
```

#### `validateExtractedData(salaryData)`

Validate extracted salary data.

**Parameters:**
- `salaryData: ExtractedSalary` - Extracted data to validate

**Returns:**
```typescript
{
  isValid: boolean;           // Whether all required fields are present
  missingFields: string[];    // List of missing required fields
  warnings: string[];         // Non-critical warnings
}
```

```typescript
const validation = validateExtractedData(salaryData);
if (!validation.isValid) {
  console.warn('Missing fields:', validation.missingFields);
}
if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

### Types

#### `ExtractedSalary`

```typescript
interface ExtractedSalary {
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
```

#### `OCROptions`

```typescript
interface OCROptions {
  language?: string;        // OCR language code
  logProgress?: boolean;    // Enable progress logging
}
```

#### `OCRResult`

```typescript
interface OCRResult {
  text: string;                          // Raw extracted text
  salaryData: ExtractedSalary;          // Parsed salary data
  error?: string;                        // Error message if any
}
```

## Usage Examples

### React Component

```typescript
import { useState } from 'react';
import { processContractWithOCR, validateExtractedData } from '@crewport/ocr-extractor';

export function ContractUploader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await processContractWithOCR(file, { logProgress: true });

      if (result.error) {
        setError(result.error);
      } else {
        const validation = validateExtractedData(result.salaryData);
        if (!validation.isValid) {
          setError(`Missing fields: ${validation.missingFields.join(', ')}`);
        }
        setData(result.salaryData);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Processing...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Next.js API Route

```typescript
import { processContractWithOCR, validateExtractedData } from '@crewport/ocr-extractor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('contract') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const result = await processContractWithOCR(file);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const validation = validateExtractedData(result.salaryData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          missingFields: validation.missingFields,
          warnings: validation.warnings
        },
        { status: 400 }
      );
    }

    // Save to database
    return NextResponse.json({
      success: true,
      salaryData: result.salaryData
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

## Customization

### Adding New Salary Fields

Modify the salary patterns in `textExtractor.ts`:

```typescript
export function extractSalaryFromText(text: string): ExtractedSalary {
  const salaryData: ExtractedSalary = {};
  
  // Add custom patterns here
  const customPatterns = {
    bonus: /(?:Annual\s+)?Bonus.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
  };
  
  // ... rest of extraction logic
}
```

### Custom Language Support

Tesseract.js supports 100+ languages. Specify language code in options:

```typescript
const result = await processContractWithOCR(file, {
  language: 'deu'  // German
});
```

See [Tesseract.js language codes](https://github.com/naptha/tesseract.js#language-data) for full list.

## Performance Considerations

- **First Load**: Tesseract models are downloaded on first use (~65MB)
- **Caching**: Models are cached in browser for subsequent use
- **Large Files**: Processing large images may take 30-60 seconds
- **Memory**: Each OCR instance uses ~200MB+ memory

## Browser Support

Requires modern browser with:
- FileReader API
- Web Workers
- Canvas API

Supported on:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT

## Contributing

Contributions welcome! Please submit pull requests or open issues for bugs and feature requests.

## Support

For issues, questions, or suggestions, please open an issue in the repository.
