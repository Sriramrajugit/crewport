'use client';

import { useState, useEffect } from 'react';

interface Certificate {
  id: number;
  certificate_name: string;
  issuing_authority?: string;
  issue_date?: string;
  expiry_date?: string;
  status?: string;
}

interface VesselCertificatesTabProps {
  vessel: any;
  onDataUpdate: () => void;
}

export default function VesselCertificatesTab({ vessel, onDataUpdate }: VesselCertificatesTabProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCert, setNewCert] = useState({
    certificate_name: '',
    issuing_authority: '',
    issue_date: '',
    expiry_date: '',
    status: 'ACTIVE',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`/api/vessels/${vessel.id}/certificates`);
      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Error fetching certificates:', errorMsg);
      setMessage(`❌ Error loading certificates: ${errorMsg}`);
    }
  };

  const handleAddCertificate = async () => {
    if (!newCert.certificate_name) {
      setMessage('⚠️ Certificate name is required');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/vessels/${vessel.id}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert),
      });

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      setMessage('✅ Certificate added successfully!');
      setNewCert({ certificate_name: '', issuing_authority: '', issue_date: '', expiry_date: '', status: 'ACTIVE' });
      fetchCertificates();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Add certificate error:', errorMsg);
      setMessage(`❌ Error adding certificate: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (certId: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const response = await fetch(`/api/vessels/${vessel.id}/certificates?certId=${certId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      setMessage('✅ Certificate deleted');
      fetchCertificates();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Delete certificate error:', errorMsg);
      setMessage(`❌ Error deleting certificate: ${errorMsg}`);
    }
  };

  const isExpiringSoon = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Vessel Certificates</h2>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : message.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Add New Certificate */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Certificate</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name *</label>
            <input
              type="text"
              value={newCert.certificate_name}
              onChange={(e) => setNewCert({ ...newCert, certificate_name: e.target.value })}
              placeholder="e.g., SOLAS, MARPOL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Authority</label>
            <input
              type="text"
              value={newCert.issuing_authority}
              onChange={(e) => setNewCert({ ...newCert, issuing_authority: e.target.value })}
              placeholder="e.g., IMO"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input
              type="date"
              value={newCert.issue_date}
              onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={newCert.expiry_date}
              onChange={(e) => setNewCert({ ...newCert, expiry_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddCertificate}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? 'Adding...' : '➕ Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Certificate Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Issuing Authority</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Issue Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                  No certificates found
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{cert.certificate_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.issuing_authority || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={isExpired(cert.expiry_date) ? 'text-red-600 font-semibold' : isExpiringSoon(cert.expiry_date) ? 'text-orange-600 font-semibold' : 'text-gray-600'}>
                      {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isExpired(cert.expiry_date) && <span className="text-red-600">⚠️ Expired</span>}
                    {isExpiringSoon(cert.expiry_date) && !isExpired(cert.expiry_date) && <span className="text-orange-600">⚠️ Expiring Soon</span>}
                    {!isExpired(cert.expiry_date) && !isExpiringSoon(cert.expiry_date) && <span className="text-green-600">✅ Valid</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteCertificate(cert.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
