'use client';

import { useState } from 'react';

interface VesselCommercialTabProps {
  vessel: any;
  onDataUpdate: () => void;
}

export default function VesselCommercialTab({ vessel, onDataUpdate }: VesselCommercialTabProps) {
  // Helper function to convert ISO-8601 dates to YYYY-MM-DD format
  const convertDateToInput = (dateValue: any) => {
    if (!dateValue) return '';
    try {
      const dateObj = new Date(dateValue);
      return dateObj.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    } catch (e) {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    charter_type: vessel.vessel_commercial?.charter_type || '',
    charterer_name: vessel.vessel_commercial?.charterer_name || '',
    charter_start: convertDateToInput(vessel.vessel_commercial?.charter_start),
    charter_end: convertDateToInput(vessel.vessel_commercial?.charter_end),
    pool_name: vessel.vessel_commercial?.pool_name || '',
    hire_rate: vessel.vessel_commercial?.hire_rate || '',
    cost_center: vessel.vessel_commercial?.cost_center || '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Convert data with proper type handling
      const commercialData = {
        ...formData,
        charter_start: formData.charter_start ? new Date(formData.charter_start).toISOString() : null,
        charter_end: formData.charter_end ? new Date(formData.charter_end).toISOString() : null,
        hire_rate: formData.hire_rate && !isNaN(parseFloat(formData.hire_rate)) ? parseFloat(formData.hire_rate) : null,
      };

      const response = await fetch(`/api/vessels/${vessel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'commercial', data: commercialData }),
      });

      if (!response.ok) {
        let errorMsg = 'Unable to save commercial information';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          // If JSON parsing fails, use generic message
        }
        throw new Error(errorMsg);
      }
      setMessage('✅ Commercial information updated successfully!');
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Commercial Details</h2>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Charter Type</label>
          <select
            name="charter_type"
            value={formData.charter_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Charter Type</option>
            <option value="Time">Time Charter</option>
            <option value="Voyage">Voyage Charter</option>
            <option value="Bareboat">Bareboat Charter</option>
            <option value="Spot">Spot</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Charterer Name</label>
          <input
            type="text"
            name="charterer_name"
            value={formData.charterer_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Charter Start Date</label>
          <input
            type="date"
            name="charter_start"
            value={formData.charter_start}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Charter End Date</label>
          <input
            type="date"
            name="charter_end"
            value={formData.charter_end}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pool Name</label>
          <input
            type="text"
            name="pool_name"
            value={formData.pool_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hire Rate (USD/day)</label>
          <input
            type="number"
            step="0.01"
            name="hire_rate"
            value={formData.hire_rate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
          <input
            type="text"
            name="cost_center"
            value={formData.cost_center}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
}
