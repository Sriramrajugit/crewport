'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { VesselProvider, useVessel } from '@/app/context/VesselContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { selectedVessel, setSelectedVessel, assignedVessels, loading, error } = useVessel();
    const [role, setRole] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Check local storage for session
        const sessionStr = localStorage.getItem('crewport_session');
        if (!sessionStr) {
            router.push('/login');
        } else {
            const session = JSON.parse(sessionStr);
            setRole(session.role);
        }
    }, [router]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('crewport_session');
        router.push('/login');
    };

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Crew Management', href: '/dashboard/crew', icon: '👥' },
        { name: 'Slopchest', href: '/dashboard/slopchest', icon: '🏪' },
        { name: 'Purchases', href: '/dashboard/purchases', icon: '🛒' },
        { name: 'Bond', href: '/dashboard/bond', icon: '📦' },
        { name: 'Master Data', href: '/dashboard/master', icon: '⚙️' },
        { name: 'Reports', href: '/dashboard/reports', icon: '📈' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
            {/* Mobile nav header */}
            <div className="md:hidden bg-white border-b border-gray-200 flex items-center justify-between p-4 z-20 relative shadow-sm">
                <div className="flex items-center gap-2">
                    <Image src="/Main_logo.png" alt="Logo" width={100} height={40} className="object-contain" priority />
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                    <span className="text-2xl">☰</span>
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className={`md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-xl transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-10 w-64`}>
                <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-100 px-4">
                    <Image src="/Main_logo.png" alt="Logo" width={140} height={50} className="object-contain" priority />
                </div>
                <div className="flex-1 overflow-y-auto mt-6 md:mt-0">
                    <nav className="mt-5 px-3 space-y-2">
                        <div>
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MENU</div>
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-3 text-lg opacity-80">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ACCOUNT</div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150"
                            >
                                <span className="mr-3 text-lg opacity-80">🚪</span>
                                Sign out
                            </button>
                        </div>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {role.substring(0, 1)}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{role === 'ADMIN' ? 'Administrator' : 'Vessel User'}</div>
                        <div className="text-xs text-gray-500">{role}</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <header className="hidden md:flex bg-white shadow-sm border-b border-gray-200 sticky top-0 z-5">
                    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Current Vessel
                            </label>
                            {loading ? (
                                <span className="text-sm text-gray-600">Loading vessels...</span>
                            ) : error ? (
                                <span className="text-sm text-red-600">Error: {error}</span>
                            ) : assignedVessels.length > 0 ? (
                                <select
                                    value={selectedVessel?.vessel_id || ''}
                                    onChange={(e) => {
                                        const vessel = assignedVessels.find(
                                            v => v.vessel_id === parseInt(e.target.value)
                                        );
                                        if (vessel) setSelectedVessel(vessel);
                                    }}
                                    disabled={!selectedVessel}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-medium disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    {!selectedVessel && <option value="">Select a vessel...</option>}
                                    {assignedVessels.map(vessel => (
                                        <option key={vessel.vessel_id} value={vessel.vessel_id}>
                                            {vessel.vessel_name} ({vessel.company_name})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-sm text-gray-600">No vessels assigned</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                                Online
                            </span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6 px-4 sm:px-6 md:px-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-0 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <VesselProvider>
            <DashboardContent>{children}</DashboardContent>
        </VesselProvider>
    );
}
