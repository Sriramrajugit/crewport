# Quick Start Guide: Using @crewport/ocr-extractor

## 5-Minute Setup

### Step 1: Build the Module
```bash
cd modules/ocr-extractor
npm install
npm run build
cd ../..
```

### Step 2: Update Your Import
```typescript
// In app/dashboard/crew/page.tsx (around line 5)

// OLD:
import { processContractWithOCR } from '@/lib/ocrUtils';

// NEW:
import { processContractWithOCR } from '@crewport/ocr-extractor';
```

### Step 3: Done!
The module works as a drop-in replacement. No other code changes needed.

---

## Common Usage Patterns

### Basic File Upload
```typescript
const file = event.target.files[0];
const result = await processContractWithOCR(file);

if (!result.error) {
  console.log(result.salaryData);
  // {
  //   full_name: "John Smith",
  //   basic_salary: 5000,
  //   ...
  // }
}
```

### With Validation
```typescript
import { processContractWithOCR, validateExtractedData } from '@crewport/ocr-extractor';

const result = await processContractWithOCR(file);
const validation = validateExtractedData(result.salaryData);

if (validation.isValid) {
  // All required fields extracted successfully
  saveToDatabase(result.salaryData);
} else {
  // Show warning about missing fields
  console.warn(validation.missingFields);
}
```

### React Component
```typescript
import { useState } from 'react';
import { processContractWithOCR } from '@crewport/ocr-extractor';

function ContractUploader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    setLoading(true);
    const result = await processContractWithOCR(e.target.files[0]);
    setData(result.salaryData);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={loading} />
      {loading && <p>Processing...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

## File Structure

```
modules/ocr-extractor/
├── src/
│   ├── index.ts              # Main exports ✨
│   ├── ocr.ts               # Processing logic 🔧
│   ├── textExtractor.ts     # Text parsing 📄
│   └── types.ts             # TypeScript types 📝
├── examples/
│   ├── basic.ts             # Simple example
│   ├── react-component.tsx  # React example
│   └── nextjs-api-route.ts  # Server example
├── README.md                # Full documentation 📖
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

---

## API Overview

### Main Function
```typescript
processContractWithOCR(file, options?)
  ↓
  Processes image with Tesseract
  ↓
  Returns { text, salaryData, error? }
```

### Extracted Fields
- `full_name` - Employee name
- `nationality` - Employee nationality
- `basic_salary` - Basic salary amount
- `fixed_overtime` - Fixed overtime
- `leave_wages` - Leave wages
- `other_allowances` - Other allowances
- `travel_wages` - Travel wages
- `hra` - HRA amount
- `joining_expenses` - Joining expenses
- `onboard_allowance_short_manning` - Onboard allowance

### Additional Functions
- `extractSalaryFromText(text)` - Extract from text directly
- `extractCustomField(text, fieldName, pattern, isNumeric?)` - Custom extraction
- `validateExtractedData(data)` - Validate extracted data

---

## Troubleshooting

### "Cannot find module" error
```bash
# Rebuild the module
cd modules/ocr-extractor && npm run build
```

### OCR is slow
- First run: Downloads models (~65MB)
- Best for images: Under 5MB, high quality
- Processing time: ~30-60 seconds for large images

### Missing fields in extraction
Check the original image quality. Use:
```typescript
const validation = validateExtractedData(result.salaryData);
console.log(validation.missingFields);
```

---

## Publishing to NPM

When ready to share with other projects:

```bash
cd modules/ocr-extractor
npm login
npm version patch
npm publish
```

Then install elsewhere:
```bash
npm install @crewport/ocr-extractor tesseract.js
```

---

## Documentation

- **Full API** → `README.md`
- **Integration Guide** → `INTEGRATION.md`
- **Examples** → `examples/` folder
- **Development** → `SUMMARY.md`

---

## Support

For detailed information, see:
- `modules/ocr-extractor/README.md` - Complete API docs
- `modules/ocr-extractor/examples/` - Code examples
- `modules/ocr-extractor/INTEGRATION.md` - Integration guide

Happy OCR processing! 🎉
