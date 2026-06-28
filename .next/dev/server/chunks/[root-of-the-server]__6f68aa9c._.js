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
"[project]/app/api/auth/me/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/accessControl.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        // Try to get user ID from request (will look up by email)
        const userId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$accessControl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserIdFromRequest"])(request);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not authenticated'
            }, {
                status: 401
            });
        }
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                id: userId,
                deleted_at: null
            },
            include: {
                user_vessels: {
                    where: {
                        is_active: true
                    },
                    include: {
                        vessels: {
                            select: {
                                id: true,
                                vessel_name: true,
                                company_id: true,
                                companies: {
                                    select: {
                                        company_name: true
                                    }
                                }
                            }
                        }
                    }
                },
                users_roles: {
                    select: {
                        role_name: true,
                        permissions: true
                    }
                },
                companies: {
                    select: {
                        id: true,
                        company_name: true
                    }
                }
            }
        });
        if (!user || !user.is_active) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not found or inactive'
            }, {
                status: 401
            });
        }
        // Check if user is admin
        const isAdmin = user.users_roles.role_name === 'ADMIN' || user.users_roles.role_name === 'SUPER_ADMIN';
        console.log(`[Auth] User ID: ${userId}, Email: ${user.email}, Role: ${user.users_roles.role_name}, IsAdmin: ${isAdmin}`);
        // For all users (including admin), use assigned vessels only
        // This ensures access control: users can only see vessels they're assigned to
        console.log(`[Auth] Fetching assigned vessels. Found ${user.user_vessels.length} assigned vessels`);
        const vessels = user.user_vessels.map((uv)=>({
                vessel_id: uv.vessels.id,
                vessel_name: uv.vessels.vessel_name,
                company_name: uv.vessels.companies.company_name,
                role_on_vessel: isAdmin ? 'ADMIN' : uv.role_on_vessel
            }));
        // Format response with assigned vessels
        console.log(`[Auth/Me] Returning ${vessels.length} vessels for user ${user.email} (Role: ${user.users_roles.role_name})`);
        console.log(`[Auth/Me] Vessels:`, vessels.map((v)=>v.vessel_name));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.users_roles.role_name,
            company: user.companies,
            assigned_vessels: vessels,
            permissions: user.users_roles.permissions || [],
            is_admin: isAdmin
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch profile'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6f68aa9c._.js.map