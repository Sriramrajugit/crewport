'use client';

import { useState } from 'react';

interface VesselOwnershipTabProps {
  vessel: any;
  onDataUpdate: () => void;
}

export default function VesselOwnershipTab({ vessel, onDataUpdate }: VesselOwnershipTabProps) {
  const [formData, setFormData] = useState({
    registered_owner: vessel.vessel_ownership?.registered_owner || '',
    beneficial_owner: vessel.vessel_ownership?.beneficial_owner || '',
    technical_manager: vessel.vessel_ownership?.technical_manager || '',
    commercial_manager: vessel.vessel_ownership?.commercial_manager || '',
    operator: vessel.vessel_ownership?.operator || '',
    ism_manager: vessel.vessel_ownership?.ism_manager || '',
    isps_company: vessel.vessel_ownership?.isps_company || '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`/api/vessels/${vessel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'ownership', data: formData }),
      });

      if (!response.ok) {
        let errorMsg = 'Unable to save ownership information';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          // If JSON parsing fails, use generic message
        }
        throw new Error(errorMsg);
      }
      setMessage('✅ Ownership information updated successfully!');
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
      <h2 className="text-2xl font-bold text-gray-900">Ownership & Management</h2>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registered Owner</label>
          <input
            type="text"
            name="registered_owner"
            value={formData.registered_owner}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beneficial Owner</label>
          <input
            type="text"
            name="beneficial_owner"
            value={formData.beneficial_owner}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Technical Manager</label>
          <input
            type="text"
            name="technical_manager"
            value={formData.technical_manager}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Manager</label>
          <input
            type="text"
            name="commercial_manager"
            value={formData.commercial_manager}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
          <input
            type="text"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ISM Manager</label>
          <input
            type="text"
            name="ism_manager"
            value={formData.ism_manager}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">ISPS Company</label>
          <input
            type="text"
            name="isps_company"
            value={formData.isps_company}
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
