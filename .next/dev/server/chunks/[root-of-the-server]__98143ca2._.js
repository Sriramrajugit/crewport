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
"[project]/app/api/vessels/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/accessControl.ts [app-route] (ecmascript)");
;
;
;
async function GET(request, { params }) {
    try {
        // Authenticate user
        const userId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserIdFromRequest"])(request);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - please log in'
            }, {
                status: 401
            });
        }
        const { id } = await params;
        const vesselId = parseInt(id);
        // Validate user has access to this vessel
        const accessCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateVesselAccess"])(userId, vesselId);
        if (!accessCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: accessCheck.error || 'Access denied'
            }, {
                status: 403
            });
        }
        const vessel = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vessel.findUnique({
            where: {
                id: vesselId
            },
            include: {
                vessel_ownership: true,
                vessel_commercial: true,
                vessel_technical: true,
                vessel_engine: true,
                vessel_propulsion: true,
                vessel_tanks: true,
                vessel_certificates: true,
                vessel_crew_config: true,
                vessel_navigation: true,
                vessel_environment: true,
                vessel_maintenance: true
            }
        });
        if (!vessel) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Vessel not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(vessel);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        let userMessage = 'Unable to load vessel information';
        if (errorMessage.includes('not found')) {
            userMessage = 'Vessel not found. It may have been deleted.';
        } else if (errorMessage.includes('Unauthorized')) {
            userMessage = 'Your session has expired. Please log in again.';
        }
        console.error('Error fetching vessel:', errorMessage);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: userMessage,
            details: errorMessage
        }, {
            status: 500
        });
    }
}
async function PUT(request, { params }) {
    let body;
    let vesselId = 0;
    try {
        // Authenticate user
        const userId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserIdFromRequest"])(request);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - please log in'
            }, {
                status: 401
            });
        }
        const { id } = await params;
        vesselId = parseInt(id);
        // Validate user has access to this vessel
        const accessCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateVesselAccess"])(userId, vesselId);
        if (!accessCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: accessCheck.error || 'Access denied'
            }, {
                status: 403
            });
        }
        body = await request.json();
        const { section, data } = body;
        // Update vessel master info
        if (section === 'master') {
            const masterData = {
                vessel_name: data.vessel_name,
                imo_number: data.imo_number,
                mmsi_number: data.mmsi_number,
                call_sign: data.call_sign,
                vessel_type: data.vessel_type,
                vessel_subtype: data.vessel_subtype,
                flag: data.flag,
                port_of_registry: data.port_of_registry,
                year_built: data.year_built ? parseInt(data.year_built) : null,
                builder: data.builder,
                hull_number: data.hull_number,
                classification_society: data.classification_society,
                class_notation: data.class_notation,
                status: data.status,
                greek_flag: data.greek_flag === true || data.greek_flag === 'true',
                registry_no: data.registry_no,
                nat_number: data.nat_number,
                ice_class: data.ice_class,
                vessel_value: data.vessel_value ? parseFloat(data.vessel_value) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vessel.update({
                where: {
                    id: vesselId
                },
                data: masterData
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel ownership
        if (section === 'ownership') {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselOwnership.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: data,
                create: {
                    vessel_id: vesselId,
                    ...data
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel commercial
        if (section === 'commercial') {
            const commercialData = {
                ...data,
                charter_start: data.charter_start ? new Date(data.charter_start) : null,
                charter_end: data.charter_end ? new Date(data.charter_end) : null,
                hire_rate: data.hire_rate ? parseFloat(data.hire_rate) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselCommercial.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: commercialData,
                create: {
                    vessel_id: vesselId,
                    ...commercialData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel technical
        if (section === 'technical') {
            const technicalData = {
                ...data,
                loa: data.loa ? parseFloat(data.loa) : null,
                lbp: data.lbp ? parseFloat(data.lbp) : null,
                breadth: data.breadth ? parseFloat(data.breadth) : null,
                depth: data.depth ? parseFloat(data.depth) : null,
                draft_summer: data.draft_summer ? parseFloat(data.draft_summer) : null,
                draft_winter: data.draft_winter ? parseFloat(data.draft_winter) : null,
                air_draft: data.air_draft ? parseFloat(data.air_draft) : null,
                gross_tonnage: data.gross_tonnage ? parseFloat(data.gross_tonnage) : null,
                net_tonnage: data.net_tonnage ? parseFloat(data.net_tonnage) : null,
                deadweight: data.deadweight ? parseFloat(data.deadweight) : null,
                lightship_weight: data.lightship_weight ? parseFloat(data.lightship_weight) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselTechnical.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: technicalData,
                create: {
                    vessel_id: vesselId,
                    ...technicalData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel engine
        if (section === 'engine') {
            const engineData = {
                ...data,
                mcr_power_kw: data.mcr_power_kw ? parseFloat(data.mcr_power_kw) : null,
                rpm: data.rpm ? parseInt(data.rpm) : null,
                engine_rating: data.engine_rating ? parseFloat(data.engine_rating) : null,
                me_rpm_at_mcr: data.me_rpm_at_mcr ? parseInt(data.me_rpm_at_mcr) : null,
                ncr_rpm: data.ncr_rpm ? parseInt(data.ncr_rpm) : null,
                sfoc_max: data.sfoc_max ? parseFloat(data.sfoc_max) : null,
                sfoc_min: data.sfoc_min ? parseFloat(data.sfoc_min) : null,
                no_of_cylinders: data.no_of_cylinders ? parseInt(data.no_of_cylinders) : null,
                no_of_air_coolers: data.no_of_air_coolers ? parseInt(data.no_of_air_coolers) : null,
                me_cons_at_sea: data.me_cons_at_sea ? parseFloat(data.me_cons_at_sea) : null,
                no_of_generators: data.no_of_generators ? parseInt(data.no_of_generators) : null,
                generator_capacity_kw: data.generator_capacity_kw ? parseFloat(data.generator_capacity_kw) : null,
                boiler_capacity: data.boiler_capacity ? parseFloat(data.boiler_capacity) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselEngine.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: engineData,
                create: {
                    vessel_id: vesselId,
                    ...engineData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel propulsion
        if (section === 'propulsion') {
            const propulsionData = {
                ...data,
                no_of_propellers: data.no_of_propellers ? parseInt(data.no_of_propellers) : null,
                propeller_diameter: data.propeller_diameter ? parseFloat(data.propeller_diameter) : null,
                propeller_pitch: data.propeller_pitch ? parseFloat(data.propeller_pitch) : null,
                bollard_pull: data.bollard_pull ? parseFloat(data.bollard_pull) : null,
                bow_thruster_kw: data.bow_thruster_kw ? parseFloat(data.bow_thruster_kw) : null,
                stern_thruster_kw: data.stern_thruster_kw ? parseFloat(data.stern_thruster_kw) : null,
                f_wind: data.f_wind ? parseFloat(data.f_wind) : null,
                p_wind: data.p_wind ? parseFloat(data.p_wind) : null,
                p_prop: data.p_prop ? parseFloat(data.p_prop) : null,
                service_speed: data.service_speed ? parseFloat(data.service_speed) : null,
                max_speed: data.max_speed ? parseFloat(data.max_speed) : null,
                fuel_consumption_sea: data.fuel_consumption_sea ? parseFloat(data.fuel_consumption_sea) : null,
                fuel_consumption_port: data.fuel_consumption_port ? parseFloat(data.fuel_consumption_port) : null,
                propellers_no: data.propellers_no ? parseInt(data.propellers_no) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselPropulsion.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: propulsionData,
                create: {
                    vessel_id: vesselId,
                    ...propulsionData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel tanks
        if (section === 'tanks') {
            const tanksData = {
                ...data,
                cargo_tank_count: data.cargo_tank_count ? parseInt(data.cargo_tank_count) : null,
                cargo_capacity_cbm: data.cargo_capacity_cbm ? parseFloat(data.cargo_capacity_cbm) : null,
                hfo_capacity: data.hfo_capacity ? parseFloat(data.hfo_capacity) : null,
                mgo_capacity: data.mgo_capacity ? parseFloat(data.mgo_capacity) : null,
                lng_capacity: data.lng_capacity ? parseFloat(data.lng_capacity) : null,
                ballast_capacity: data.ballast_capacity ? parseFloat(data.ballast_capacity) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselTanks.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: tanksData,
                create: {
                    vessel_id: vesselId,
                    ...tanksData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel crew config
        if (section === 'crew-config') {
            const crewConfigData = {
                ...data,
                crew_capacity: data.crew_capacity ? parseInt(data.crew_capacity) : null,
                officer_count: data.officer_count ? parseInt(data.officer_count) : null,
                rating_count: data.rating_count ? parseInt(data.rating_count) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselCrewConfig.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: crewConfigData,
                create: {
                    vessel_id: vesselId,
                    ...crewConfigData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel navigation
        if (section === 'navigation') {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselNavigation.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: data,
                create: {
                    vessel_id: vesselId,
                    ...data
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel environment
        if (section === 'environment') {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselEnvironment.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: data,
                create: {
                    vessel_id: vesselId,
                    ...data
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        // Update vessel maintenance
        if (section === 'maintenance') {
            const maintenanceData = {
                pms_system_id: data.pms_system_id,
                last_dry_dock: data.last_dry_dock ? new Date(data.last_dry_dock) : null,
                next_dry_dock: data.next_dry_dock ? new Date(data.next_dry_dock) : null,
                last_survey: data.last_survey ? new Date(data.last_survey) : null,
                next_survey: data.next_survey ? new Date(data.next_survey) : null
            };
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].vesselMaintenance.upsert({
                where: {
                    vessel_id: vesselId
                },
                update: maintenanceData,
                create: {
                    vessel_id: vesselId,
                    ...maintenanceData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid section'
        }, {
            status: 400
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Format error messages for user display
        let userMessage = 'Unable to save vessel information';
        let details = errorMessage;
        if (errorMessage.includes('Expected')) {
            userMessage = 'One or more fields have invalid values. Please check your entries.';
        } else if (errorMessage.includes('Unique constraint')) {
            userMessage = 'This vessel information already exists. Please check for duplicates.';
        } else if (errorMessage.includes('Foreign key')) {
            userMessage = 'One or more referenced values don\'t exist. Please verify your selections.';
        } else if (errorMessage.includes('premature end of input')) {
            userMessage = 'Date format is incorrect. Please use the date picker.';
        } else if (errorMessage.includes('DateTime')) {
            userMessage = 'One or more dates are in an invalid format.';
        }
        console.error('Error updating vessel:', {
            section: body?.section,
            vesselId,
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: userMessage,
            details
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__98143ca2._.js.map