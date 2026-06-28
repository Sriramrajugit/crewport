# OCR Module Integration Guide

## Overview

The OCR module has been extracted as a standalone, reusable package: `@crewport/ocr-extractor`

This module is located in `modules/ocr-extractor/` and can be:
1. **Used locally** in this project (Crewport)
2. **Published to npm** for use in other projects
3. **Used as a git submodule** in other repositories

## Local Setup (Current Project)

### Option 1: Direct Build and Use (Recommended for development)

1. **Build the OCR module:**
   ```bash
   cd modules/ocr-extractor
   npm install
   npm run build
   ```

2. **Update imports in your project:**
   ```typescript
   // OLD:
   import { processContractWithOCR } from '@/lib/ocrUtils';
   
   // NEW:
   import { processContractWithOCR } from '@crewport/ocr-extractor';
   ```

### Option 2: NPM Workspace Setup

You can set up the workspace in the root `package.json`:

```json
{
  "workspaces": [
    ".",
    "modules/ocr-extractor"
  ]
}
```

Then install and use:
```bash
npm install
npm run build -w @crewport/ocr-extractor
```

## Publishing to NPM (For Other Projects)

### 1. Prepare for Publication

```bash
cd modules/ocr-extractor
npm login
npm version patch  # or minor/major
```

### 2. Publish

```bash
npm publish --access public
```

### 3. Use in Other Projects

```bash
npm install @crewport/ocr-extractor tesseract.js
```

Then import:
```typescript
import { processContractWithOCR, validateExtractedData } from '@crewport/ocr-extractor';
```

## Using as a Git Submodule

If you want to use the OCR module in another project via git:

```bash
# In your target project
git submodule add https://github.com/your-org/ocr-extractor.git modules/ocr-extractor

# Install dependencies
cd modules/ocr-extractor
npm install
npm run build
```

## Module Structure

```
modules/ocr-extractor/
├── src/
│   ├── index.ts              # Main export file
│   ├── ocr.ts               # OCR processing logic
│   ├── textExtractor.ts     # Text parsing and extraction
│   └── types.ts             # TypeScript type definitions
├── examples/
│   ├── basic.ts             # Basic usage example
│   ├── react-component.tsx  # React component example
│   └── nextjs-api-route.ts  # Next.js API example
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Customization for Your Projects

Each project can customize the extraction patterns:

```typescript
// In your project's utility file
import { extractSalaryFromText, extractCustomField } from '@crewport/ocr-extractor';

export function extractCrew ContractData(text: string) {
  const baseSalaryData = extractSalaryFromText(text);
  
  // Add custom fields
  const companyName = extractCustomField(
    text,
    'company',
    /Company\s*[:\s=>]+([^:\n]+)/i,
    false
  );
  
  return {
    ...baseSalaryData,
    companyName,
  };
}
```

## Migration Steps (Crewport Project)

1. **Update imports** in `app/dashboard/crew/page.tsx`:
   ```typescript
   // Change from:
   import { processContractWithOCR } from '@/lib/ocrUtils';
   
   // To:
   import { processContractWithOCR } from '@crewport/ocr-extractor';
   ```

2. **Update TypeScript configuration** (if needed):
   - Add path mapping in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@crewport/ocr-extractor": ["./modules/ocr-extractor/dist"]
       }
     }
   }
   ```

3. **Install module dependencies**:
   ```bash
   cd modules/ocr-extractor
   npm install
   npm run build
   cd ../..
   npm run build
   ```

4. **Test OCR functionality** in the Crew page upload

5. **Optional**: Keep the old `lib/ocrUtils.ts` for backwards compatibility, or remove it if no longer needed

## Development Tips

### Adding New Features

To add new features to the OCR module:

1. Edit files in `modules/ocr-extractor/src/`
2. Update types in `src/types.ts`
3. Add examples in `examples/`
4. Rebuild: `npm run build`
5. Test imports and functionality

### Testing

Add tests in `modules/ocr-extractor/`:

```bash
npm install --save-dev jest ts-jest @types/jest
npm test
```

### TypeScript Support

The module includes:
- Full TypeScript support
- Declaration files (`*.d.ts`)
- Source maps for debugging
- Type definitions for all exports

## API Compatibility

The module maintains the same API as the original `ocrUtils.ts`:

✅ `processContractWithOCR(file)` - Same signature with optional options
✅ `ExtractedSalary` type - Identical structure
✅ Return types - Backward compatible

New features added:
- `extractSalaryFromText(text)` - Export raw text extraction
- `extractCustomField()` - Custom pattern extraction
- `validateExtractedData()` - Data validation
- `OCROptions` - Configuration for logger and language

## Troubleshooting

### "Cannot find module '@crewport/ocr-extractor'"

1. Ensure the module is built:
   ```bash
   cd modules/ocr-extractor && npm run build
   ```

2. Check `tsconfig.json` path mappings

3. Restart TypeScript language server in VS Code

### OCR taking too long

- Large images (>5MB) may take 30-60 seconds
- First run downloads Tesseract models (~65MB)
- Consider compressing images before upload

### Memory issues

- Tesseract uses ~200MB+ per worker
- Avoid processing multiple large images in parallel
- Call `Tesseract.terminate()` after processing

## Next Steps

1. ✅ Build the OCR module
2. Update imports in `app/dashboard/crew/page.tsx`
3. Test OCR upload functionality
4. Decide: Keep `lib/ocrUtils.ts` or remove it
5. Document custom extraction patterns for your use case
6. Consider publishing to npm if sharing with others

## Support

For issues or improvements to the OCR module, check:
- `modules/ocr-extractor/README.md` for full API documentation
- `modules/ocr-extractor/examples/` for code examples
- Tesseract.js documentation: https://github.com/naptha/tesserract.js
