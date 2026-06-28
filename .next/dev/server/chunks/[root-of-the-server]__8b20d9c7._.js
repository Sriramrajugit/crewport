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
"[project]/app/api/hra/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
;
;
// Helper function to check if date ranges overlap
function dateRangesOverlap(start1, end1, start2, end2) {
    return start1 <= end2 && start2 <= end1;
}
async function POST(request) {
    try {
        const body = await request.json();
        // Support both old format and new format
        const { month, hraEntries, hra_data, hra_end_date, vesselId: oldVesselId, year: oldYear } = body;
        // Determine if using new or old format
        let isNewFormat = !!(month && hra_data);
        let processData = hra_data || hraEntries;
        let monthValue, yearValue;
        if (isNewFormat && month) {
            // New format: month is YYYY-MM-DD string
            const dateObj = new Date(month);
            monthValue = dateObj.getMonth() + 1;
            yearValue = dateObj.getFullYear();
        } else {
            // Old format: month and year are separate
            monthValue = parseInt(month);
            yearValue = parseInt(oldYear);
        }
        // Validate
        if (!processData || !Array.isArray(processData) || !monthValue || !yearValue) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid request body'
            }, {
                status: 400
            });
        }
        // Check for duplicates/overlaps BEFORE making any changes
        for (const entry of processData){
            if (!entry.crew_id) continue;
            const crewId = entry.crew_id;
            if (isNewFormat) {
                const newStartDate = new Date(month);
                const newEndDate = hra_end_date ? new Date(hra_end_date) : newStartDate;
                // Get existing HRA entries for this crew in the same month/year
                const existingEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.findMany({
                    where: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue
                    }
                });
                // Check for overlapping date ranges
                for (const existing of existingEntries){
                    const existingStart = new Date(existing.hra_period_start || existing.hra_date);
                    const existingEnd = new Date(existing.hra_period_end || existing.hra_date);
                    if (dateRangesOverlap(newStartDate, newEndDate, existingStart, existingEnd)) {
                        // Get crew member name for better error message
                        const crewMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewMember.findUnique({
                            where: {
                                id: crewId
                            }
                        });
                        const crewName = crewMember?.name || `Crew ID ${crewId}`;
                        const existingStartStr = existingStart.toLocaleDateString();
                        const existingEndStr = existingEnd.toLocaleDateString();
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: `HRA entry already exists for ${crewName} with overlapping dates (${existingStartStr} to ${existingEndStr}). Please choose different dates or delete the existing entry first.`,
                            conflictingEntryId: existing.id,
                            conflictingDates: {
                                start: existingStartStr,
                                end: existingEndStr
                            }
                        }, {
                            status: 409
                        });
                    }
                }
            }
        }
        // Process each entry (no overlaps found)
        for (const entry of processData){
            if (!entry.crew_id) continue;
            const crewId = entry.crew_id;
            let hraAmount = 0;
            if (isNewFormat) {
                // New format: use calculated_amount directly
                hraAmount = parseFloat(String(entry.calculated_amount)) || 0;
            } else {
                // Old format: multiple entries, sum them
                hraAmount = parseFloat(String(entry.hra_amount)) || 0;
            }
            // Create a single HRA entry for the new format (no delete, just add)
            if (isNewFormat) {
                const hraPeriodStart = new Date(month);
                const hraPeriodEnd = hra_end_date ? new Date(hra_end_date) : hraPeriodStart;
                const daysCalculated = entry.days_calculated || 0;
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.create({
                    data: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue,
                        hra_date: hraPeriodStart,
                        hra_period_start: hraPeriodStart,
                        hra_period_end: hraPeriodEnd,
                        days_calculated: daysCalculated,
                        hra_amount: hraAmount
                    }
                });
            } else {
                // Old format: create multiple entries
                const oldFormatEntries = processData.filter((e)=>e.crew_id === crewId);
                for (const oldEntry of oldFormatEntries){
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.create({
                        data: {
                            crew_member_id: crewId,
                            month: monthValue,
                            year: yearValue,
                            hra_date: new Date(oldEntry.hra_date),
                            hra_amount: parseFloat(oldEntry.hra_amount)
                        }
                    });
                }
                hraAmount = oldFormatEntries.reduce((sum, e)=>sum + parseFloat(String(e.hra_amount)), 0);
            }
            // Calculate total HRA for the month by summing all entries
            const allHRAEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.findMany({
                where: {
                    crew_member_id: crewId,
                    month: monthValue,
                    year: yearValue
                }
            });
            const totalHRA = allHRAEntries.reduce((sum, e)=>sum + parseFloat(String(e.hra_amount)), 0);
            // Update CrewMember.hra with total
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewMember.update({
                where: {
                    id: crewId
                },
                data: {
                    hra: totalHRA
                }
            });
            // Update CrewEarnings record for this month/year
            const existingEarning = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewEarnings.findUnique({
                where: {
                    crew_member_id_month_year: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue
                    }
                }
            });
            if (existingEarning) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewEarnings.update({
                    where: {
                        id: existingEarning.id
                    },
                    data: {
                        hra: totalHRA
                    }
                });
            } else {
                // Create new CrewEarnings record if it doesn't exist
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewEarnings.create({
                    data: {
                        crew_member_id: crewId,
                        month: monthValue,
                        year: yearValue,
                        hra: totalHRA
                    }
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'HRA entries saved successfully'
        });
    } catch (error) {
        console.error('HRA save error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to save HRA entries'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const vesselId = searchParams.get('vesselId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        if (!vesselId || !month || !year) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required parameters'
            }, {
                status: 400
            });
        }
        // Fetch HRA entries for the given month/year and vessel
        const hraEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.findMany({
            where: {
                month: parseInt(month),
                year: parseInt(year),
                crew_members: {
                    vessel_id: parseInt(vesselId)
                }
            },
            include: {
                crew_members: {
                    select: {
                        id: true,
                        name: true,
                        passport_number: true
                    }
                }
            },
            orderBy: {
                crew_member_id: 'asc'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(hraEntries);
    } catch (error) {
        console.error('HRA fetch error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch HRA entries'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const body = await request.json();
        const { id } = body;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing HRA entry ID'
            }, {
                status: 400
            });
        }
        // Find the HRA entry to get crew_id, month, year for recalculation
        const hraEntry = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!hraEntry) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'HRA entry not found'
            }, {
                status: 404
            });
        }
        // Delete the HRA entry
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.delete({
            where: {
                id: parseInt(id)
            }
        });
        // Recalculate total HRA for the crew member in that month
        const remainingEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewHRAEntry.findMany({
            where: {
                crew_member_id: hraEntry.crew_member_id,
                month: hraEntry.month,
                year: hraEntry.year
            }
        });
        const totalHRA = remainingEntries.reduce((sum, e)=>sum + parseFloat(String(e.hra_amount)), 0);
        // Update CrewMember.hra
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewMember.update({
            where: {
                id: hraEntry.crew_member_id
            },
            data: {
                hra: totalHRA
            }
        });
        // Update CrewEarnings record
        const existingEarning = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewEarnings.findUnique({
            where: {
                crew_member_id_month_year: {
                    crew_member_id: hraEntry.crew_member_id,
                    month: hraEntry.month,
                    year: hraEntry.year
                }
            }
        });
        if (existingEarning) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].crewEarnings.update({
                where: {
                    id: existingEarning.id
                },
                data: {
                    hra: totalHRA
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'HRA entry deleted successfully'
        });
    } catch (error) {
        console.error('HRA delete error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete HRA entry'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8b20d9c7._.js.map