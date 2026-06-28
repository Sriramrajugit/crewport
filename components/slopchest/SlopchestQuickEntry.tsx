'use client';

import { useState, useEffect } from 'react';

interface Item {
    id: number;
    item_name: string;
    item_code: string;
    unit_price: number;
    available_quantity: number;
    category: string | null;
}

interface CrewMember {
    id: number;
    name: string;
    rank: string;
    sign_on_date: string;
    crew_status?: string;
}

interface Props {
    vesselId: number;
    month: number;
    year: number;
    activeTab: 'crew' | 'on-signers';
    onEntryAdded: () => void;
}

export default function SlopchestQuickEntry({
    vesselId,
    month,
    year,
    activeTab,
    onEntryAdded
}: Props) {
    const [items, setItems] = useState<Item[]>([]);
    const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state for crew
    const [consumptionDate, setConsumptionDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCrew, setSelectedCrew] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    // Form state for on-signers
    const [consumptionDateOnSigner, setConsumptionDateOnSigner] = useState(new Date().toISOString().split('T')[0]);
    const [signerName, setSignerName] = useState('');
    const [selectedItemOnSigner, setSelectedItemOnSigner] = useState('');
    const [quantityOnSigner, setQuantityOnSigner] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        fetchItems();
        if (activeTab === 'crew') {
            fetchCrewMembers();
        }
    }, [vesselId, activeTab, month, year]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/slopchest/items', {
                headers: {
                    'X-Vessel-Id': vesselId.toString()
                }
            });
            if (response.ok) {
                setItems(await response.json());
            }
        } catch (err) {
            // Error fetching items
        } finally {
            setLoading(false);
        }
    };

    const fetchCrewMembers = async () => {
        try {
            // Fetch all active crew members for the vessel, not filtered by month/year
            const response = await fetch(`/api/crew?vesselId=${vesselId}`, {
                headers: {
                    'X-Vessel-Id': vesselId.toString()
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCrewMembers(data.map((cm: any) => ({
                    id: cm.id,
                    name: cm.name,
                    rank: cm.rank,
                    sign_on_date: cm.sign_on_date,
                    crew_status: cm.crew_status
                })));
            }
        } catch (err) {
            // Error fetching crew
        }
    };

    // Calculate min and max dates for the selected month
    const getDateRangeForMonth = () => {
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);
        const today = new Date();

        // Min date is the first day of the selected month
        const minDate = firstDayOfMonth.toISOString().split('T')[0];
        
        // Max date is either the last day of the month or today, whichever is earlier
        const maxDate = lastDayOfMonth < today 
            ? lastDayOfMonth.toISOString().split('T')[0]
            : today.toISOString().split('T')[0];

        return { minDate, maxDate };
    };

    const { minDate, maxDate } = getDateRangeForMonth();

    // No additional filtering needed - the API already returns crew onboarded in the selected month
    const activeCrewMembers = crewMembers;

    const handleSubmitCrew = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedCrew || !selectedItem || !quantity || !consumptionDate) {
            setError('Please fill all required fields');
            return;
        }

        const qtyValue = parseFloat(quantity);

        // Validate quantity is not negative
        if (qtyValue < 0) {
            setError('Quantity cannot be negative');
            return;
        }

        // Validate quantity is not zero
        if (qtyValue === 0) {
            setError('Quantity must be greater than 0');
            return;
        }

        // Get selected item to check available quantity
        const selectedItemObj = items.find(item => item.id === parseInt(selectedItem));
        if (selectedItemObj && qtyValue > selectedItemObj.available_quantity) {
            setError(`Insufficient quantity. Available: ${selectedItemObj.available_quantity}, Requested: ${qtyValue}`);
            return;
        }

        // Validate consumption date is not in the future
        const consumptionDateTime = new Date(consumptionDate);
        const todayDateTime = new Date();
        consumptionDateTime.setHours(0, 0, 0, 0);
        todayDateTime.setHours(0, 0, 0, 0);
        
        if (consumptionDateTime > todayDateTime) {
            setError('Cannot record consumption for future dates');
            return;
        }

        // Validate consumption date is within the selected month
        const minDateTime = new Date(minDate);
        const maxDateTime = new Date(maxDate);
        minDateTime.setHours(0, 0, 0, 0);
        maxDateTime.setHours(0, 0, 0, 0);

        if (consumptionDateTime < minDateTime || consumptionDateTime > maxDateTime) {
            setError(`Consumption date must be between ${new Date(minDate).toLocaleDateString('en-IN')} and ${new Date(maxDate).toLocaleDateString('en-IN')}`);
            return;
        }

        // Validate consumption date is on or after crew member's joining date
        const selectedCrewMember = crewMembers.find(cm => cm.id === parseInt(selectedCrew));
        if (selectedCrewMember) {
            const joiningDateTime = new Date(selectedCrewMember.sign_on_date);
            joiningDateTime.setHours(0, 0, 0, 0);
            
            if (consumptionDateTime < joiningDateTime) {
                const joiningDateStr = joiningDateTime.toLocaleDateString('en-IN');
                setError(`Cannot record consumption before crew member's joining date (${joiningDateStr})`);
                return;
            }
        }

        try {
            setSubmitting(true);
            const response = await fetch('/api/slopchest/consumption', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': vesselId.toString()
                },
                body: JSON.stringify({
                    crew_member_id: parseInt(selectedCrew),
                    item_id: parseInt(selectedItem),
                    consumption_date: consumptionDate,
                    month,
                    year,
                    quantity: parseFloat(quantity),
                    notes: notes || null
                })
            });

            if (response.ok) {
                setSuccess('Consumption recorded successfully!');
                setConsumptionDate(new Date().toISOString().split('T')[0]);
                setSelectedCrew('');
                setSelectedItem('');
                setQuantity('');
                setNotes('');
                
                // Refresh items to show updated quantities
                fetchItems();
                
                // Call parent callback
                onEntryAdded();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const error = await response.json();
                setError(error.error || 'Failed to record consumption');
            }
        } catch (err) {
            setError('Error submitting form');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitOnSigner = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!signerName || !selectedItemOnSigner || !quantityOnSigner || !consumptionDateOnSigner) {
            setError('Please fill all required fields');
            return;
        }

        const qtyValue = parseFloat(quantityOnSigner);

        // Validate quantity is not negative
        if (qtyValue < 0) {
            setError('Quantity cannot be negative');
            return;
        }

        // Validate quantity is not zero
        if (qtyValue === 0) {
            setError('Quantity must be greater than 0');
            return;
        }

        // Get selected item to check available quantity
        const selectedItemObj = items.find(item => item.id === parseInt(selectedItemOnSigner));
        if (selectedItemObj && qtyValue > selectedItemObj.available_quantity) {
            setError(`Insufficient quantity. Available: ${selectedItemObj.available_quantity}, Requested: ${qtyValue}`);
            return;
        }

        // Validate consumption date is not in the future
        const consumptionDateTimeOnSigner = new Date(consumptionDateOnSigner);
        const todayDateTimeOnSigner = new Date();
        consumptionDateTimeOnSigner.setHours(0, 0, 0, 0);
        todayDateTimeOnSigner.setHours(0, 0, 0, 0);
        
        if (consumptionDateTimeOnSigner > todayDateTimeOnSigner) {
            setError('Cannot record consumption for future dates');
            return;
        }

        // Validate consumption date is within the selected month
        const minDateTimeOnSigner = new Date(minDate);
        const maxDateTimeOnSigner = new Date(maxDate);
        minDateTimeOnSigner.setHours(0, 0, 0, 0);
        maxDateTimeOnSigner.setHours(0, 0, 0, 0);

        if (consumptionDateTimeOnSigner < minDateTimeOnSigner || consumptionDateTimeOnSigner > maxDateTimeOnSigner) {
            setError(`Consumption date must be between ${new Date(minDate).toLocaleDateString('en-IN')} and ${new Date(maxDate).toLocaleDateString('en-IN')}`);
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('/api/slopchest/on-signers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vessel-Id': vesselId.toString()
                },
                body: JSON.stringify({
                    signer_name: signerName,
                    item_id: parseInt(selectedItemOnSigner),
                    consumption_date: consumptionDateOnSigner,
                    month,
                    year,
                    quantity: parseFloat(quantityOnSigner),
                    remarks: remarks || null
                })
            });

            if (response.ok) {
                setSuccess('On-signer consumption recorded successfully!');
                setConsumptionDateOnSigner(new Date().toISOString().split('T')[0]);
                setSignerName('');
                setSelectedItemOnSigner('');
                setQuantityOnSigner('');
                setRemarks('');
                
                // Refresh items to show updated quantities
                fetchItems();
                
                // Call parent callback
                onEntryAdded();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const error = await response.json();
                setError(error.error || 'Failed to record consumption');
            }
        } catch (err) {
            setError('Error submitting form');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
                {activeTab === 'crew' ? 'Quick Entry - Crew' : 'Quick Entry - Owners/charterer'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    ✓ {success}
                </div>
            )}

            {activeTab === 'crew' ? (
                <form onSubmit={handleSubmitCrew} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Consumption Date *
                        </label>
                        <input
                            type="date"
                            value={consumptionDate}
                            onChange={(e) => setConsumptionDate(e.target.value)}
                            min={minDate}
                            max={maxDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Date must be between {new Date(minDate).toLocaleDateString('en-IN')} and {new Date(maxDate).toLocaleDateString('en-IN')}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Crew Member *
                        </label>
                        <select
                            value={selectedCrew}
                            onChange={(e) => setSelectedCrew(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select crew member...</option>
                            {activeCrewMembers.map(crew => (
                                <option key={crew.id} value={crew.id}>
                                    {crew.name} ({crew.rank})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Item *
                        </label>
                        <select
                            value={selectedItem}
                            onChange={(e) => setSelectedItem(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select item...</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.item_name} - ${parseFloat(item.unit_price.toString()).toFixed(2)} - Qty: {parseFloat(item.available_quantity.toString()).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                        {submitting ? 'Recording...' : 'Record Entry'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmitOnSigner} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Consumption Date *
                        </label>
                        <input
                            type="date"
                            value={consumptionDateOnSigner}
                            onChange={(e) => setConsumptionDateOnSigner(e.target.value)}
                            min={minDate}
                            max={maxDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Date must be between {new Date(minDate).toLocaleDateString('en-IN')} and {new Date(maxDate).toLocaleDateString('en-IN')}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Signer Name *
                        </label>
                        <input
                            type="text"
                            value={signerName}
                            onChange={(e) => setSignerName(e.target.value)}
                            placeholder="Enter name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Item *
                        </label>
                        <select
                            value={selectedItemOnSigner}
                            onChange={(e) => setSelectedItemOnSigner(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select item...</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.item_name} - ${parseFloat(item.unit_price.toString()).toFixed(2)} - Qty: {parseFloat(item.available_quantity.toString()).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={quantityOnSigner}
                            onChange={(e) => setQuantityOnSigner(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Optional remarks..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                        {submitting ? 'Recording...' : 'Record Entry'}
                    </button>
                </form>
            )}
        </div>
    );
}
