'use client';

import { useState, useEffect } from 'react';

interface BondFormProps {
    vessels: any[];
    onSuccess?: () => void;
}

export default function BondForm({ vessels, onSuccess }: BondFormProps) {
    const [formData, setFormData] = useState({
        vessel_id: '',
        log_period: '',
        rfq_no: '',
        po_no: '',
        base_amount_usd: '',
        invoice_file: null as File | null,
        dn_file: null as File | null,
    });

    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [totalLocal, setTotalLocal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch exchange rate when component mounts
    useEffect(() => {
        fetchExchangeRate();
    }, []);

    // Calculate total local when base amount or exchange rate changes
    useEffect(() => {
        if (formData.base_amount_usd && exchangeRate) {
            const total = parseFloat(formData.base_amount_usd) * exchangeRate;
            setTotalLocal(total);
        }
    }, [formData.base_amount_usd, exchangeRate]);

    const fetchExchangeRate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/masters/exchange?latest=true');
            if (response.ok) {
                const data = await response.json();
                setExchangeRate(parseFloat(data.usd_to_local));
            } else {
                setError('Unable to fetch exchange rate. Please try again.');
            }
        } catch (err) {
            setError('Failed to fetch exchange rate');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'invoice_file' | 'dn_file') => {
        const files = e.target.files;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [fileType]: files[0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.vessel_id || !formData.log_period || !formData.po_no || !formData.base_amount_usd) {
            setError('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        try {
            // Create FormData for file upload
            const uploadFormData = new FormData();
            uploadFormData.append('vessel_id', formData.vessel_id);
            uploadFormData.append('type', 'BOND');
            uploadFormData.append('log_period', formData.log_period);
            uploadFormData.append('rfq_no', formData.rfq_no);
            uploadFormData.append('po_no', formData.po_no);
            uploadFormData.append('base_amount_usd', formData.base_amount_usd);
            uploadFormData.append('exchange_rate', exchangeRate?.toString() || '0');
            uploadFormData.append('total_local', totalLocal?.toString() || '0');

            if (formData.invoice_file) {
                uploadFormData.append('invoice_file', formData.invoice_file);
            }
            if (formData.dn_file) {
                uploadFormData.append('dn_file', formData.dn_file);
            }

            const response = await fetch('/api/purchases', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create bond purchase');
            }

            setSuccess('Bond purchase created successfully!');
            setFormData({
                vessel_id: '',
                log_period: '',
                rfq_no: '',
                po_no: '',
                base_amount_usd: '',
                invoice_file: null,
                dn_file: null,
            });

            // Reset file inputs
            const invoiceInput = document.getElementById('invoice_file') as HTMLInputElement;
            const dnInput = document.getElementById('dn_file') as HTMLInputElement;
            if (invoiceInput) invoiceInput.value = '';
            if (dnInput) dnInput.value = '';

            // Call success callback after a delay
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while creating bond purchase');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">{success}</p>
                </div>
            )}

            {/* Vessel Selection */}
            <div>
                <label htmlFor="vessel_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Vessel <span className="text-red-500">*</span>
                </label>
                <select
                    id="vessel_id"
                    name="vessel_id"
                    value={formData.vessel_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    required
                >
                    <option value="">Select a vessel</option>
                    {vessels.map((vessel: any) => (
                        <option key={vessel.id} value={vessel.id}>
                            {vessel.vessel_name} (IMO: {vessel.imo_number})
                        </option>
                    ))}
                </select>
            </div>

            {/* Log Period */}
            <div>
                <label htmlFor="log_period" className="block text-sm font-medium text-gray-700 mb-2">
                    Log Period <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="log_period"
                    name="log_period"
                    value={formData.log_period}
                    onChange={handleInputChange}
                    placeholder="e.g., Jan 2024 or 01-01-2024 to 01-31-2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>

            {/* RFQ and PO Numbers */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="rfq_no" className="block text-sm font-medium text-gray-700 mb-2">
                        RFQ No
                    </label>
                    <input
                        type="text"
                        id="rfq_no"
                        name="rfq_no"
                        value={formData.rfq_no}
                        onChange={handleInputChange}
                        placeholder="Request for Quote number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="po_no" className="block text-sm font-medium text-gray-700 mb-2">
                        PO No <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="po_no"
                        name="po_no"
                        value={formData.po_no}
                        onChange={handleInputChange}
                        placeholder="Purchase order number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>
            </div>

            {/* Base Amount and Exchange Rate */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="base_amount_usd" className="block text-sm font-medium text-gray-700 mb-2">
                        Base Amount USD <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
                        <input
                            type="number"
                            id="base_amount_usd"
                            name="base_amount_usd"
                            value={formData.base_amount_usd}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="exchange_rate" className="block text-sm font-medium text-gray-700 mb-2">
                        Exchange Rate (USD to INR)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="exchange_rate"
                            disabled
                            value={exchangeRate ? exchangeRate.toFixed(4) : 'Loading...'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                        <button
                            type="button"
                            onClick={fetchExchangeRate}
                            disabled={loading}
                            className="absolute right-3 top-2.5 text-indigo-600 hover:text-indigo-700 text-xs font-medium disabled:text-gray-400"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Local */}
            {totalLocal !== null && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Local (USD)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
                        <input
                            type="text"
                            disabled
                            value={totalLocal.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium"
                        />
                    </div>
                </div>
            )}

            {/* File Uploads */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900">Supporting Documents</h3>

                <div>
                    <label htmlFor="invoice_file" className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice File
                    </label>
                    <input
                        type="file"
                        id="invoice_file"
                        onChange={(e) => handleFileChange(e, 'invoice_file')}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.invoice_file ? `Selected: ${formData.invoice_file.name}` : 'PDF, DOC, XLS, or image files accepted'}
                    </p>
                </div>

                <div>
                    <label htmlFor="dn_file" className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Note File
                    </label>
                    <input
                        type="file"
                        id="dn_file"
                        onChange={(e) => handleFileChange(e, 'dn_file')}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.dn_file ? `Selected: ${formData.dn_file.name}` : 'PDF, DOC, XLS, or image files accepted'}
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="reset"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                    disabled={submitting}
                >
                    Clear
                </button>
                <button
                    type="submit"
                    disabled={submitting || loading || !exchangeRate}
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Creating...' : 'Create Bond Purchase'}
                </button>
            </div>
        </form>
    );
}
