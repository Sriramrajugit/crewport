import Link from 'next/link';

export default function PurchasesDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3 text-blue-600">🛒</span>
                Purchases Log
            </h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Track provision and bond purchases for the vessel by attaching PO and delivery records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/bond">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-200 bg-indigo-50 hover:shadow-md hover:border-indigo-300 transition cursor-pointer">
                        <h3 className="font-bold text-lg text-indigo-800">Bond Purchase</h3>
                        <p className="text-sm text-indigo-600">Record cigarettes, drinks, slop chest</p>
                    </div>
                </Link>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 bg-orange-50 opacity-50 cursor-not-allowed">
                    <h3 className="font-bold text-lg text-orange-800">Provision Request</h3>
                    <p className="text-sm text-orange-600">Record fresh and dry provisions</p>
                    <p className="text-xs text-orange-500 mt-2">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}
