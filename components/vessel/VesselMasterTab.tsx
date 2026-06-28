'use client';

import { useState } from 'react';

interface VesselMasterTabProps {
  vessel: any;
  onDataUpdate: () => void;
}

export default function VesselMasterTab({ vessel, onDataUpdate }: VesselMasterTabProps) {
  const [formData, setFormData] = useState({
    vessel_name: vessel.vessel_name || '',
    imo_number: vessel.imo_number || '',
    mmsi_number: vessel.mmsi_number || '',
    call_sign: vessel.call_sign || '',
    vessel_type: vessel.vessel_type || '',
    vessel_subtype: vessel.vessel_subtype || '',
    flag: vessel.flag || '',
    greek_flag: vessel.greek_flag || false,
    registry_no: vessel.registry_no || '',
    nat_number: vessel.nat_number || '',
    port_of_registry: vessel.port_of_registry || '',
    year_built: vessel.year_built || '',
    builder: vessel.builder || '',
    hull_number: vessel.hull_number || '',
    classification_society: vessel.classification_society || '',
    class_notation: vessel.class_notation || '',
    ice_class: vessel.ice_class || '',
    vessel_value: vessel.vessel_value || '',
    status: vessel.status || 'ACTIVE',
  });

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
      // Convert numeric fields properly
      const masterData = {
        ...formData,
        year_built: formData.year_built && !isNaN(parseInt(formData.year_built)) ? parseInt(formData.year_built) : null,
        vessel_value: formData.vessel_value && !isNaN(parseFloat(formData.vessel_value)) ? parseFloat(formData.vessel_value) : null,
        greek_flag: formData.greek_flag === true || formData.greek_flag === 'true',
      };

      const response = await fetch(`/api/vessels/${vessel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'master', data: masterData }),
      });

      if (!response.ok) {
        let errorMsg = 'Unable to save vessel information';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          // If JSON parsing fails, use generic message
        }
        throw new Error(errorMsg);
      }
      
      setMessage('✅ Vessel master information updated successfully!');
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
      <h2 className="text-2xl font-bold text-gray-900">Vessel Master Information</h2>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vessel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Name *</label>
          <input
            type="text"
            name="vessel_name"
            value={formData.vessel_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* IMO Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IMO Number</label>
          <input
            type="text"
            name="imo_number"
            value={formData.imo_number}
            onChange={handleChange}
            placeholder="e.g., 1234567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* MMSI Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MMSI Number</label>
          <input
            type="text"
            name="mmsi_number"
            value={formData.mmsi_number}
            onChange={handleChange}
            placeholder="e.g., 123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Call Sign */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Call Sign</label>
          <input
            type="text"
            name="call_sign"
            value={formData.call_sign}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Vessel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Type</label>
          <input
            type="text"
            name="vessel_type"
            value={formData.vessel_type}
            onChange={handleChange}
            placeholder="e.g., Container Ship, Tanker"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Vessel Sub-type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Sub-type</label>
          <input
            type="text"
            name="vessel_subtype"
            value={formData.vessel_subtype}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Flag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Flag (Country)</label>
          <input
            type="text"
            name="flag"
            value={formData.flag}
            onChange={handleChange}
            placeholder="e.g., Singapore"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Port of Registry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Port of Registry</label>
          <input
            type="text"
            name="port_of_registry"
            value={formData.port_of_registry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Year Built */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
          <input
            type="number"
            name="year_built"
            value={formData.year_built}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Builder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Builder</label>
          <input
            type="text"
            name="builder"
            value={formData.builder}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Hull Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hull Number</label>
          <input
            type="text"
            name="hull_number"
            value={formData.hull_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Classification Society */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Classification Society</label>
          <input
            type="text"
            name="classification_society"
            value={formData.classification_society}
            onChange={handleChange}
            placeholder="e.g., Lloyd's Register, DNV"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Class Notation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Notation</label>
          <input
            type="text"
            name="class_notation"
            value={formData.class_notation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Ice Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ice Class</label>
          <input
            type="text"
            name="ice_class"
            value={formData.ice_class}
            onChange={handleChange}
            placeholder="e.g., IA, IB, IC"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Registry Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registry No</label>
          <input
            type="text"
            name="registry_no"
            value={formData.registry_no}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* NAT Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NAT Number</label>
          <input
            type="text"
            name="nat_number"
            value={formData.nat_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Vessel Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Value (USD)</label>
          <input
            type="number"
            name="vessel_value"
            value={formData.vessel_value}
            onChange={handleChange}
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Greek Flag Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="greek_flag"
              checked={formData.greek_flag}
              onChange={(e) => setFormData(prev => ({ ...prev, greek_flag: e.target.checked }))}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Greek Flag</span>
          </label>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SOLD">Sold</option>
            <option value="SCRAPPED">Scrapped</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
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
