import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Seeding users with proper passwords...\n');

        // Get or create roles
        const adminRole = await prisma.users_roles.upsert({
            where: { role_name: 'ADMIN' },
            update: {},
            create: {
                role_name: 'ADMIN',
                description: 'System Administrator',
            },
        });

        const vesselRole = await prisma.users_roles.upsert({
            where: { role_name: 'VESSEL' },
            update: {},
            create: {
                role_name: 'VESSEL',
                description: 'Vessel User Only',
            },
        });

        // Hash password "password"
        const hashedPassword = await bcrypt.hash('password', 10);

        // Get company
        const company = await prisma.company.findFirst({
            where: { company_code: 'COMP_01' }
        });

        if (!company) {
            console.log('❌ Company COMP_01 not found. Please run seed.ts first.');
            process.exit(1);
        }

        // Get vessels
        const vessels = await prisma.vessel.findMany({
            where: { company_id: company.id }
        });

        console.log(`Found ${vessels.length} vessels in company "${company.company_name}"\n`);

        // Upsert admin user with proper password
        const adminUser = await prisma.user.upsert({
            where: {
                company_id_email: { company_id: company.id, email: 'admin@crewport.com' }
            },
            update: {
                password_hash: hashedPassword,
                is_active: true,
                deleted_at: null
            },
            create: {
                company_id: company.id,
                user_id: 'admin',
                email: 'admin@crewport.com',
                full_name: 'System Admin',
                password_hash: hashedPassword,
                role_id: adminRole.id,
                is_active: true
            }
        });

        console.log(`✅ Admin user: admin@crewport.com (password: password)`);

        // Create or update vessel user if needed
        const vesselUserEmail = 'Master@occangreen.com';
        const vesselUser = await prisma.user.upsert({
            where: {
                company_id_email: { company_id: company.id, email: vesselUserEmail }
            },
            update: {
                password_hash: hashedPassword,
                is_active: true,
                deleted_at: null
            },
            create: {
                company_id: company.id,
                user_id: vesselUserEmail.split('@')[0],
                email: vesselUserEmail,
                full_name: 'Master User',
                password_hash: hashedPassword,
                role_id: vesselRole.id,
                is_active: true
            }
        });

        console.log(`✅ Vessel user: ${vesselUserEmail} (password: password)\n`);

        // Assign vessel user to only the first vessel
        if (vessels.length > 0) {
            // Deactivate any existing assignments
            await prisma.user_vessels.updateMany({
                where: { user_id: vesselUser.id },
                data: { is_active: false }
            });

            // Assign to first vessel only
            const firstVessel = vessels[0];
            await prisma.user_vessels.upsert({
                where: {
                    user_id_vessel_id: {
                        user_id: vesselUser.id,
                        vessel_id: firstVessel.id
                    }
                },
                update: { is_active: true },
                create: {
                    user_id: vesselUser.id,
                    vessel_id: firstVessel.id,
                    role_on_vessel: 'VESSEL_USER',
                    is_active: true
                }
            });

            console.log(`✅ Vessel user assigned to: ${firstVessel.vessel_name}\n`);
        }

        // Display final user status
        console.log('📋 Current Users:');
        const allUsers = await prisma.user.findMany({
            where: { company_id: company.id, deleted_at: null },
            include: {
                users_roles: { select: { role_name: true } },
                user_vessels: {
                    where: { is_active: true },
                    include: { vessels: { select: { vessel_name: true } } }
                }
            }
        });

        for (const user of allUsers) {
            const vesselList = user.user_vessels.map(uv => uv.vessels.vessel_name).join(', ') || 'None';
            console.log(`  ${user.email} [${user.users_roles.role_name}] → ${vesselList}`);
        }

        console.log('\n✅ User seeding complete!');

    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
