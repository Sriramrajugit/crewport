module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
// Prisma initialization
// Use a global variable to ensure a single PrismaClient instance in development
const globalForPrisma = globalThis;
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
        log: ("TURBOPACK compile-time truthy", 1) ? [
            'query',
            'error',
            'warn'
        ] : "TURBOPACK unreachable",
        errorFormat: 'pretty'
    });
}
const prisma = globalForPrisma.prisma;
// Handle graceful shutdown
process.on('SIGINT', async ()=>{
    if (globalForPrisma.prisma) {
        await globalForPrisma.prisma.$disconnect();
    }
    process.exit(0);
});
process.on('SIGTERM', async ()=>{
    if (globalForPrisma.prisma) {
        await globalForPrisma.prisma.$disconnect();
    }
    process.exit(0);
});
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "destroySession",
    ()=>destroySession,
    "getSession",
    ()=>getSession,
    "saveSession",
    ()=>saveSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/iron-session/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
// Session secret must be at least 32 characters
const sessionSecret = process.env.SESSION_SECRET || 'a-very-complex-password-min-32-characters-long-secret-key-value!@#$%^&*';
if (sessionSecret.length < 32) {
    throw new Error(`SESSION_SECRET must be at least 32 characters, got ${sessionSecret.length}`);
}
const sessionOptions = {
    password: sessionSecret,
    cookieName: 'crewport_session',
    cookieOptions: {
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    }
};
console.log(`[Session] Initialized with secret length: ${sessionSecret.length}, NODE_ENV: ${("TURBOPACK compile-time value", "development")}`);
async function getSession(request) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, sessionOptions);
        console.log(`[Session] Read session - userId: ${session.userId}, isLoggedIn: ${session.isLoggedIn}`);
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return {};
    }
}
async function saveSession(sessionData) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, sessionOptions);
        Object.assign(session, sessionData);
        await session.save();
        console.log(`[Session] Saved session - userId: ${sessionData.userId}, email: ${sessionData.email}`);
        return session;
    } catch (error) {
        console.error('Error saving session:', error);
        return {};
    }
}
async function destroySession() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$iron$2d$session$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIronSession"])(cookieStore, sessionOptions);
        session.destroy();
        console.log(`[Session] Session destroyed`);
    } catch (error) {
        console.error('Error destroying session:', error);
    }
}
}),
"[project]/lib/accessControl.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserIdFromRequest",
    ()=>getUserIdFromRequest,
    "getVesselIdFromRequest",
    ()=>getVesselIdFromRequest,
    "isUserAdmin",
    ()=>isUserAdmin,
    "validateVesselAccess",
    ()=>validateVesselAccess,
    "withAdminAccess",
    ()=>withAdminAccess,
    "withVesselAccess",
    ()=>withVesselAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.ts [app-route] (ecmascript)");
;
;
;
async function validateVesselAccess(userId, vesselId) {
    try {
        // Check if user is ADMIN/SUPER_ADMIN (bypass access control)
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id: userId
            },
            include: {
                users_roles: {
                    select: {
                        role_name: true
                    }
                }
            }
        });
        if (!user) {
            return {
                allowed: false,
                error: 'User not found'
            };
        }
        const role = user.users_roles?.role_name || '';
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            return {
                allowed: true
            };
        }
        // Check if user has access to this vessel
        const hasAccess = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user_vessels.findUnique({
            where: {
                user_id_vessel_id: {
                    user_id: userId,
                    vessel_id: vesselId
                }
            }
        });
        if (!hasAccess || !hasAccess.is_active) {
            return {
                allowed: false,
                error: 'Access to this vessel is denied'
            };
        }
        return {
            allowed: true
        };
    } catch (error) {
        return {
            allowed: false,
            error: 'Server error while validating access'
        };
    }
}
function getVesselIdFromRequest(request) {
    const vesselIdHeader = request.headers.get('X-Vessel-Id');
    if (vesselIdHeader) {
        const vesselId = parseInt(vesselIdHeader);
        if (!isNaN(vesselId)) {
            return vesselId;
        }
    }
    return null;
}
async function getUserIdFromRequest(request) {
    try {
        console.log(`[Auth] getUserIdFromRequest called`);
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        console.log(`[Auth] Session data: userId=${session.userId}, email=${session.email}, isLoggedIn=${session.isLoggedIn}`);
        if (session.userId && session.isLoggedIn) {
            console.log(`[Auth] User authenticated via session: ${session.email} (ID: ${session.userId})`);
            return session.userId;
        }
    } catch (error) {
        console.error('[Auth] Error reading session:', error);
    }
    // No valid session - return null
    console.log(`[Auth] No valid session found - returning null`);
    return null;
}
async function isUserAdmin(userId) {
    try {
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id: userId
            },
            include: {
                users_roles: {
                    select: {
                        role_name: true
                    }
                }
            }
        });
        if (!user) {
            return false;
        }
        const role = user.users_roles?.role_name || '';
        return role === 'ADMIN' || role === 'SUPER_ADMIN';
    } catch (error) {
        return false;
    }
}
async function withAdminAccess(request, handler) {
    try {
        const userId = await getUserIdFromRequest(request);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - no user session'
            }, {
                status: 401
            });
        }
        // Check if user is admin
        const isAdmin = await isUserAdmin(userId);
        if (!isAdmin) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Forbidden - admin access required'
            }, {
                status: 403
            });
        }
        // Call handler with validated user ID
        return await handler(userId);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function withVesselAccess(request, handler) {
    try {
        const userId = await getUserIdFromRequest(request);
        const vesselId = getVesselIdFromRequest(request);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - no user session'
            }, {
                status: 401
            });
        }
        if (!vesselId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Bad request - vessel ID not provided'
            }, {
                status: 400
            });
        }
        // Validate access
        const access = await validateVesselAccess(userId, vesselId);
        if (!access.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: access.error || 'Access denied'
            }, {
                status: 403
            });
        }
        // Call handler with validated vessel ID and user ID
        return await handler(vesselId, userId);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
