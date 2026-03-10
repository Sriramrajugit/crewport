import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Get all crew members without salary defined
        const crewMembers = await prisma.crewMember.findMany({
            where: {
                deleted_at: null
            }
        });

        console.log(`Found ${crewMembers.length} crew members`);

        // Update each with sample salary data
        for (const crew of crewMembers) {
            if (!crew.total_earnings) {
                await prisma.crewMember.update({
                    where: { id: crew.id },
                    data: {
                        basic_salary: 3500,
                        fixed_overtime: 500,
                        leave_wages: 200,
                        other_allowances: 300,
                        travel_wages: 0,
                        hra: 400,
                        joining_expenses: 0,
                        onboard_allowance_short_manning: 0,
                        total_earnings: 4900,
                    }
                });
                console.log(`Updated salary for: ${crew.name}`);
            }
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
