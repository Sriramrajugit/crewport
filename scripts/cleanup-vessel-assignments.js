import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupVesselAssignments() {
    try {
        console.log('Starting cleanup of vessel assignments...\n');

        // Get all VESSEL role users with multiple active vessel assignments
        const vesselUsers = await prisma.user.findMany({
            where: {
                users_roles: {
                    role_name: 'VESSEL'
                },
                deleted_at: null
            },
            include: {
                user_vessels: {
                    where: { is_active: true },
                    include: { vessels: true }
                },
                users_roles: { select: { role_name: true } }
            }
        });

        console.log(`Found ${vesselUsers.length} VESSEL users\n`);

        let usersCleanedUp = 0;

        for (const user of vesselUsers) {
            if (user.user_vessels.length > 1) {
                console.log(`⚠️  User: ${user.email}`);
                console.log(`   Current vessels: ${user.user_vessels.map(uv => uv.vessels.vessel_name).join(', ')}`);
                
                // Keep the first vessel, deactivate the rest
                const vesselToKeep = user.user_vessels[0];
                const vesselsToDeactivate = user.user_vessels.slice(1);

                console.log(`   Keeping: ${vesselToKeep.vessels.vessel_name}`);
                console.log(`   Deactivating: ${vesselsToDeactivate.map(uv => uv.vessels.vessel_name).join(', ')}`);

                // Deactivate extra vessel assignments
                for (const uv of vesselsToDeactivate) {
                    await prisma.user_vessels.update({
                        where: { id: uv.id },
                        data: { is_active: false }
                    });
                }

                usersCleanedUp++;
                console.log('   ✓ Cleaned\n');
            }
        }

        console.log(`\n✅ Cleanup complete!`);
        console.log(`   Users with multiple vessel assignments fixed: ${usersCleanedUp}`);

        if (usersCleanedUp > 0) {
            // Display final state
            console.log('\n📋 Final state after cleanup:');
            const finalUsers = await prisma.user.findMany({
                where: {
                    users_roles: {
                        role_name: 'VESSEL'
                    },
                    deleted_at: null
                },
                include: {
                    user_vessels: {
                        where: { is_active: true },
                        include: { vessels: true }
                    }
                }
            });

            for (const user of finalUsers) {
                console.log(`${user.email}: ${user.user_vessels.length} vessel(s) - ${user.user_vessels.map(uv => uv.vessels.vessel_name).join(', ')}`);
            }
        }

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupVesselAssignments();