"[project]/app/api/slopchest/consumption/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/accessControl.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withVesselAccess"])(request, async (vesselId, userId)=>{
        try {
            const { searchParams } = new URL(request.url);
            const month = searchParams.get('month');
            const year = searchParams.get('year');
            if (!month || !year) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'month and year are required'
                }, {
                    status: 400
                });
            }
            const consumptions = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryConsumption.findMany({
                where: {
                    vessel_id: vesselId,
                    month: parseInt(month),
                    year: parseInt(year)
                },
                include: {
                    crew_members: {
                        select: {
                            id: true,
                            name: true,
                            rank: true
                        }
                    },
                    inventory_items: {
                        select: {
                            id: true,
                            item_name: true,
                            item_code: true,
                            category: true,
                            inventory_type: true
                        }
                    }
                },
                orderBy: {
                    crew_members: {
                        name: 'asc'
                    }
                }
            });
            // Filter for SLOPCHEST type only in application
            const slopchestConsumptions = consumptions.filter((c)=>c.inventory_items?.inventory_type === 'SLOPCHEST');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(slopchestConsumptions);
        } catch (error) {
            console.error('Error fetching slopchest consumptions:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch consumption records'
            }, {
                status: 500
            });
        }
    });
}
async function POST(request) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withVesselAccess"])(request, async (vesselId, userId)=>{
        try {
            const body = await request.json();
            const { crew_member_id, item_id, consumption_date, month, year, quantity, notes } = body;
            if (!crew_member_id || !item_id || !consumption_date || !month || !year || !quantity) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Missing required fields: crew_member_id, item_id, consumption_date, month, year, quantity'
                }, {
                    status: 400
                });
            }
            // Verify crew member belongs to this vessel
            const crewMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewMember.findUnique({
                where: {
                    id: parseInt(crew_member_id)
                }
            });
            if (!crewMember || crewMember.vessel_id !== vesselId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Crew member not found or does not belong to this vessel'
                }, {
                    status: 404
                });
            }
            // Verify crew member is/was active during the specified month
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            const firstDayOfMonth = new Date(yearNum, monthNum - 1, 1);
            const lastDayOfMonth = new Date(yearNum, monthNum, 0);
            firstDayOfMonth.setUTCHours(0, 0, 0, 0);
            lastDayOfMonth.setUTCHours(23, 59, 59, 999);
            const signOnDate = new Date(crewMember.sign_on_date);
            signOnDate.setUTCHours(0, 0, 0, 0);
            // Check if crew member has NOT joined yet
            if (signOnDate > lastDayOfMonth) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Crew member has not joined yet. Joining on: ${crewMember.sign_on_date?.toISOString().split('T')[0]}`
                }, {
                    status: 400
                });
            }
            // Check if crew member has been relieved BEFORE this month
            if (crewMember.sign_off_date) {
                const signOffDate = new Date(crewMember.sign_off_date);
                signOffDate.setUTCHours(0, 0, 0, 0);
                const consumptionDateObj = new Date(consumption_date);
                consumptionDateObj.setUTCHours(0, 0, 0, 0);
                // No entries allowed on or after the sign_off_date
                if (consumptionDateObj >= signOffDate) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Cannot record slopchest: Crew member was relieved on ${crewMember.sign_off_date.toISOString().split('T')[0]}. No entries allowed on or after the exit date.`
                    }, {
                        status: 400
                    });
                }
            }
            // Get item details for unit_price and verify it belongs to this vessel
            const item = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryItem.findUnique({
                where: {
                    id: parseInt(item_id)
                }
            });
            if (!item || item.vessel_id !== vesselId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Item not found or does not belong to this vessel'
                }, {
                    status: 404
                });
            }
            const quantityDecimal = parseFloat(quantity);
            // Validate quantity is greater than 0 (not negative or zero)
            if (quantityDecimal <= 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Quantity must be greater than 0'
                }, {
                    status: 400
                });
            }
            // Check if item is out of stock
            const availableQty = parseFloat(item.available_quantity.toString());
            if (availableQty <= 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Cannot consume: Item "${item.item_name}" is out of stock (Available: 0)`
                }, {
                    status: 400
                });
            }
            const totalDeduction = quantityDecimal * parseFloat(item.unit_price.toString());
            const consumptionDateObj = new Date(consumption_date);
            // Check if a consumption already exists for this same crew/item/day
            const existingConsumption = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryConsumption.findFirst({
                where: {
                    vessel_id: vesselId,
                    crew_member_id: parseInt(crew_member_id),
                    item_id: parseInt(item_id),
                    consumption_date: consumptionDateObj
                }
            });
            const previousQuantity = existingConsumption ? parseFloat(existingConsumption.quantity.toString()) : 0;
            const quantityDifference = quantityDecimal - previousQuantity;
            // Validate we have enough inventory for the net adjustment (only if increasing quantity)
            if (quantityDifference > 0) {
                if (availableQty < quantityDifference) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Insufficient quantity. Available: ${availableQty}, Additional needed: ${quantityDifference}`
                    }, {
                        status: 400
                    });
                }
            }
            let consumption;
            if (existingConsumption) {
                // Update existing consumption
                consumption = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryConsumption.update({
                    where: {
                        id: existingConsumption.id
                    },
                    data: {
                        quantity: quantityDecimal,
                        unit_price: parseFloat(item.unit_price.toString()),
                        total_deduction: totalDeduction,
                        notes: notes || null,
                        updated_at: new Date()
                    },
                    include: {
                        crew_members: {
                            select: {
                                id: true,
                                name: true,
                                rank: true
                            }
                        },
                        inventory_items: {
                            select: {
                                id: true,
                                item_name: true,
                                item_code: true,
                                category: true
                            }
                        }
                    }
                });
            } else {
                // Create new consumption
                consumption = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryConsumption.create({
                    data: {
                        vessel_id: vesselId,
                        crew_member_id: parseInt(crew_member_id),
                        item_id: parseInt(item_id),
                        consumption_date: consumptionDateObj,
                        month: parseInt(month),
                        year: parseInt(year),
                        quantity: quantityDecimal,
                        unit_price: parseFloat(item.unit_price.toString()),
                        total_deduction: totalDeduction,
                        notes: notes || null,
                        created_by: userId
                    },
                    include: {
                        crew_members: {
                            select: {
                                id: true,
                                name: true,
                                rank: true
                            }
                        },
                        inventory_items: {
                            select: {
                                id: true,
                                item_name: true,
                                item_code: true,
                                category: true
                            }
                        }
                    }
                });
            }
            // Adjust inventory quantity by the difference
            if (quantityDifference !== 0) {
                console.log(`[Consumption] Adjusting inventory for item ${item_id}: decreasing by ${quantityDifference}`);
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryItem.update({
                    where: {
                        id: parseInt(item_id)
                    },
                    data: {
                        available_quantity: {
                            decrement: quantityDifference
                        }
                    }
                });
                console.log(`[Consumption] Inventory adjusted successfully`);
            }
            // Fetch the updated item to return updated quantity to frontend
            const updatedItem = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].inventoryItem.findUnique({
                where: {
                    id: parseInt(item_id)
                }
            });
            // Return response with updated item data
            const response = {
                ...consumption,
                updated_item: {
                    id: updatedItem?.id,
                    available_quantity: updatedItem?.available_quantity
                }
            };
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
                status: 201
            });
        } catch (error) {
            console.error('Error creating/updating consumption record:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to record consumption',
                details: error.message
            }, {
                status: 500
            });
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dd633ac3._.js.map