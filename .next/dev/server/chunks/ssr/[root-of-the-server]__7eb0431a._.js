module.exports = [
"[project]/lib/formatters.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDateDDMMYYYY",
    ()=>formatDateDDMMYYYY,
    "formatINR",
    ()=>formatINR,
    "formatIndianNumber",
    ()=>formatIndianNumber,
    "formatUSD",
    ()=>formatUSD
]);
function formatINR(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
function formatIndianNumber(amount) {
    return amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function formatUSD(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
function formatDateDDMMYYYY(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
}
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/modules/ocr-extractor/dist/textExtractor.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractSalaryFromText = extractSalaryFromText;
exports.extractCustomField = extractCustomField;
exports.validateExtractedData = validateExtractedData;
/**
 * Extract salary information from OCR-recognized text
 * Uses regex patterns to identify and extract salary and employee data
 *
 * @param text - Raw text from OCR recognition
 * @returns ExtractedSalary object with parsed data
 */ function extractSalaryFromText(text) {
    const salaryData = {};
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
        nationality: /nationality\s*[=:]\s*([A-Za-z]+)/i
    };
    // Extract text details with logging
    Object.entries(detailPatterns).forEach(([key, pattern])=>{
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
                value = value.replace(/\s+/g, ''); // Remove all spaces for date
                value = value.replace(/(?<!\d)([-\/.\s])(?!\d)/g, ''); // Remove standalone delimiters
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
                salaryData[key] = value;
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
                console.log('[OCR] DEBUG nationality:', {
                    hasNationality,
                    hasNational,
                    hasCountry
                });
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
    const salaryPatterns = {
        basic_salary: /(?:Basic|Base)\s*(?:Wages?|Salary)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        fixed_overtime: /(?:Fixed|OT)\s*(?:Over[\s-]?time|OT)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        leave_wages: /Leave\s*Wages?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        other_allowances: /(?:Seniority|Other|Additional)\s*[/\w\s]*Allowances?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        travel_wages: /Travel\s*Wages?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        hra: /HRA.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        joining_expenses: /Joining\s*(?:Expenses?)?.*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i,
        onboard_allowance_short_manning: /(?:Onboard|Short[\s-]?Manning).*?[\s:=>]+(\d+(?:\.\d{1,2})?)/i
    };
    // Extract salary values using patterns
    Object.entries(salaryPatterns).forEach(([key, pattern])=>{
        const match = text.match(pattern);
        if (match && match[1]) {
            const value = parseFloat(match[1]);
            if (!isNaN(value)) {
                salaryData[key] = value;
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
 */ function extractCustomField(text, fieldName, pattern, isNumeric = false) {
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
 */ function validateExtractedData(salaryData) {
    const requiredFields = [
        'basic_salary',
        'fixed_overtime',
        'leave_wages',
        'other_allowances'
    ];
    const missingFields = requiredFields.filter((field)=>!(field in salaryData && salaryData[field] !== undefined));
    const warnings = [];
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
        warnings
    };
} //# sourceMappingURL=textExtractor.js.map
}),
"[project]/modules/ocr-extractor/dist/ocr.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processContractWithOCR = processContractWithOCR;
const tesseract_js_1 = __importDefault(__turbopack_context__.r("[project]/modules/ocr-extractor/node_modules/tesseract.js/src/index.js [app-ssr] (ecmascript)"));
const textExtractor_1 = __turbopack_context__.r("[project]/modules/ocr-extractor/dist/textExtractor.js [app-ssr] (ecmascript)");
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
 */ async function processContractWithOCR(file, options = {}) {
    const { language = 'eng', logProgress = false } = options;
    try {
        const reader = new FileReader();
        return new Promise((resolve)=>{
            reader.onload = async ()=>{
                try {
                    if (logProgress) {
                        console.log('[OCR] Starting Tesseract recognition...');
                    }
                    const result = await tesseract_js_1.default.recognize(reader.result, language, {
                        logger: (m)=>{
                            if (logProgress) {
                                console.log('[OCR] Progress:', m);
                            }
                        }
                    });
                    const extractedText = result.data.text;
                    const salaryData = (0, textExtractor_1.extractSalaryFromText)(extractedText);
                    if (logProgress) {
                        console.log('[OCR] Recognition completed');
                    }
                    resolve({
                        text: extractedText,
                        salaryData
                    });
                    // Clean up Tesseract worker
                    try {
                        await tesseract_js_1.default.terminate();
                    } catch (err) {
                    // Cleanup error ignored
                    }
                } catch (error) {
                    console.error('[OCR] Recognition error:', error);
                    resolve({
                        text: '',
                        salaryData: {},
                        error: error.message
                    });
                }
            };
            reader.onerror = ()=>{
                console.error('[OCR] File read error');
                resolve({
                    text: '',
                    salaryData: {},
                    error: 'Failed to read file'
                });
            };
            reader.readAsDataURL(file);
        });
    } catch (error) {
        console.error('[OCR] Outer error:', error);
        return {
            text: '',
            salaryData: {},
            error: error.message
        };
    }
} //# sourceMappingURL=ocr.js.map
}),
"[project]/modules/ocr-extractor/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @crewport/ocr-extractor
 *
 * OCR text extraction and salary data parsing module
 * Extracts employee and salary information from contract documents using Tesseract.js
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateExtractedData = exports.extractCustomField = exports.extractSalaryFromText = exports.processContractWithOCR = void 0;
var ocr_1 = __turbopack_context__.r("[project]/modules/ocr-extractor/dist/ocr.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "processContractWithOCR", {
    enumerable: true,
    get: function() {
        return ocr_1.processContractWithOCR;
    }
});
var textExtractor_1 = __turbopack_context__.r("[project]/modules/ocr-extractor/dist/textExtractor.js [app-ssr] (ecmascript)");
Object.defineProperty(exports, "extractSalaryFromText", {
    enumerable: true,
    get: function() {
        return textExtractor_1.extractSalaryFromText;
    }
});
Object.defineProperty(exports, "extractCustomField", {
    enumerable: true,
    get: function() {
        return textExtractor_1.extractCustomField;
    }
});
Object.defineProperty(exports, "validateExtractedData", {
    enumerable: true,
    get: function() {
        return textExtractor_1.validateExtractedData;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/app/dashboard/crew/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CrewManagement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/formatters.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$ocr$2d$extractor$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/ocr-extractor/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/context/VesselContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function CrewManagement() {
    const { selectedVessel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$VesselContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVessel"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('add');
    const [vessels, setVessels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [ranks, setRanks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [ports, setPorts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [crew, setCrew] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredCrew, setFilteredCrew] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSubmitLoading, setIsSubmitLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ocrProcessing, setOcrProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contractFileUrl, setContractFileUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('VESSEL');
    const [companyId, setCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1); // MOCK FOR NOW
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1); // MOCK FOR NOW
    const [approvingId, setApprovingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCrew, setSelectedCrew] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditingCrewDetails, setIsEditingCrewDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditingExit, setIsEditingExit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [crewEditData, setCrewEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        passport_number: '',
        nationality: '',
        date_of_birth: '',
        rank: '',
        sign_on_date: '',
        sign_on_port: '',
        basic_salary: '',
        fixed_overtime: '',
        leave_wages: '',
        other_allowances: '',
        joining_expenses: '',
        onboard_allowance_short_manning: ''
    });
    const [isCrewDetailsSaving, setIsCrewDetailsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exitEditData, setExitEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        sign_off_date: '',
        sign_off_port: '',
        exit_type: '',
        exit_remarks: ''
    });
    const [isExitSaving, setIsExitSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Sorting states
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('asc');
    // Filter states
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('All');
    const [vesselFilter, setVesselFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [editedSalary, setEditedSalary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [portSearchQuery, setPortSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPortDropdown, setShowPortDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rankSearchQuery, setRankSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showRankDropdown, setShowRankDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isOcrDataPopulated, setIsOcrDataPopulated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        // Personal Info
        passport_number: '',
        name: '',
        nationality: '',
        date_of_birth: '',
        contact_number: '',
        rank: '',
        position: '',
        vessel_id: '',
        sign_on_date: new Date().toISOString().split('T')[0],
        sign_on_port: '',
        contract_duration_months: '',
        tentative_sign_off_date: '',
        contract_file: null,
        // Salary Info
        basic_salary: '',
        fixed_overtime: '',
        leave_wages: '',
        other_allowances: '',
        travel_wages: '',
        hra: '',
        joining_expenses: '',
        onboard_allowance_short_manning: '',
        total_earnings: ''
    });
    const fetchData = async ()=>{
        if (!selectedVessel) return;
        setLoading(true);
        try {
            const [vesselsRes, ranksRes, portsRes, crewRes] = await Promise.all([
                fetch('/api/vessels'),
                fetch('/api/masters/ranks'),
                fetch('/api/masters/ports'),
                fetch('/api/crew', {
                    headers: {
                        'X-Vessel-Id': selectedVessel.vessel_id.toString()
                    }
                })
            ]);
            if (vesselsRes.ok) setVessels(await vesselsRes.json());
            if (ranksRes.ok) {
                const ranksData = await ranksRes.json();
                setRanks(ranksData);
            }
            if (portsRes.ok) {
                const portsData = await portsRes.json();
                setPorts(portsData.data || []);
            }
            if (crewRes.ok) {
                const crewData = await crewRes.json();
                setCrew(crewData);
                setFilteredCrew(crewData);
            }
        } catch (error) {
        // Error fetching data - handled silently
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const sessionStr = localStorage.getItem('crewport_session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            setUserRole(session.role);
        }
        fetchData();
    }, [
        selectedVessel
    ]);
    // Auto-populate vessel field with selected vessel from context
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedVessel) {
            setFormData((prev)=>({
                    ...prev,
                    vessel_id: selectedVessel.vessel_id.toString()
                }));
            // Auto-filter crew list by selected vessel when in list tab
            if (activeTab === 'list') {
                setVesselFilter(selectedVessel.vessel_id.toString());
            }
        }
    }, [
        selectedVessel,
        activeTab
    ]);
    // Auto-apply filters when crew data or filter criteria change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        applyFilters();
    }, [
        crew,
        vesselFilter,
        searchQuery,
        statusFilter,
        startDate,
        endDate
    ]);
    const calculateTotalEarnings = (data)=>{
        const salaryFields = [
            'basic_salary',
            'fixed_overtime',
            'leave_wages',
            'other_allowances',
            'travel_wages',
            'hra',
            'joining_expenses',
            'onboard_allowance_short_manning'
        ];
        const total = salaryFields.reduce((sum, field)=>{
            const value = parseFloat(data[field]) || 0;
            return sum + value;
        }, 0);
        return total > 0 ? total.toFixed(2) : '';
    };
    const calculateTentativeSignOffDate = (signOnDate, contractMonths)=>{
        if (!signOnDate || !contractMonths) return '';
        try {
            const months = parseInt(contractMonths);
            if (isNaN(months) || months <= 0) return '';
            const date = new Date(signOnDate);
            date.setMonth(date.getMonth() + months);
            return date.toISOString().split('T')[0];
        } catch  {
            return '';
        }
    };
    const isAtLeast18YearsOld = (dobString)=>{
        if (!dobString) return {
            valid: false,
            age: 0
        };
        try {
            const dob = new Date(dobString);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            // Adjust age if birthday hasn't occurred this year
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dob.getDate()) {
                age--;
            }
            return {
                valid: age >= 18,
                age
            };
        } catch  {
            return {
                valid: false,
                age: 0
            };
        }
    };
    const isValidSignOnDate = (dateString)=>{
        if (!dateString) return {
            valid: false,
            message: 'Sign on date is required'
        };
        try {
            const signOnDate = new Date(dateString);
            const today = new Date();
            // Check if date is in the future
            if (signOnDate > today) {
                return {
                    valid: false,
                    message: 'Sign on date cannot be a future date'
                };
            }
            // Check if date is in the same month and year
            if (signOnDate.getFullYear() !== today.getFullYear() || signOnDate.getMonth() !== today.getMonth()) {
                const monthName = signOnDate.toLocaleString('default', {
                    month: 'long'
                });
                const currentMonth = today.toLocaleString('default', {
                    month: 'long'
                });
                return {
                    valid: false,
                    message: `Sign on date must be in the current month (${currentMonth}), not ${monthName}`
                };
            }
            return {
                valid: true,
                message: ''
            };
        } catch  {
            return {
                valid: false,
                message: 'Invalid sign on date'
            };
        }
    };
    const getFilteredPorts = ()=>{
        if (!portSearchQuery.trim()) return ports;
        const query = portSearchQuery.toLowerCase();
        return ports.filter((port)=>port.name.toLowerCase().includes(query) || port.code?.toLowerCase().includes(query));
    };
    const getFilteredRanks = ()=>{
        if (!rankSearchQuery.trim()) return ranks;
        const query = rankSearchQuery.toLowerCase();
        return ranks.filter((rank)=>rank.rank_name.toLowerCase().includes(query) || rank.rank_code?.toLowerCase().includes(query));
    };
    const handleChange = (e)=>{
        let value = e.target.value;
        // Phone number validation - only allow digits and + symbol
        if (e.target.name === 'contact_number') {
            // Remove any characters that are not digits or + symbol
            value = value.replace(/[^\d+]/g, '');
            // Ensure + only appears at the beginning if present
            if (value.includes('+')) {
                const plusIndex = value.indexOf('+');
                if (plusIndex > 0) {
                    // Remove + from middle and add at beginning
                    value = '+' + value.replace(/\+/g, '');
                }
                // Ensure only one + at the beginning
                value = '+' + value.replace(/\+/g, '');
            }
        }
        const newFormData = {
            ...formData,
            [e.target.name]: value
        };
        // Auto-calculate total earnings if this is a salary field
        const salaryFields = [
            'basic_salary',
            'fixed_overtime',
            'leave_wages',
            'other_allowances',
            'travel_wages',
            'hra',
            'joining_expenses',
            'onboard_allowance_short_manning'
        ];
        if (salaryFields.includes(e.target.name)) {
            newFormData.total_earnings = calculateTotalEarnings(newFormData);
        }
        // Auto-calculate tentative sign-off date if contract duration or sign-on date changes
        if (e.target.name === 'contract_duration_months' || e.target.name === 'sign_on_date') {
            newFormData.tentative_sign_off_date = calculateTentativeSignOffDate(e.target.name === 'sign_on_date' ? e.target.value : newFormData.sign_on_date, e.target.name === 'contract_duration_months' ? e.target.value : newFormData.contract_duration_months);
        }
        setFormData(newFormData);
    };
    const handleContractUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        // Validate vessel is selected
        if (!selectedVessel) {
            alert('Please select a vessel first');
            return;
        }
        // Validate passport number is provided
        if (!formData.passport_number.trim()) {
            alert('Please enter Passport Number first');
            return;
        }
        // Validate file type (images only for OCR)
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG/PNG)');
            return;
        }
        // Check if OCR data was already populated - warn user
        if (isOcrDataPopulated) {
            const shouldClear = window.confirm('Previous OCR data was found. Uploading a new file will replace the existing populated fields (except Passport Number). Do you want to continue?');
            if (!shouldClear) return;
            // Clear previous OCR populated fields but keep Passport Number
            setFormData((prev)=>({
                    ...prev,
                    name: '',
                    date_of_birth: '',
                    nationality: '',
                    basic_salary: '',
                    fixed_overtime: '',
                    leave_wages: '',
                    other_allowances: '',
                    travel_wages: '',
                    hra: '',
                    joining_expenses: '',
                    onboard_allowance_short_manning: '',
                    total_earnings: ''
                }));
            setContractFileUrl('');
            setIsOcrDataPopulated(false);
        }
        setFormData({
            ...formData,
            contract_file: file
        });
        // Upload file to server with passport number as filename
        setOcrProcessing(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('passportNumber', formData.passport_number);
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: uploadFormData
            });
            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Failed to upload file');
            }
            // Store the file URL for display and submission
            const fileUrl = uploadData.url;
            setContractFileUrl(fileUrl);
            // Process OCR (optional - doesn't block crew creation)
            try {
                const { text, salaryData, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$ocr$2d$extractor$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processContractWithOCR"])(file);
                console.log('[OCR] Extracted data:', salaryData);
                console.log('[OCR] Error:', error);
                if (error || !salaryData) {
                    // OCR failed or no data extracted
                    alert('Contract file uploaded successfully. However, OCR could not extract employee data. Please fill in the details manually.');
                    setIsOcrDataPopulated(false);
                    return;
                }
                // Check if salaryData has meaningful contract data
                // Require: at least ONE personal field (name/DOB/nationality) AND at least ONE salary field
                const hasPersonalData = !!(salaryData.full_name || salaryData.date_of_birth || salaryData.nationality);
                const hasSalaryData = !!(salaryData.basic_salary || salaryData.fixed_overtime || salaryData.leave_wages || salaryData.other_allowances || salaryData.travel_wages || salaryData.hra || salaryData.joining_expenses || salaryData.onboard_allowance_short_manning);
                // Must have both personal data and salary data to be considered valid contract
                const hasExtractedData = hasPersonalData && hasSalaryData;
                if (!hasExtractedData) {
                    alert('Contract file uploaded successfully. However, no employee data could be extracted. Please fill in the details manually.');
                    setIsOcrDataPopulated(false);
                    return;
                }
                // Auto-fill fields with extracted data
                const updatedData = {
                    name: salaryData.full_name ? salaryData.full_name : formData.name,
                    date_of_birth: salaryData.date_of_birth ? salaryData.date_of_birth : formData.date_of_birth,
                    nationality: salaryData.nationality ? salaryData.nationality : formData.nationality,
                    basic_salary: salaryData.basic_salary ? String(salaryData.basic_salary) : formData.basic_salary,
                    fixed_overtime: salaryData.fixed_overtime ? String(salaryData.fixed_overtime) : formData.fixed_overtime,
                    leave_wages: salaryData.leave_wages ? String(salaryData.leave_wages) : formData.leave_wages,
                    other_allowances: salaryData.other_allowances ? String(salaryData.other_allowances) : formData.other_allowances,
                    travel_wages: salaryData.travel_wages ? String(salaryData.travel_wages) : formData.travel_wages,
                    hra: salaryData.hra ? String(salaryData.hra) : formData.hra,
                    joining_expenses: salaryData.joining_expenses ? String(salaryData.joining_expenses) : formData.joining_expenses,
                    onboard_allowance_short_manning: salaryData.onboard_allowance_short_manning ? String(salaryData.onboard_allowance_short_manning) : formData.onboard_allowance_short_manning
                };
                console.log('[OCR] Updated form data:', updatedData);
                setFormData((prev)=>({
                        ...prev,
                        ...updatedData,
                        total_earnings: calculateTotalEarnings({
                            ...prev,
                            ...updatedData
                        })
                    }));
                setIsOcrDataPopulated(true);
                alert('Contract uploaded successfully! Employee details and salary fields have been auto-filled.');
            } catch (ocrError) {
                // OCR processing failed
                console.error('[OCR] Processing error:', ocrError);
                alert('Contract file uploaded successfully. However, OCR processing failed. Please fill in the employee details manually.');
                setIsOcrDataPopulated(false);
            }
        } catch (error) {
            alert(error.message || 'Error uploading contract');
            setIsOcrDataPopulated(false);
        } finally{
            setOcrProcessing(false);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Validate required fields
        if (!formData.name.trim()) {
            alert('Crew name is required');
            return;
        }
        if (!formData.vessel_id) {
            alert('Please select a vessel');
            return;
        }
        // Validate age (at least 18 years old)
        if (formData.date_of_birth) {
            const { valid: isValidAge, age } = isAtLeast18YearsOld(formData.date_of_birth);
            if (!isValidAge) {
                alert(`Crew member must be at least 18 years old. Current age: ${age} years.`);
                return;
            }
        }
        // Validate sign on date (must be same month and not future date)
        if (formData.sign_on_date) {
            const { valid: isValidDate, message } = isValidSignOnDate(formData.sign_on_date);
            if (!isValidDate) {
                alert(message);
                return;
            }
        }
        setIsSubmitLoading(true);
        try {
            if (!selectedVessel) {
                alert('Please select a vessel first');
                return;
            }
            // Create payload without contract_file (used only for OCR)
            const { contract_file, ...dataWithoutFile } = formData;
            const payload = {
                ...dataWithoutFile,
                contract_file: contractFileUrl,
                company_id: companyId,
                created_by: userId
            };
            const response = await fetch('/api/crew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add crew member');
            }
            alert('Crew member added successfully. Pending admin verification.');
            // Refresh crew list
            fetchData();
            // Reset form
            setFormData({
                passport_number: '',
                name: '',
                nationality: '',
                date_of_birth: '',
                contact_number: '',
                rank: '',
                position: '',
                vessel_id: selectedVessel?.vessel_id.toString() || '',
                sign_on_date: new Date().toISOString().split('T')[0],
                sign_on_port: '',
                contract_duration_months: '',
                tentative_sign_off_date: '',
                contract_file: null,
                basic_salary: '',
                fixed_overtime: '',
                leave_wages: '',
                other_allowances: '',
                travel_wages: '',
                hra: '',
                joining_expenses: '',
                onboard_allowance_short_manning: '',
                total_earnings: ''
            });
            setContractFileUrl('');
            setIsOcrDataPopulated(false);
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error adding crew member');
        } finally{
            setIsSubmitLoading(false);
        }
    };
    const handleApprove = async (id)=>{
        if (!selectedVessel) return;
        setApprovingId(id);
        try {
            const response = await fetch(`/api/crew/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    status: 'APPROVED',
                    crew_status: 'ACTIVE',
                    verified_by: userId
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to approve crew member');
            }
            alert('Crew member approved successfully!');
            // Refresh crew list
            fetchData();
            // Also update local state for immediate UI update
            const updatedCrew = crew.map((member)=>member.id === id ? {
                    ...member,
                    onboarding_status: 'APPROVED',
                    crew_status: 'ACTIVE'
                } : member);
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);
            // Close modal
            setSelectedCrew(null);
        } catch (error) {
            alert(error.message || 'Error approving crew member');
        } finally{
            setApprovingId(null);
        }
    };
    const handleEditExit = ()=>{
        if (selectedCrew) {
            setExitEditData({
                sign_off_date: selectedCrew.sign_off_date ? selectedCrew.sign_off_date.split('T')[0] : '',
                sign_off_port: selectedCrew.sign_off_port || '',
                exit_type: selectedCrew.exit_type || '',
                exit_remarks: selectedCrew.exit_remarks || ''
            });
            setIsEditingExit(true);
        }
    };
    const handleCancelEditExit = ()=>{
        setIsEditingExit(false);
        setExitEditData({
            sign_off_date: '',
            sign_off_port: '',
            exit_type: '',
            exit_remarks: ''
        });
    };
    const handleSaveExit = async ()=>{
        if (!selectedCrew || !selectedVessel) return;
        // Validate that at least sign_off_date is provided
        if (!exitEditData.sign_off_date.trim()) {
            alert('Please enter an exit date');
            return;
        }
        // Validate exit type
        if (!exitEditData.exit_type.trim()) {
            alert('Please select an exit type');
            return;
        }
        // Validate remarks for break contract
        if (exitEditData.exit_type === 'BREAK_CONTRACT' && !exitEditData.exit_remarks.trim()) {
            alert('Please provide remarks for contract break');
            return;
        }
        setIsExitSaving(true);
        try {
            const response = await fetch(`/api/crew/${selectedCrew.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    sign_off_date: exitEditData.sign_off_date,
                    sign_off_port: exitEditData.sign_off_port || '',
                    exit_type: exitEditData.exit_type,
                    exit_remarks: exitEditData.exit_remarks || '',
                    crew_status: 'COMPLETED'
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to update exit details');
            }
            alert('Exit details updated successfully!');
            // Update the selected crew state
            setSelectedCrew({
                ...selectedCrew,
                sign_off_date: exitEditData.sign_off_date,
                sign_off_port: exitEditData.sign_off_port,
                exit_type: exitEditData.exit_type,
                exit_remarks: exitEditData.exit_remarks,
                crew_status: 'COMPLETED'
            });
            // Update crew list
            const updatedCrew = crew.map((member)=>member.id === selectedCrew.id ? {
                    ...member,
                    sign_off_date: exitEditData.sign_off_date,
                    sign_off_port: exitEditData.sign_off_port,
                    exit_type: exitEditData.exit_type,
                    exit_remarks: exitEditData.exit_remarks,
                    crew_status: 'COMPLETED'
                } : member);
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);
            setIsEditingExit(false);
        } catch (error) {
            alert(error.message || 'Error updating exit details');
        } finally{
            setIsExitSaving(false);
        }
    };
    const handleEditCrewDetails = ()=>{
        if (selectedCrew) {
            setCrewEditData({
                name: selectedCrew.name || '',
                passport_number: selectedCrew.passport_number || '',
                nationality: selectedCrew.nationality || '',
                date_of_birth: selectedCrew.date_of_birth ? selectedCrew.date_of_birth.split('T')[0] : '',
                rank: selectedCrew.rank || '',
                sign_on_date: selectedCrew.sign_on_date ? selectedCrew.sign_on_date.split('T')[0] : '',
                sign_on_port: selectedCrew.sign_on_port || '',
                basic_salary: selectedCrew.basic_salary ? String(selectedCrew.basic_salary) : '',
                fixed_overtime: selectedCrew.fixed_overtime ? String(selectedCrew.fixed_overtime) : '',
                leave_wages: selectedCrew.leave_wages ? String(selectedCrew.leave_wages) : '',
                other_allowances: selectedCrew.other_allowances ? String(selectedCrew.other_allowances) : '',
                joining_expenses: selectedCrew.joining_expenses ? String(selectedCrew.joining_expenses) : '',
                onboard_allowance_short_manning: selectedCrew.onboard_allowance_short_manning ? String(selectedCrew.onboard_allowance_short_manning) : ''
            });
            setIsEditingCrewDetails(true);
        }
    };
    const handleCancelEditCrewDetails = ()=>{
        setIsEditingCrewDetails(false);
        setCrewEditData({
            name: '',
            passport_number: '',
            nationality: '',
            date_of_birth: '',
            rank: '',
            sign_on_date: '',
            sign_on_port: '',
            basic_salary: '',
            fixed_overtime: '',
            leave_wages: '',
            other_allowances: '',
            joining_expenses: '',
            onboard_allowance_short_manning: ''
        });
    };
    const handleSaveCrewDetails = async ()=>{
        if (!selectedCrew || !selectedVessel) return;
        // Validate required fields
        if (!crewEditData.name.trim()) {
            alert('Please enter crew name');
            return;
        }
        setIsCrewDetailsSaving(true);
        try {
            const response = await fetch(`/api/crew/${selectedCrew.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    name: crewEditData.name,
                    passport_number: crewEditData.passport_number,
                    nationality: crewEditData.nationality,
                    date_of_birth: crewEditData.date_of_birth,
                    rank: crewEditData.rank,
                    sign_on_date: crewEditData.sign_on_date,
                    sign_on_port: crewEditData.sign_on_port,
                    basic_salary: crewEditData.basic_salary ? parseFloat(crewEditData.basic_salary) : null,
                    fixed_overtime: crewEditData.fixed_overtime ? parseFloat(crewEditData.fixed_overtime) : null,
                    leave_wages: crewEditData.leave_wages ? parseFloat(crewEditData.leave_wages) : null,
                    other_allowances: crewEditData.other_allowances ? parseFloat(crewEditData.other_allowances) : null,
                    joining_expenses: crewEditData.joining_expenses ? parseFloat(crewEditData.joining_expenses) : null,
                    onboard_allowance_short_manning: crewEditData.onboard_allowance_short_manning ? parseFloat(crewEditData.onboard_allowance_short_manning) : null
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to update crew details');
            }
            alert('Crew details updated successfully!');
            // Update the selected crew state
            setSelectedCrew({
                ...selectedCrew,
                name: crewEditData.name,
                passport_number: crewEditData.passport_number,
                nationality: crewEditData.nationality,
                date_of_birth: crewEditData.date_of_birth,
                rank: crewEditData.rank,
                sign_on_date: crewEditData.sign_on_date,
                sign_on_port: crewEditData.sign_on_port,
                basic_salary: crewEditData.basic_salary ? parseFloat(crewEditData.basic_salary) : null,
                fixed_overtime: crewEditData.fixed_overtime ? parseFloat(crewEditData.fixed_overtime) : null,
                leave_wages: crewEditData.leave_wages ? parseFloat(crewEditData.leave_wages) : null,
                other_allowances: crewEditData.other_allowances ? parseFloat(crewEditData.other_allowances) : null,
                joining_expenses: crewEditData.joining_expenses ? parseFloat(crewEditData.joining_expenses) : null,
                onboard_allowance_short_manning: crewEditData.onboard_allowance_short_manning ? parseFloat(crewEditData.onboard_allowance_short_manning) : null
            });
            // Update crew list
            const updatedCrew = crew.map((member)=>member.id === selectedCrew.id ? {
                    ...member,
                    name: crewEditData.name,
                    passport_number: crewEditData.passport_number,
                    nationality: crewEditData.nationality,
                    date_of_birth: crewEditData.date_of_birth,
                    rank: crewEditData.rank,
                    sign_on_date: crewEditData.sign_on_date,
                    sign_on_port: crewEditData.sign_on_port,
                    basic_salary: crewEditData.basic_salary ? parseFloat(crewEditData.basic_salary) : null,
                    fixed_overtime: crewEditData.fixed_overtime ? parseFloat(crewEditData.fixed_overtime) : null,
                    leave_wages: crewEditData.leave_wages ? parseFloat(crewEditData.leave_wages) : null,
                    other_allowances: crewEditData.other_allowances ? parseFloat(crewEditData.other_allowances) : null,
                    joining_expenses: crewEditData.joining_expenses ? parseFloat(crewEditData.joining_expenses) : null,
                    onboard_allowance_short_manning: crewEditData.onboard_allowance_short_manning ? parseFloat(crewEditData.onboard_allowance_short_manning) : null
                } : member);
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);
            setIsEditingCrewDetails(false);
        } catch (error) {
            alert(error.message || 'Error updating crew details');
        } finally{
            setIsCrewDetailsSaving(false);
        }
    };
    const getCrewStatus = (member)=>{
        const status = member.crew_status || 'NEW';
        switch(status){
            case 'NEW':
                return {
                    status: 'New',
                    color: 'bg-blue-100 text-blue-800'
                };
            case 'ACTIVE':
                return {
                    status: 'Active',
                    color: 'bg-green-100 text-green-800'
                };
            case 'COMPLETED':
                return {
                    status: 'Completed',
                    color: 'bg-purple-100 text-purple-800'
                };
            case 'IN_ACTIVE':
                return {
                    status: 'In-Active',
                    color: 'bg-gray-100 text-gray-800'
                };
            default:
                return {
                    status: 'New',
                    color: 'bg-blue-100 text-blue-800'
                };
        }
    };
    const applyFilters = ()=>{
        let filtered = crew;
        // Search filter (by name or passport)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((member)=>member.name.toLowerCase().includes(query) || member.passport_number?.toLowerCase().includes(query) || false);
        }
        // Vessel filter
        if (vesselFilter) {
            filtered = filtered.filter((member)=>member.vessel_id.toString() === vesselFilter);
        }
        // Status filter
        if (statusFilter !== 'All') {
            filtered = filtered.filter((member)=>member.crew_status === statusFilter);
        }
        // Start date filter (sign_on_date)
        if (startDate) {
            filtered = filtered.filter((member)=>{
                if (!member.sign_on_date) return false;
                const memberDate = new Date(member.sign_on_date);
                const filterDate = new Date(startDate);
                return memberDate >= filterDate;
            });
        }
        // End date filter (sign_on_date)
        if (endDate) {
            filtered = filtered.filter((member)=>{
                if (!member.sign_on_date) return false;
                const memberDate = new Date(member.sign_on_date);
                const filterDate = new Date(endDate);
                return memberDate <= filterDate;
            });
        }
        setFilteredCrew(filtered);
    };
    const clearFilters = ()=>{
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setStatusFilter('All');
        setVesselFilter('');
        setSortBy(null);
        setSortOrder('asc');
        setFilteredCrew(crew);
    };
    const handleSort = (column)=>{
        // If clicking the same column, toggle order; otherwise set new column with asc order
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };
    const getSortedCrew = ()=>{
        if (!sortBy) return filteredCrew;
        const sorted = [
            ...filteredCrew
        ].sort((a, b)=>{
            let aValue;
            let bValue;
            if (sortBy === 'name') {
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
            } else if (sortBy === 'passport_number') {
                aValue = (a.passport_number || '').toLowerCase();
                bValue = (b.passport_number || '').toLowerCase();
            } else if (sortBy === 'rank') {
                aValue = (a.rank || '').toLowerCase();
                bValue = (b.rank || '').toLowerCase();
            } else {
                return 0;
            }
            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        return sorted;
    };
    const exportToExcel = ()=>{
        const dataToExport = getSortedCrew();
        if (dataToExport.length === 0) {
            alert('No crew members to export');
            return;
        }
        const exportData = dataToExport.map((member)=>({
                'Vessel': member.vessels?.vessel_name || '-',
                'Passport No': member.passport_number || '-',
                'Name': member.name,
                'Rank': member.rank || '-',
                'Nationality': member.nationality || '-',
                'DOB': member.date_of_birth ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(member.date_of_birth) : '-',
                'Sign On Date': member.sign_on_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(member.sign_on_date) : '-',
                'Sign On Port': member.sign_on_port || '-',
                'Sign Off Date': member.sign_off_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(member.sign_off_date) : '-',
                'Sign Off Port': member.sign_off_port || '-',
                'Status': getCrewStatus(member).status,
                'Basic Salary': member.basic_salary || '-',
                'Fixed Overtime': member.fixed_overtime || '-',
                'Leave Wages': member.leave_wages || '-',
                'Other Allowances': member.other_allowances || '-',
                'Travel Wages': member.travel_wages || '-',
                'HRA': member.hra || '-',
                'Joining Expenses': member.joining_expenses || '-',
                'Onboard Allowance': member.onboard_allowance_short_manning || '-',
                'Total Earnings': member.total_earnings || '-'
            }));
        const worksheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(exportData);
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_new();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(workbook, worksheet, 'Crew Members');
        // Set column widths
        worksheet['!cols'] = [
            {
                wch: 15
            },
            {
                wch: 12
            },
            {
                wch: 15
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 10
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 15
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 12
            },
            {
                wch: 15
            },
            {
                wch: 15
            }
        ];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writeFile"](workbook, `Crew_Members_${new Date().getTime()}.xlsx`);
    };
    const openCrewDetails = (member)=>{
        setSelectedCrew(member);
        // Initialize edited salary with current values
        setEditedSalary({
            basic_salary: member.basic_salary?.toString() || '',
            fixed_overtime: member.fixed_overtime?.toString() || '',
            leave_wages: member.leave_wages?.toString() || '',
            other_allowances: member.other_allowances?.toString() || '',
            travel_wages: member.travel_wages?.toString() || '',
            hra: member.hra?.toString() || '',
            joining_expenses: member.joining_expenses?.toString() || '',
            onboard_allowance_short_manning: member.onboard_allowance_short_manning?.toString() || ''
        });
    };
    const calculateEditedTotalEarnings = ()=>{
        if (!editedSalary) return 0;
        const fields = [
            'basic_salary',
            'fixed_overtime',
            'leave_wages',
            'other_allowances',
            'travel_wages',
            'hra',
            'joining_expenses',
            'onboard_allowance_short_manning'
        ];
        return fields.reduce((sum, field)=>{
            const value = parseFloat(editedSalary[field]) || 0;
            return sum + value;
        }, 0);
    };
    const handleSalaryChange = (field, value)=>{
        if (!editedSalary) return;
        setEditedSalary({
            ...editedSalary,
            [field]: value
        });
    };
    const saveSalaryChanges = async ()=>{
        if (!selectedCrew || !editedSalary || !selectedVessel) return;
        try {
            const response = await fetch(`/api/crew/${selectedCrew.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': selectedVessel.vessel_id.toString()
                },
                body: JSON.stringify({
                    basic_salary: editedSalary.basic_salary ? parseFloat(editedSalary.basic_salary) : null,
                    fixed_overtime: editedSalary.fixed_overtime ? parseFloat(editedSalary.fixed_overtime) : null,
                    leave_wages: editedSalary.leave_wages ? parseFloat(editedSalary.leave_wages) : null,
                    other_allowances: editedSalary.other_allowances ? parseFloat(editedSalary.other_allowances) : null,
                    travel_wages: editedSalary.travel_wages ? parseFloat(editedSalary.travel_wages) : null,
                    hra: editedSalary.hra ? parseFloat(editedSalary.hra) : null,
                    joining_expenses: editedSalary.joining_expenses ? parseFloat(editedSalary.joining_expenses) : null,
                    onboard_allowance_short_manning: editedSalary.onboard_allowance_short_manning ? parseFloat(editedSalary.onboard_allowance_short_manning) : null,
                    total_earnings: calculateEditedTotalEarnings()
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save salary details');
            }
            alert('Salary details updated successfully!');
            // Update local state
            const updatedCrew = crew.map((member)=>member.id === selectedCrew.id ? {
                    ...member,
                    basic_salary: parseFloat(editedSalary.basic_salary) || null,
                    fixed_overtime: parseFloat(editedSalary.fixed_overtime) || null,
                    leave_wages: parseFloat(editedSalary.leave_wages) || null,
                    other_allowances: parseFloat(editedSalary.other_allowances) || null,
                    travel_wages: parseFloat(editedSalary.travel_wages) || null,
                    hra: parseFloat(editedSalary.hra) || null,
                    joining_expenses: parseFloat(editedSalary.joining_expenses) || null,
                    onboard_allowance_short_manning: parseFloat(editedSalary.onboard_allowance_short_manning) || null,
                    total_earnings: calculateEditedTotalEarnings()
                } : member);
            setCrew(updatedCrew);
            setFilteredCrew(updatedCrew);
            setSelectedCrew(updatedCrew.find((m)=>m.id === selectedCrew.id) || null);
        } catch (error) {
            alert(error.message || 'Error saving salary details');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-gray-900 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mr-3 text-blue-600",
                            children: "👥"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/crew/page.tsx",
                            lineNumber: 1170,
                            columnNumber: 21
                        }, this),
                        "Crew Management"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/crew/page.tsx",
                    lineNumber: 1169,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/crew/page.tsx",
                lineNumber: 1168,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-sm border border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('add'),
                            className: `flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'add' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`,
                            children: "➕ Add New Crew Member"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/crew/page.tsx",
                            lineNumber: 1178,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('list'),
                            className: `flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`,
                            children: "👁️ View Crew List"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/crew/page.tsx",
                            lineNumber: 1188,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/crew/page.tsx",
                    lineNumber: 1177,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/crew/page.tsx",
                lineNumber: 1176,
                columnNumber: 13
            }, this),
            activeTab === 'add' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-medium text-gray-900 mb-6",
                        children: "Add New Crew Member"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/crew/page.tsx",
                        lineNumber: 1204,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b pb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-md font-semibold text-gray-800 mb-4",
                                        children: "Personal Info"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Passport No *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1213,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "passport_number",
                                                        required: true,
                                                        value: formData.passport_number,
                                                        onChange: handleChange,
                                                        placeholder: "Passport Number",
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1214,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1212,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Name *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1225,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "name",
                                                        required: true,
                                                        value: formData.name,
                                                        onChange: handleChange,
                                                        placeholder: "Full Name",
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1226,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1224,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Nationality"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1237,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "nationality",
                                                        value: formData.nationality,
                                                        onChange: handleChange,
                                                        placeholder: "Nationality",
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1238,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1236,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Date of Birth"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1248,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "date",
                                                                name: "date_of_birth",
                                                                value: formData.date_of_birth,
                                                                onChange: handleChange,
                                                                className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1250,
                                                                columnNumber: 37
                                                            }, this),
                                                            formData.date_of_birth && (()=>{
                                                                const { valid: isValidAge, age } = isAtLeast18YearsOld(formData.date_of_birth);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `mt-1 text-xs font-medium ${isValidAge ? 'text-green-600' : 'text-red-600'}`,
                                                                    children: isValidAge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            "✓ Age: ",
                                                                            age,
                                                                            " years (Valid)"
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            "✗ Age: ",
                                                                            age,
                                                                            " years (Must be 18+)"
                                                                        ]
                                                                    }, void 0, true)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1261,
                                                                    columnNumber: 49
                                                                }, this);
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1249,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1247,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1211,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Rank"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1278,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Search rank by name or code...",
                                                                value: formData.rank === '' ? rankSearchQuery : rankSearchQuery || formData.rank,
                                                                onChange: (e)=>{
                                                                    setRankSearchQuery(e.target.value);
                                                                    setShowRankDropdown(true);
                                                                },
                                                                onFocus: ()=>setShowRankDropdown(true),
                                                                onBlur: ()=>setTimeout(()=>setShowRankDropdown(false), 200),
                                                                className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1280,
                                                                columnNumber: 37
                                                            }, this),
                                                            showRankDropdown && getFilteredRanks().length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto",
                                                                children: getFilteredRanks().map((rank)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setFormData((prev)=>({
                                                                                    ...prev,
                                                                                    rank: rank.rank_name
                                                                                }));
                                                                            setRankSearchQuery('');
                                                                            setShowRankDropdown(false);
                                                                        },
                                                                        className: "w-full text-left px-3 py-2 hover:bg-blue-50 text-sm transition-colors",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium",
                                                                            children: [
                                                                                rank.rank_code,
                                                                                " | ",
                                                                                rank.rank_name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 1308,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    }, rank.id, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1295,
                                                                        columnNumber: 49
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1293,
                                                                columnNumber: 41
                                                            }, this),
                                                            formData.rank && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700",
                                                                children: [
                                                                    "Selected: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: formData.rank
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1315,
                                                                        columnNumber: 55
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setFormData((prev)=>({
                                                                                    ...prev,
                                                                                    rank: ''
                                                                                }));
                                                                            setRankSearchQuery('');
                                                                        },
                                                                        className: "ml-2 text-blue-600 hover:text-blue-800 text-xs font-semibold",
                                                                        children: "Clear"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1316,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1314,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1279,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1277,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Position"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1334,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "position",
                                                        value: formData.position,
                                                        onChange: handleChange,
                                                        placeholder: "Job Title/Position",
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1335,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1333,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Contact Number"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1345,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "contact_number",
                                                                value: formData.contact_number,
                                                                onChange: handleChange,
                                                                placeholder: "e.g., +91 9876543210 or 9876543210",
                                                                className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1347,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-xs text-gray-500",
                                                                children: "Only digits and '+' symbol allowed (e.g., +919876543210)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1355,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1346,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1344,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Vessel *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1359,
                                                        columnNumber: 33
                                                    }, this),
                                                    selectedVessel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 px-3 py-2 border border-gray-300 rounded-md bg-blue-50 text-gray-900 text-sm font-medium flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: selectedVessel.vessel_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1362,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-blue-600 font-semibold",
                                                                children: "Auto-selected"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1363,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1361,
                                                        columnNumber: 37
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        name: "vessel_id",
                                                        required: true,
                                                        value: formData.vessel_id,
                                                        onChange: handleChange,
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Select Vessel"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1373,
                                                                columnNumber: 41
                                                            }, this),
                                                            vessels.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: v.id,
                                                                    children: v.vessel_name
                                                                }, v.id, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1375,
                                                                    columnNumber: 45
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1358,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1276,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Sign On Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1385,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "date",
                                                                name: "sign_on_date",
                                                                value: formData.sign_on_date,
                                                                onChange: handleChange,
                                                                className: `mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formData.sign_on_date ? isValidSignOnDate(formData.sign_on_date).valid ? 'border-green-300' : 'border-red-300' : 'border-gray-300'}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1387,
                                                                columnNumber: 37
                                                            }, this),
                                                            formData.sign_on_date && (()=>{
                                                                const { valid, message } = isValidSignOnDate(formData.sign_on_date);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `mt-1 text-xs font-medium ${valid ? 'text-green-600' : 'text-red-600'}`,
                                                                    children: valid ? '✓ Valid date' : `✗ ${message}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1404,
                                                                    columnNumber: 49
                                                                }, this);
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1386,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1384,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Sign On Port"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1413,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Search port...",
                                                                value: formData.sign_on_port === '' ? portSearchQuery : portSearchQuery || formData.sign_on_port,
                                                                onChange: (e)=>{
                                                                    setPortSearchQuery(e.target.value);
                                                                    setShowPortDropdown(true);
                                                                },
                                                                onFocus: ()=>setShowPortDropdown(true),
                                                                onBlur: ()=>setTimeout(()=>setShowPortDropdown(false), 200),
                                                                className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1415,
                                                                columnNumber: 37
                                                            }, this),
                                                            showPortDropdown && getFilteredPorts().length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto",
                                                                children: getFilteredPorts().map((port)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setFormData((prev)=>({
                                                                                    ...prev,
                                                                                    sign_on_port: port.name
                                                                                }));
                                                                            setPortSearchQuery('');
                                                                            setShowPortDropdown(false);
                                                                        },
                                                                        className: "w-full text-left px-3 py-2 hover:bg-blue-50 text-sm transition-colors",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-medium",
                                                                                children: port.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                lineNumber: 1443,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            port.code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: port.code
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                lineNumber: 1444,
                                                                                columnNumber: 67
                                                                            }, this)
                                                                        ]
                                                                    }, port.id, true, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1430,
                                                                        columnNumber: 49
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1428,
                                                                columnNumber: 41
                                                            }, this),
                                                            formData.sign_on_port && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700",
                                                                children: [
                                                                    "Selected: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: formData.sign_on_port
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1451,
                                                                        columnNumber: 55
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setFormData((prev)=>({
                                                                                    ...prev,
                                                                                    sign_on_port: ''
                                                                                }));
                                                                            setPortSearchQuery('');
                                                                        },
                                                                        className: "ml-2 text-blue-600 hover:text-blue-800 text-xs font-semibold",
                                                                        children: "Clear"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1452,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1450,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1414,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1412,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Contract Duration (Months) *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        name: "contract_duration_months",
                                                        value: formData.contract_duration_months,
                                                        onChange: handleChange,
                                                        min: "1",
                                                        placeholder: "e.g., 12",
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1471,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1469,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Tentative Sign Off Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1482,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        name: "tentative_sign_off_date",
                                                        value: formData.tentative_sign_off_date,
                                                        readOnly: true,
                                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1483,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1481,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1383,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1207,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-md font-semibold text-gray-800 mb-4",
                                        children: "Salary"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1496,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-5 gap-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Basic"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1501,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1503,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "basic_salary",
                                                                value: formData.basic_salary,
                                                                onChange: handleChange,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1504,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1502,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1500,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Fixed OT"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1516,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1518,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "fixed_overtime",
                                                                value: formData.fixed_overtime,
                                                                onChange: handleChange,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1519,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1517,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1515,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Leave Wages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1531,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1533,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "leave_wages",
                                                                value: formData.leave_wages,
                                                                onChange: handleChange,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1534,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1532,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1530,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Other Allowances"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1546,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1548,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "other_allowances",
                                                                value: formData.other_allowances,
                                                                onChange: handleChange,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1549,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1547,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1545,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Total Earnings (Auto)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1561,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1563,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "total_earnings",
                                                                value: formData.total_earnings,
                                                                readOnly: true,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1564,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1562,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1560,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1499,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-5 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Travel Wages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1580,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1582,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "travel_wages",
                                                                value: formData.travel_wages,
                                                                readOnly: true,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1583,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1581,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1579,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "HRA"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1595,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1597,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "hra",
                                                                value: formData.hra,
                                                                readOnly: true,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1598,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1596,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1594,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Joining Exp"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1610,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1612,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "joining_expenses",
                                                                value: formData.joining_expenses,
                                                                onChange: handleChange,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1613,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1611,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1609,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700",
                                                        children: "Onboard Allowance / Short Manning"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1625,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                children: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1627,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                name: "onboard_allowance_short_manning",
                                                                value: formData.onboard_allowance_short_manning,
                                                                onChange: handleChange,
                                                                placeholder: "0.00",
                                                                step: "0.01",
                                                                className: "block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1628,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1626,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1624,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1578,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1495,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-md font-semibold text-gray-800 mb-4",
                                            children: "Contract Document"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1645,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 mb-4",
                                            children: "💡 Tip: Upload a contract image to auto-fill Full Name, Date of Birth, Nationality, and all salary fields using OCR"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1646,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-2",
                                            children: "Upload Contract Copy"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1647,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    accept: "image/*",
                                                    onChange: handleContractUpload,
                                                    disabled: ocrProcessing,
                                                    className: "block w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1649,
                                                    columnNumber: 33
                                                }, this),
                                                ocrProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "animate-spin h-4 w-4 border border-blue-500 rounded-full border-t-transparent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1658,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-blue-600",
                                                            children: "Processing..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1659,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1657,
                                                    columnNumber: 37
                                                }, this),
                                                formData.contract_file && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-green-600",
                                                            children: [
                                                                "✓ File: ",
                                                                formData.contract_file.name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1664,
                                                            columnNumber: 41
                                                        }, this),
                                                        contractFileUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border border-gray-300 rounded-lg p-2 bg-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-medium text-gray-700 mb-1",
                                                                    children: "Preview:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1667,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: contractFileUrl,
                                                                    alt: "Contract",
                                                                    className: "max-w-xs max-h-40 rounded border border-gray-300 mb-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1668,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: contractFileUrl,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "text-xs text-blue-600 hover:text-blue-800 underline block",
                                                                    children: "View Full Image →"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1673,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1666,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1663,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1648,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 1644,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1643,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t pt-6 flex gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isSubmitLoading,
                                    className: "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium text-sm disabled:opacity-50 transition-colors",
                                    children: isSubmitLoading ? 'Adding...' : 'Add Crew Member'
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 1691,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1690,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/crew/page.tsx",
                        lineNumber: 1205,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/crew/page.tsx",
                lineNumber: 1203,
                columnNumber: 13
            }, this),
            activeTab === 'list' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-900 mb-4",
                                children: "Crew Filters"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1708,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Search"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1713,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Name or Passport No...",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1714,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1712,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Vessel"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1725,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: vesselFilter,
                                                        onChange: (e)=>setVesselFilter(e.target.value),
                                                        disabled: !!selectedVessel,
                                                        className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "All Vessels"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1733,
                                                                columnNumber: 37
                                                            }, this),
                                                            vessels.map((vessel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: vessel.id.toString(),
                                                                    children: vessel.vessel_name
                                                                }, vessel.id, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1735,
                                                                    columnNumber: 41
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1727,
                                                        columnNumber: 33
                                                    }, this),
                                                    selectedVessel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "absolute right-10 top-2 text-xs text-blue-600 font-semibold",
                                                        children: "Auto-filtered"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1739,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1726,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1724,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Start Date (DD/MM/YYYY)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1746,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: startDate,
                                                onChange: (e)=>setStartDate(e.target.value),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1747,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1745,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "End Date (DD/MM/YYYY)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1757,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: endDate,
                                                onChange: (e)=>setEndDate(e.target.value),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1758,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1756,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1768,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: statusFilter,
                                                onChange: (e)=>setStatusFilter(e.target.value),
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "All",
                                                        children: "All"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1774,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "NEW",
                                                        children: "New"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1775,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "ACTIVE",
                                                        children: "Active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1776,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "COMPLETED",
                                                        children: "Completed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1777,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "IN_ACTIVE",
                                                        children: "In-Active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1778,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1769,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1767,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1710,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: clearFilters,
                                        className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium text-sm transition-colors",
                                        children: "Clear Filters"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1785,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: applyFilters,
                                        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors",
                                        children: "Apply Filters"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1791,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: exportToExcel,
                                        className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors",
                                        children: "📥 Download Excel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1797,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto text-sm text-gray-600 py-2",
                                        children: [
                                            "Showing ",
                                            filteredCrew.length,
                                            " of ",
                                            crew.length,
                                            " crew member(s)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1803,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1784,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/crew/page.tsx",
                        lineNumber: 1707,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-medium text-gray-900",
                                        children: "All Crew Members"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1812,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-600",
                                        children: [
                                            crew.length,
                                            " crew member(s)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                        lineNumber: 1813,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1811,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "min-w-full divide-y divide-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "bg-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Vessel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1819,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        onClick: ()=>handleSort('passport_number'),
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                        children: [
                                                            "Passport No ",
                                                            sortBy === 'passport_number' && (sortOrder === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1820,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        onClick: ()=>handleSort('name'),
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                        children: [
                                                            "Name ",
                                                            sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1826,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        onClick: ()=>handleSort('rank'),
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100",
                                                        children: [
                                                            "Rank ",
                                                            sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1832,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Sign On Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1838,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Sign Off Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1839,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Contract"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1840,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1841,
                                                        columnNumber: 33
                                                    }, this),
                                                    userRole === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "Actions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 1843,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1818,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1817,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "bg-white divide-y divide-gray-200",
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: userRole === 'ADMIN' ? 9 : 8,
                                                    className: "px-6 py-4 text-center text-sm text-gray-500",
                                                    children: "Loading crew data..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1850,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1849,
                                                columnNumber: 33
                                            }, this) : filteredCrew.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: userRole === 'ADMIN' ? 9 : 8,
                                                    className: "px-6 py-4 text-center text-sm text-gray-500",
                                                    children: "No crew records found."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1856,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 1855,
                                                columnNumber: 33
                                            }, this) : getSortedCrew().map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "hover:bg-gray-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                            children: member.vessels?.vessel_name || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1863,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setSelectedCrew(member),
                                                                className: "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer",
                                                                children: member.passport_number || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1867,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1866,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                                                            children: member.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1874,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                                                            children: member.rank || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1877,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                                                            children: member.sign_on_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(member.sign_on_date) : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1880,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                                                            children: member.sign_off_date ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(member.sign_off_date)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1886,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    member.exit_type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        title: member.exit_type === 'SUCCESSFUL' ? 'Successful Exit' : 'Break Contract',
                                                                        className: member.exit_type === 'SUCCESSFUL' ? 'text-green-600 font-bold' : 'text-red-600 font-bold',
                                                                        children: member.exit_type === 'SUCCESSFUL' ? '✓' : '✗'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 1888,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1885,
                                                                columnNumber: 49
                                                            }, this) : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1883,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-center text-sm",
                                                            children: member.contract_file ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: member.contract_file,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                title: "Download contract",
                                                                className: "text-blue-600 hover:text-blue-800 hover:underline font-medium",
                                                                children: "📄 View"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1900,
                                                                columnNumber: 49
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400 text-xs",
                                                                children: "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1910,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1898,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap",
                                                            children: (()=>{
                                                                const { status, color } = getCrewStatus(member);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`,
                                                                    children: status
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1917,
                                                                    columnNumber: 53
                                                                }, this);
                                                            })()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1913,
                                                            columnNumber: 41
                                                        }, this),
                                                        userRole === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                                                            children: member.crew_status === 'NEW' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleApprove(member.id),
                                                                disabled: approvingId === member.id,
                                                                className: "text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-3 py-1 rounded-md transition-colors disabled:cursor-not-allowed",
                                                                children: approvingId === member.id ? 'Approving...' : 'Approve'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 1926,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1924,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, member.id, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1862,
                                                    columnNumber: 37
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1847,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 1816,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                lineNumber: 1815,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/crew/page.tsx",
                        lineNumber: 1810,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/crew/page.tsx",
                lineNumber: 1705,
                columnNumber: 13
            }, this),
            selectedCrew && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold",
                                    children: "Crew Member Details"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 1952,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCrew(null),
                                    className: "text-white hover:text-gray-200 text-2xl font-bold",
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 1953,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/crew/page.tsx",
                            lineNumber: 1951,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center mb-4 pb-2 border-b border-gray-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900",
                                                    children: "Personal Information"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1966,
                                                    columnNumber: 37
                                                }, this),
                                                !isEditingCrewDetails && selectedCrew.crew_status === 'NEW' && userRole === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleEditCrewDetails,
                                                    className: "px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium transition-colors",
                                                    children: "Edit Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1968,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1965,
                                            columnNumber: 33
                                        }, this),
                                        isEditingCrewDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Passport Number *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1980,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: crewEditData.passport_number,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            passport_number: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1981,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1979,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Name *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1989,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: crewEditData.name,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            name: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1990,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1988,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Rank"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1998,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: crewEditData.rank,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            rank: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 1999,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 1997,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Nationality"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2007,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: crewEditData.nationality,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            nationality: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2008,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2006,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Date of Birth"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2016,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: crewEditData.date_of_birth,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            date_of_birth: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2017,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2015,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Sign On Port"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2025,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: crewEditData.sign_on_port,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            sign_on_port: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2026,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2024,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Sign On Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2034,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: crewEditData.sign_on_date,
                                                                    onChange: (e)=>setCrewEditData({
                                                                            ...crewEditData,
                                                                            sign_on_date: e.target.value
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2035,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2033,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 1978,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 pt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleSaveCrewDetails,
                                                            disabled: isCrewDetailsSaving,
                                                            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 font-medium text-sm transition-colors disabled:cursor-not-allowed",
                                                            children: isCrewDetailsSaving ? 'Saving...' : 'Save'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2044,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleCancelEditCrewDetails,
                                                            disabled: isCrewDetailsSaving,
                                                            className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 font-medium text-sm transition-colors disabled:cursor-not-allowed",
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2051,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2043,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 1977,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Passport Number"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2063,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900 font-semibold",
                                                            children: selectedCrew.passport_number || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2064,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2062,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2067,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900 font-semibold",
                                                            children: selectedCrew.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2068,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2066,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Rank"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2071,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900",
                                                            children: selectedCrew.rank || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2072,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2070,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Nationality"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2075,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900",
                                                            children: selectedCrew.nationality || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2076,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2074,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2061,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 1964,
                                    columnNumber: 29
                                }, this),
                                selectedCrew.contract_file && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200",
                                            children: "Contract Document"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2085,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-blue-50 rounded-md border border-blue-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl",
                                                                children: "📄"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2089,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-medium text-gray-600",
                                                                        children: "Contract File"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2091,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-base text-gray-900 font-semibold break-all",
                                                                        children: selectedCrew.contract_file.split('/').pop()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2092,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2090,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2088,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: selectedCrew.contract_file,
                                                        download: true,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors whitespace-nowrap",
                                                        children: "📥 Download"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2097,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 2087,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2086,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 2084,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center mb-4 pb-2 border-b border-gray-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900",
                                                    children: "Employment Period"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2114,
                                                    columnNumber: 37
                                                }, this),
                                                !isEditingExit && selectedCrew.crew_status !== 'COMPLETED' && selectedCrew.onboarding_status === 'APPROVED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleEditExit,
                                                    className: "px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 font-medium transition-colors",
                                                    children: "Edit Exit Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2116,
                                                    columnNumber: 41
                                                }, this),
                                                selectedCrew.crew_status === 'COMPLETED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md font-medium",
                                                    children: "Exit Locked"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2124,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2113,
                                            columnNumber: 33
                                        }, this),
                                        isEditingExit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Sign On Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2131,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900",
                                                                    children: selectedCrew.sign_on_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(selectedCrew.sign_on_date) : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2132,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2130,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Sign On Port"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2135,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900",
                                                                    children: selectedCrew.sign_on_port || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2136,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2134,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2129,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4 border-t border-blue-300 pt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                            children: "Exit Date *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 2142,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            value: exitEditData.sign_off_date,
                                                                            onChange: (e)=>setExitEditData({
                                                                                    ...exitEditData,
                                                                                    sign_off_date: e.target.value
                                                                                }),
                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 2143,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2141,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                            children: "Exit Port"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 2151,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: exitEditData.sign_off_port,
                                                                            onChange: (e)=>setExitEditData({
                                                                                    ...exitEditData,
                                                                                    sign_off_port: e.target.value
                                                                                }),
                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "Select Port"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                    lineNumber: 2157,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                ports.map((port)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: port.name,
                                                                                        children: port.name
                                                                                    }, port.id, false, {
                                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                        lineNumber: 2159,
                                                                                        columnNumber: 61
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 2152,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2150,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                                            children: "Exit Type *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 2164,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: exitEditData.exit_type,
                                                                            onChange: (e)=>setExitEditData({
                                                                                    ...exitEditData,
                                                                                    exit_type: e.target.value
                                                                                }),
                                                                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "Select Exit Type"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                    lineNumber: 2170,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "SUCCESSFUL",
                                                                                    children: "Successful"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                    lineNumber: 2171,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "BREAK_CONTRACT",
                                                                                    children: "Break Contract"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                                    lineNumber: 2172,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                            lineNumber: 2165,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2163,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2140,
                                                            columnNumber: 45
                                                        }, this),
                                                        exitEditData.exit_type === 'BREAK_CONTRACT' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                                    children: "Reason for Break Contract *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2178,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                    value: exitEditData.exit_remarks,
                                                                    onChange: (e)=>setExitEditData({
                                                                            ...exitEditData,
                                                                            exit_remarks: e.target.value
                                                                        }),
                                                                    rows: 3,
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                                                                    placeholder: "Enter reason for contract break..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2179,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2177,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2139,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 pt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleSaveExit,
                                                            disabled: isExitSaving,
                                                            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 font-medium text-sm transition-colors disabled:cursor-not-allowed",
                                                            children: isExitSaving ? 'Saving...' : 'Save'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2190,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleCancelEditExit,
                                                            disabled: isExitSaving,
                                                            className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 font-medium text-sm transition-colors disabled:cursor-not-allowed",
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2197,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2189,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2128,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Sign On Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2209,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900",
                                                            children: selectedCrew.sign_on_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(selectedCrew.sign_on_date) : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2210,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2208,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Sign On Port"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2213,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900",
                                                            children: selectedCrew.sign_on_port || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2214,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2212,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Exit Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2217,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900 font-semibold",
                                                            children: selectedCrew.sign_off_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateDDMMYYYY"])(selectedCrew.sign_off_date) : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2218,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2216,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Exit Port"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2221,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900 font-semibold",
                                                            children: selectedCrew.sign_off_port || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2222,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2220,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Exit Type"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2225,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900 font-semibold",
                                                            children: selectedCrew.exit_type === 'SUCCESSFUL' ? 'Successful' : selectedCrew.exit_type === 'BREAK_CONTRACT' ? 'Break Contract' : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2226,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2224,
                                                    columnNumber: 41
                                                }, this),
                                                selectedCrew.exit_type === 'BREAK_CONTRACT' && selectedCrew.exit_remarks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "md:col-span-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Break Contract Reason"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2233,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base text-gray-900",
                                                            children: selectedCrew.exit_remarks
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2234,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2232,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2207,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 2112,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200",
                                            children: "Salary Details"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2243,
                                            columnNumber: 33
                                        }, this),
                                        isEditingCrewDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                                children: "Basic Salary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2248,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2250,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: crewEditData.basic_salary,
                                                                        onChange: (e)=>setCrewEditData({
                                                                                ...crewEditData,
                                                                                basic_salary: e.target.value
                                                                            }),
                                                                        placeholder: "0.00",
                                                                        step: "0.01",
                                                                        className: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2251,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2249,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2247,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                                children: "Fixed Overtime"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2262,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2264,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: crewEditData.fixed_overtime,
                                                                        onChange: (e)=>setCrewEditData({
                                                                                ...crewEditData,
                                                                                fixed_overtime: e.target.value
                                                                            }),
                                                                        placeholder: "0.00",
                                                                        step: "0.01",
                                                                        className: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2265,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2263,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2261,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                                children: "Leave Wages"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2276,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2278,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: crewEditData.leave_wages,
                                                                        onChange: (e)=>setCrewEditData({
                                                                                ...crewEditData,
                                                                                leave_wages: e.target.value
                                                                            }),
                                                                        placeholder: "0.00",
                                                                        step: "0.01",
                                                                        className: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2279,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2277,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2275,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                                children: "Other Allowances"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2290,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2292,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: crewEditData.other_allowances,
                                                                        onChange: (e)=>setCrewEditData({
                                                                                ...crewEditData,
                                                                                other_allowances: e.target.value
                                                                            }),
                                                                        placeholder: "0.00",
                                                                        step: "0.01",
                                                                        className: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2293,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2291,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2289,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                                children: "Joining Expenses"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2304,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2306,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: crewEditData.joining_expenses,
                                                                        onChange: (e)=>setCrewEditData({
                                                                                ...crewEditData,
                                                                                joining_expenses: e.target.value
                                                                            }),
                                                                        placeholder: "0.00",
                                                                        step: "0.01",
                                                                        className: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2307,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2305,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2303,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                                children: "Onboard Allowance / Short Manning"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2318,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "absolute left-3 top-2 text-gray-600 font-medium",
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2320,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: crewEditData.onboard_allowance_short_manning,
                                                                        onChange: (e)=>setCrewEditData({
                                                                                ...crewEditData,
                                                                                onboard_allowance_short_manning: e.target.value
                                                                            }),
                                                                        placeholder: "0.00",
                                                                        step: "0.01",
                                                                        className: "w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                        lineNumber: 2321,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                lineNumber: 2319,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2317,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/crew/page.tsx",
                                                lineNumber: 2246,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2245,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 bg-gray-50 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Basic Salary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2337,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900 font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        selectedCrew.basic_salary ? `${parseFloat(String(selectedCrew.basic_salary)).toFixed(2)}` : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2338,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2336,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 bg-gray-50 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Fixed Overtime"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2341,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900 font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        selectedCrew.fixed_overtime ? `${parseFloat(String(selectedCrew.fixed_overtime)).toFixed(2)}` : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2342,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2340,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 bg-gray-50 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Leave Wages"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2345,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900 font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        selectedCrew.leave_wages ? `${parseFloat(String(selectedCrew.leave_wages)).toFixed(2)}` : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2346,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2344,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 bg-gray-50 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Other Allowances"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2349,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900 font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        selectedCrew.other_allowances ? `${parseFloat(String(selectedCrew.other_allowances)).toFixed(2)}` : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2350,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2348,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 bg-gray-50 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Joining Expenses"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2353,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900 font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        selectedCrew.joining_expenses ? `${parseFloat(String(selectedCrew.joining_expenses)).toFixed(2)}` : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2354,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2352,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 bg-gray-50 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium text-gray-600",
                                                                    children: "Onboard Allowance / Short Manning"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2357,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-base text-gray-900 font-semibold",
                                                                    children: [
                                                                        "$",
                                                                        selectedCrew.onboard_allowance_short_manning ? `${parseFloat(String(selectedCrew.onboard_allowance_short_manning)).toFixed(2)}` : '-'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                                    lineNumber: 2358,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2356,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2335,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4 bg-blue-50 rounded-md border border-blue-200 mt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-600",
                                                            children: "Total Earnings"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2362,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lg text-blue-600 font-bold",
                                                            children: [
                                                                "$",
                                                                selectedCrew.total_earnings ? `${parseFloat(String(selectedCrew.total_earnings)).toFixed(2)}` : '-'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2363,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2361,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2334,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 2242,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200",
                                            children: "Crew Status"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2371,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-gray-600 mb-1",
                                                    children: "Current Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2373,
                                                    columnNumber: 37
                                                }, this),
                                                (()=>{
                                                    const { status, color } = getCrewStatus(selectedCrew);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${color}`,
                                                        children: status
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/crew/page.tsx",
                                                        lineNumber: 2377,
                                                        columnNumber: 45
                                                    }, this);
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2372,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 text-xs text-gray-500 space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "• ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "New:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2384,
                                                            columnNumber: 42
                                                        }, this),
                                                        " Crew member added, pending approval"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2384,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "• ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Active:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2385,
                                                            columnNumber: 42
                                                        }, this),
                                                        " Approved and currently on vessel"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2385,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "• ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Completed:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                                            lineNumber: 2386,
                                                            columnNumber: 42
                                                        }, this),
                                                        " Exit date has been set"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                                    lineNumber: 2386,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/crew/page.tsx",
                                            lineNumber: 2383,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 2370,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/crew/page.tsx",
                            lineNumber: 1962,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCrew(null),
                                    className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium text-sm transition-colors",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 2393,
                                    columnNumber: 29
                                }, this),
                                selectedCrew.crew_status === 'NEW' && userRole === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleApprove(selectedCrew.id),
                                    disabled: approvingId === selectedCrew.id,
                                    className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 font-medium text-sm transition-colors disabled:cursor-not-allowed",
                                    children: approvingId === selectedCrew.id ? 'Approving...' : 'Approve Crew Member'
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/crew/page.tsx",
                                    lineNumber: 2400,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/crew/page.tsx",
                            lineNumber: 2392,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/crew/page.tsx",
                    lineNumber: 1949,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/crew/page.tsx",
                lineNumber: 1948,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/crew/page.tsx",
        lineNumber: 1167,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7eb0431a._.js.map