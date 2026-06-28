'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { VesselProvider, useVessel } from '@/app/context/VesselContext';
import UserProfileModal from '@/components/UserProfileModal';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { selectedVessel, setSelectedVessel, assignedVessels, loading, error } = useVessel();
    const [role, setRole] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [sidebarHovered, setSidebarHovered] = useState(false);
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
            
            // Fetch full user profile
            const fetchUserProfile = async () => {
                try {
                    const response = await fetch('/api/auth/me');
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            
            fetchUserProfile();
        }
    }, [router]);

    // Auto-close menu when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Handle logout
    const handleLogout = async () => {
        try {
            // Call logout API to clear the session cookie
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear client-side session storage
            localStorage.removeItem('crewport_session');
            // Redirect to login
            router.push('/login');
        }
    };

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Crew Management', href: '/dashboard/crew', icon: '👥' },
        { name: 'Travel Wages & HRA', href: '/dashboard/travel-wages-hra', icon: '💰' },
        { name: 'Vessel Management', href: '/dashboard/vessel-management', icon: '⚓' },
        { name: 'Slopchest', href: '/dashboard/slopchest', icon: '🏪' },
        { name: 'Purchases', href: '/dashboard/purchases', icon: '🛒' },
        { name: 'Bond', href: '/dashboard/bond', icon: '📦' },
        { name: 'Victualling', href: '/dashboard/victualling', icon: '🍽️' },
        ...(role === 'ADMIN' || role === 'SUPER_ADMIN' ? [{ name: 'Master Data', href: '/dashboard/master', icon: '⚙️' }] : []),
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

            {/* Sidebar Navigation - Auto Hide on Hover */}
            <div 
                className={`fixed md:absolute md:left-0 inset-y-0 bg-white shadow-xl transform transition-all duration-300 ease-in-out z-50 ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'} md:translate-x-0 hover:md:w-64 ${sidebarHovered ? 'md:w-64' : 'md:w-5'}`}
                onMouseEnter={() => setSidebarHovered(true)}
                onMouseLeave={() => setSidebarHovered(false)}
            >
                {/* Sidebar trigger bar */}
                <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-5 items-center justify-center">
                    <div className="w-0.5 h-10 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                </div>

                <div className={`hidden md:flex items-center justify-between h-20 border-b border-gray-100 px-4 ${sidebarHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    {sidebarHovered && (
                        <Image src="/Main_logo.png" alt="Logo" width={140} height={50} className="object-contain" priority />
                    )}
                </div>
                <div className={`flex-1 overflow-y-auto mt-6 md:mt-0 ${sidebarHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
                    <nav className="mt-5 px-2 space-y-2">
                        <div>
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MENU</div>
                            {menuItems.map((item: any) => (
                                <div key={item.name}>
                                    {item.submenu ? (
                                        <>
                                            <button
                                                onClick={() => setExpandedMenu(expandedMenu === item.name ? null : item.name)}
                                                className={`w-full text-left group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                                                    pathname.includes('victualling')
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className="flex items-center">
                                                    <span className="mr-3 text-lg opacity-80">{item.icon}</span>
                                                    {item.name}
                                                </span>
                                                <span className="text-xs transition-transform duration-200" style={{
                                                    transform: expandedMenu === item.name ? 'rotate(180deg)' : 'rotate(0deg)'
                                                }}>
                                                    ▼
                                                </span>
                                            </button>
                                            {expandedMenu === item.name && (
                                                <div className="mt-1 ml-3 space-y-1 border-l-2 border-gray-200">
                                                    {item.submenu.map((subitem: any) => (
                                                        <Link
                                                            key={subitem.href}
                                                            href={subitem.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                                                                pathname.includes('victualling')
                                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {subitem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
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
                                    )}
                                </div>
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
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-5 flex flex-col transition-all duration-300">
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
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                {user?.name?.substring(0, 1) || role?.substring(0, 1)}
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{role === 'ADMIN' ? 'Administrator' : 'Vessel User'}</div>
                                <div className="text-xs text-gray-500">{role}</div>
                            </div>
                        </button>
                    </div>
                </header>
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-4 px-3 sm:px-4 md:px-5">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* User Profile Modal */}
            <UserProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
            />
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
