'use client';

import { useState } from 'react';

// Generic Tab Component Factory
interface GenericTabProps {
  vessel: any;
  onDataUpdate: () => void;
  section: string;
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'checkbox' | 'select';
    step?: string;
    options?: Array<{ label: string; value: string }>;
  }>;
}

export default function GenericVesselTab({
  vessel,
  onDataUpdate,
  section,
  title,
  fields,
}: GenericTabProps) {
  // Map section names to vessel object properties (handle crew-config → crew_config)
  const sectionMap: Record<string, string> = {
    'crew-config': 'crew_config',
  };
  
  const vesselKey = sectionMap[section] || section;
  const initialData = vessel[`vessel_${vesselKey}`] || {};

  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      let value = initialData[field.name] || '';
      
      // Convert ISO-8601 dates to YYYY-MM-DD format for date inputs
      if (field.type === 'date' && value) {
        try {
          const dateObj = new Date(value);
          // Format as YYYY-MM-DD
          value = dateObj.toISOString().split('T')[0];
        } catch (e) {
          value = '';
        }
      }
      
      acc[field.name] = value;
      return acc;
    }, {} as Record<string, any>)
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Convert string values to appropriate types
      const processedData = Object.entries(formData).reduce((acc, [key, value]) => {
        const field = fields.find(f => f.name === key);
        if (!value && value !== 0) {
          acc[key] = null;
        } else if (field?.type === 'date') {
          // Convert date string to ISO-8601 DateTime format
          acc[key] = value ? new Date(value).toISOString() : null;
        } else if (field?.type === 'number') {
          acc[key] = isNaN(Number(value)) ? null : Number(value);
        } else if (field?.type === 'checkbox') {
          acc[key] = value === true || value === 'true';
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await fetch(`/api/vessels/${vessel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: processedData }),
      });

      if (!response.ok) {
        let errorMsg = `Unable to save ${title}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          // If JSON parsing fails, use generic message
        }
        throw new Error(errorMsg);
      }
      
      setMessage(`✅ ${title} updated successfully!`);
      onDataUpdate();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Save error:', errorMsg);
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 flex-grow">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleChange}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                step={field.step}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
}
