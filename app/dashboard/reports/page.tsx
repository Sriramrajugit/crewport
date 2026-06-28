import Link from 'next/link';

export default function ReportsDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3 text-blue-600">📈</span>
                Reports
            </h1>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <p className="text-gray-700 font-medium">Generate end-of-month reports for crew earnings, inventory, and vessel operations.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Link href="/dashboard/reports/portage-bill">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg shadow hover:shadow-xl border-2 border-orange-300 hover:border-orange-500 cursor-pointer transition-all transform hover:scale-105 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">📊</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">Portage Bill</h3>
                                <p className="text-gray-700 mb-2 text-sm">Monthly crew earnings & deductions</p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="inline-block bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">Earnings</span>
                                    <span className="inline-block bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">Deductions</span>
                                    <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">Final Balance</span>
                                </div>
                            </div>
                            <div className="text-2xl">→</div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Other Reports</h2>
                <div className="grid grid-cols-4 gap-6">
                    <Link href="/dashboard/reports/travel-wages">
                        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4 border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer">
                            <div className="text-4xl">✈️</div>
                            <div>
                                <h3 className="font-bold text-lg">Travel Wages Report</h3>
                                <p className="text-sm text-gray-500">Travel wages entries by employee</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/dashboard/reports/hra">
                        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4 border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer">
                            <div className="text-4xl">⚠️</div>
                            <div>
                                <h3 className="font-bold text-lg">HRA - High Risk Area Report</h3>
                                <p className="text-sm text-gray-500">High Risk Area entries by employee and date range</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/dashboard/reports/slopchest">
                        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4 border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer">
                            <div className="text-4xl">🏪</div>
                            <div>
                                <h3 className="font-bold text-lg">Slopchest Reports</h3>
                                <p className="text-sm text-gray-500">Item-wise and crew-wise consumption analysis</p>
                            </div>
                        </div>
                    </Link>
                    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4 border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="text-4xl">🧾</div>
                        <div>
                            <h3 className="font-bold text-lg">Purchase Log</h3>
                            <p className="text-sm text-gray-500">Provision and bonded stores summary</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
