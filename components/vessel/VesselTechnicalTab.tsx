'use client';

import { useState } from 'react';

interface VesselTechnicalTabProps {
  vessel: any;
  onDataUpdate: () => void;
}

export default function VesselTechnicalTab({ vessel, onDataUpdate }: VesselTechnicalTabProps) {
  const [formData, setFormData] = useState({
    loa: vessel.vessel_technical?.loa || '',
    lbp: vessel.vessel_technical?.lbp || '',
    breadth: vessel.vessel_technical?.breadth || '',
    depth: vessel.vessel_technical?.depth || '',
    draft_summer: vessel.vessel_technical?.draft_summer || '',
    draft_winter: vessel.vessel_technical?.draft_winter || '',
    air_draft: vessel.vessel_technical?.air_draft || '',
    gross_tonnage: vessel.vessel_technical?.gross_tonnage || '',
    net_tonnage: vessel.vessel_technical?.net_tonnage || '',
    deadweight: vessel.vessel_technical?.deadweight || '',
    lightship_weight: vessel.vessel_technical?.lightship_weight || '',
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
      // Convert string values to floats for technical fields
      const technicalData = {
        loa: formData.loa && !isNaN(parseFloat(formData.loa)) ? parseFloat(formData.loa) : null,
        lbp: formData.lbp && !isNaN(parseFloat(formData.lbp)) ? parseFloat(formData.lbp) : null,
        breadth: formData.breadth && !isNaN(parseFloat(formData.breadth)) ? parseFloat(formData.breadth) : null,
        depth: formData.depth && !isNaN(parseFloat(formData.depth)) ? parseFloat(formData.depth) : null,
        draft_summer: formData.draft_summer && !isNaN(parseFloat(formData.draft_summer)) ? parseFloat(formData.draft_summer) : null,
        draft_winter: formData.draft_winter && !isNaN(parseFloat(formData.draft_winter)) ? parseFloat(formData.draft_winter) : null,
        air_draft: formData.air_draft && !isNaN(parseFloat(formData.air_draft)) ? parseFloat(formData.air_draft) : null,
        gross_tonnage: formData.gross_tonnage && !isNaN(parseFloat(formData.gross_tonnage)) ? parseFloat(formData.gross_tonnage) : null,
        net_tonnage: formData.net_tonnage && !isNaN(parseFloat(formData.net_tonnage)) ? parseFloat(formData.net_tonnage) : null,
        deadweight: formData.deadweight && !isNaN(parseFloat(formData.deadweight)) ? parseFloat(formData.deadweight) : null,
        lightship_weight: formData.lightship_weight && !isNaN(parseFloat(formData.lightship_weight)) ? parseFloat(formData.lightship_weight) : null,
      };

      const response = await fetch(`/api/vessels/${vessel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'technical', data: technicalData }),
      });

      if (!response.ok) {
        let errorMsg = 'Unable to save technical information';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          // If JSON parsing fails, use generic message
        }
        throw new Error(errorMsg);
      }
      setMessage('✅ Technical information updated successfully!');
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
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">Technical Particulars</h2>

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Length Overall (LOA) - m</label>
          <input
            type="number"
            step="0.01"
            name="loa"
            value={formData.loa}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Length Between Perpendiculars (LBP) - m</label>
          <input
            type="number"
            step="0.01"
            name="lbp"
            value={formData.lbp}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Breadth (Width) - m</label>
          <input
            type="number"
            step="0.01"
            name="breadth"
            value={formData.breadth}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Depth - m</label>
          <input
            type="number"
            step="0.01"
            name="depth"
            value={formData.depth}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Draft (Summer) - m</label>
          <input
            type="number"
            step="0.01"
            name="draft_summer"
            value={formData.draft_summer}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Draft (Winter) - m</label>
          <input
            type="number"
            step="0.01"
            name="draft_winter"
            value={formData.draft_winter}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Air Draft - m</label>
          <input
            type="number"
            step="0.01"
            name="air_draft"
            value={formData.air_draft}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gross Tonnage (GT)</label>
          <input
            type="number"
            step="0.01"
            name="gross_tonnage"
            value={formData.gross_tonnage}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Net Tonnage (NT)</label>
          <input
            type="number"
            step="0.01"
            name="net_tonnage"
            value={formData.net_tonnage}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Deadweight Tonnage (DWT)</label>
          <input
            type="number"
            step="0.01"
            name="deadweight"
            value={formData.deadweight}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Lightship Weight (LSW)</label>
          <input
            type="number"
            step="0.01"
            name="lightship_weight"
            value={formData.lightship_weight}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end -mt-8 pt-2">
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
