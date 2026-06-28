/**
 * Example: React Upload Component
 * Demonstrates usage in a React component with state management
 */

import { useState } from 'react';
import {
  processContractWithOCR,
  validateExtractedData,
  type ExtractedSalary,
} from '@crewport/ocr-extractor';

export function OCRUploadComponent() {
  const [salaryData, setSalaryData] = useState<ExtractedSalary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress('Processing...');
    setSalaryData(null);

    try {
      const result = await processContractWithOCR(file, { logProgress: false });

      if (result.error) {
        setError(result.error);
        setProgress('');
        return;
      }

      // Validate extracted data
      const validation = validateExtractedData(result.salaryData);

      if (!validation.isValid) {
        setError(`Missing required fields: ${validation.missingFields.join(', ')}`);
      }

      if (validation.warnings.length > 0) {
        console.warn('Extraction warnings:', validation.warnings);
      }

      setSalaryData(result.salaryData);
      setProgress('Extraction complete!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocr-upload-component">
      <h2>Contract OCR Extraction</h2>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="file-input"
        />
        {progress && <p className="progress">{progress}</p>}
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {salaryData && (
        <div className="result-section">
          <h3>Extracted Salary Data</h3>
          <table className="data-table">
            <tbody>
              {Object.entries(salaryData).map(([key, value]) => (
                <tr key={key}>
                  <td className="label">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </td>
                  <td className="value">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .ocr-upload-component {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .upload-section {
          margin: 20px 0;
        }

        .file-input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }

        .file-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .progress {
          margin-top: 10px;
          color: #0066cc;
          font-weight: bold;
        }

        .error-message {
          padding: 10px;
          background-color: #fee;
          color: #c00;
          border-radius: 4px;
          margin: 10px 0;
        }

        .result-section {
          margin-top: 20px;
        }

        .result-section h3 {
          margin-bottom: 10px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table tr {
          border-bottom: 1px solid #eee;
        }

        .data-table .label {
          font-weight: bold;
          text-align: left;
          padding: 8px;
          width: 50%;
        }

        .data-table .value {
          padding: 8px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
