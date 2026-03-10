const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        // Get current date for month/year
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        // Get all crew members that don't have earnings records for this month/year
        const crewWithoutEarnings = await prisma.crewMember.findMany({
            where: {
                deleted_at: null,
                crew_earnings: {
                    none: {
                        month: month,
                        year: year,
                    }
                }
            },
            include: {
                crew_earnings: true,
            }
        });

        console.log(`Found ${crewWithoutEarnings.length} crew members without earnings records for ${month}/${year}`);

        // Create earnings records for those crew members
        for (const crew of crewWithoutEarnings) {
            await prisma.crewEarnings.create({
                data: {
                    crew_member_id: crew.id,
                    month: month,
                    year: year,
                    basic_salary: 0,
                    fixed_overtime: 0,
                    leave_wages: 0,
                    other_allowances: 0,
                    travel_wages: 0,
                    hra: 0,
                    joining_expenses: 0,
                    onboard_allowance_short_manning: 0,
                    total_earnings: 0,
                }
            });
            console.log(`Created earnings for crew member: ${crew.name}`);
        }

        console.log(`\nSuccessfully created earnings records for ${crewWithoutEarnings.length} crew members`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
