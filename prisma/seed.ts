import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial data...')

    // Insert mock Company
    const company = await prisma.company.upsert({
        where: { company_code: 'COMP_01' },
        update: {},
        create: {
            company_name: 'Test Setup Company',
            company_code: 'COMP_01',
            contact_email: 'test@crewport.com',
            is_active: true
        },
    })

    // Insert Roles
    const adminRole = await prisma.users_roles.upsert({
        where: { role_name: 'ADMIN' },
        update: {},
        create: {
            role_name: 'ADMIN',
            description: 'System Administrator',
        },
    })

    await prisma.users_roles.upsert({
        where: { role_name: 'VESSEL' },
        update: {},
        create: {
            role_name: 'VESSEL',
            description: 'Vessel Use Only',
        },
    })

    // Generate bcrypt hash for password "password"
    const hashedPassword = await bcrypt.hash('password', 10)

    // Insert Admin user (password: password)
    await prisma.user.upsert({
        where: {
            company_id_user_id: { company_id: company.id, user_id: 'admin' }
        },
        update: {},
        create: {
            company_id: company.id,
            user_id: 'admin',
            email: 'admin@crewport.com',
            full_name: 'System Admin',
            password_hash: hashedPassword,
            role_id: adminRole.id,
        },
    })

    // Insert Mock Vessels
    await prisma.vessel.upsert({
        where: { company_id_imo_number: { company_id: company.id, imo_number: 'IMO001' } },
        update: {},
        create: {
            company_id: company.id,
            vessel_name: 'Test Vessel 01',
            imo_number: 'IMO001',
            status: 'ACTIVE'
        }
    })

    await prisma.vessel.upsert({
        where: { company_id_imo_number: { company_id: company.id, imo_number: 'IMO002' } },
        update: {},
        create: {
            company_id: company.id,
            vessel_name: 'Test Vessel 02',
            imo_number: 'IMO002',
            status: 'ACTIVE'
        }
    })

    // Insert Mock Ranks
    await prisma.rank.upsert({
        where: { rank_code_company_id: { rank_code: 'CAPT', company_id: company.id } },
        update: {},
        create: {
            rank_name: 'Captain',
            rank_code: 'CAPT',
            company_id: company.id,
            description: 'Captain of the vessel',
            is_active: true
        }
    })

    await prisma.rank.upsert({
        where: { rank_code_company_id: { rank_code: 'CHOE', company_id: company.id } },
        update: {},
        create: {
            rank_name: 'Chief Officer',
            rank_code: 'CHOE',
            company_id: company.id,
            description: 'Chief Officer',
            is_active: true
        }
    })

    await prisma.rank.upsert({
        where: { rank_code_company_id: { rank_code: 'SECOFF', company_id: company.id } },
        update: {},
        create: {
            rank_name: 'Second Officer',
            rank_code: 'SECOFF',
            company_id: company.id,
            description: 'Second Officer',
            is_active: true
        }
    })

    await prisma.rank.upsert({
        where: { rank_code_company_id: { rank_code: 'CMO', company_id: company.id } },
        update: {},
        create: {
            rank_name: 'Chief Engineer',
            rank_code: 'CMO',
            company_id: company.id,
            description: 'Chief Engineer',
            is_active: true
        }
    })

    // Get vessels for crew assignment
    const vessel1 = await prisma.vessel.findFirst({
        where: { imo_number: 'IMO001' }
    })
    const vessel2 = await prisma.vessel.findFirst({
        where: { imo_number: 'IMO002' }
    })

    if (vessel1) {
        // Add Officers to Vessel 1
        const officer1 = await prisma.crewMember.upsert({
            where: { id: 1 },
            update: {},
            create: {
                company_id: company.id,
                vessel_id: vessel1.id,
                name: 'John Smith',
                rank: 'Master',
                position: 'Captain',
                passport_number: 'PAS123456',
                nationality: 'British',
                contact_number: '+44-7900-123456',
                sign_on_date: new Date('2024-01-15'),
                onboarding_status: 'COMPLETED',
                created_by: 1,
            }
        })

        const officer2 = await prisma.crewMember.upsert({
            where: { id: 2 },
            update: {},
            create: {
                company_id: company.id,
                vessel_id: vessel1.id,
                name: 'Robert Johnson',
                rank: 'Chief Officer',
                position: 'Chief Officer',
                passport_number: 'PAS123457',
                nationality: 'Indian',
                contact_number: '+91-9876-543210',
                sign_on_date: new Date('2024-01-20'),
                onboarding_status: 'COMPLETED',
                created_by: 1,
            }
        })

        // Add Ratings to Vessel 1
        const rating1 = await prisma.crewMember.upsert({
            where: { id: 3 },
            update: {},
            create: {
                company_id: company.id,
                vessel_id: vessel1.id,
                name: 'Michael Brown',
                rank: 'Able Seaman',
                position: 'Deck Crew',
                passport_number: 'PAS123458',
                nationality: 'Filipino',
                contact_number: '+63-917-123-4567',
                sign_on_date: new Date('2024-02-01'),
                onboarding_status: 'COMPLETED',
                created_by: 1,
            }
        })

        const rating2 = await prisma.crewMember.upsert({
            where: { id: 4 },
            update: {},
            create: {
                company_id: company.id,
                vessel_id: vessel1.id,
                name: 'David Wilson',
                rank: 'Ordinary Seaman',
                position: 'Deck Crew',
                passport_number: 'PAS123459',
                nationality: 'Indonesian',
                contact_number: '+62-812-345-6789',
                sign_on_date: new Date('2024-02-05'),
                onboarding_status: 'COMPLETED',
                created_by: 1,
            }
        })

        // Add Sample Earnings for March 2026
        const currentMonth = 3 // March 2026
        const currentYear = 2026

        // Officers earnings
        await prisma.crewEarnings.upsert({
            where: { crew_member_id_month_year: { crew_member_id: officer1.id, month: currentMonth, year: currentYear } },
            update: {},
            create: {
                crew_member_id: officer1.id,
                month: currentMonth,
                year: currentYear,
                basic_salary: 5000,
                fixed_overtime: 1000,
                leave_wages: 500,
                other_allowances: 500,
                travel_wages: 0,
                hra: 1500,
                joining_expenses: 0,
                onboard_allowance_short_manning: 0,
                total_earnings: 8500,
                cash_drawn: 2000,
                home_allowance: 1500,
                bond_deduction: 0,
                other_deduction: 500,
                brought_forward: 0
            }
        })

        await prisma.crewEarnings.upsert({
            where: { crew_member_id_month_year: { crew_member_id: officer2.id, month: currentMonth, year: currentYear } },
            update: {},
            create: {
                crew_member_id: officer2.id,
                month: currentMonth,
                year: currentYear,
                basic_salary: 4000,
                fixed_overtime: 800,
                leave_wages: 400,
                other_allowances: 300,
                travel_wages: 0,
                hra: 1200,
                joining_expenses: 0,
                onboard_allowance_short_manning: 0,
                total_earnings: 6700,
                cash_drawn: 1500,
                home_allowance: 1200,
                bond_deduction: 0,
                other_deduction: 400,
                brought_forward: 0
            }
        })

        // Ratings earnings
        await prisma.crewEarnings.upsert({
            where: { crew_member_id_month_year: { crew_member_id: rating1.id, month: currentMonth, year: currentYear } },
            update: {},
            create: {
                crew_member_id: rating1.id,
                month: currentMonth,
                year: currentYear,
                basic_salary: 2000,
                fixed_overtime: 400,
                leave_wages: 200,
                other_allowances: 150,
                travel_wages: 0,
                hra: 600,
                joining_expenses: 0,
                onboard_allowance_short_manning: 0,
                total_earnings: 3350,
                cash_drawn: 800,
                home_allowance: 600,
                bond_deduction: 0,
                other_deduction: 200,
                brought_forward: 0
            }
        })

        await prisma.crewEarnings.upsert({
            where: { crew_member_id_month_year: { crew_member_id: rating2.id, month: currentMonth, year: currentYear } },
            update: {},
            create: {
                crew_member_id: rating2.id,
                month: currentMonth,
                year: currentYear,
                basic_salary: 1800,
                fixed_overtime: 350,
                leave_wages: 150,
                other_allowances: 100,
                travel_wages: 0,
                hra: 540,
                joining_expenses: 0,
                onboard_allowance_short_manning: 0,
                total_earnings: 2940,
                cash_drawn: 700,
                home_allowance: 540,
                bond_deduction: 0,
                other_deduction: 180,
                brought_forward: 0
            }
        })
    }

    // Assign admin user to vessels
    const adminUser = await prisma.user.findFirst({
        where: { email: 'admin@crewport.com' }
    })

    if (adminUser && vessel1 && vessel2) {
        // Assign admin to Vessel 1
        await prisma.user_vessels.upsert({
            where: {
                user_id_vessel_id: { user_id: adminUser.id, vessel_id: vessel1.id }
            },
            update: { is_active: true },
            create: {
                user_id: adminUser.id,
                vessel_id: vessel1.id,
                role_on_vessel: 'ADMIN',
                is_active: true
            }
        })

        // Assign admin to Vessel 2
        await prisma.user_vessels.upsert({
            where: {
                user_id_vessel_id: { user_id: adminUser.id, vessel_id: vessel2.id }
            },
            update: { is_active: true },
            create: {
                user_id: adminUser.id,
                vessel_id: vessel2.id,
                role_on_vessel: 'ADMIN',
                is_active: true
            }
        })

        console.log(`✓ Admin user (ID: ${adminUser.id}) assigned to ${vessel1.vessel_name} and ${vessel2.vessel_name}`)
    }

    console.log('Seed check complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
