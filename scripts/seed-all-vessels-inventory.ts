import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAllVesselsInventory() {
  try {
    console.log('🌱 Seeding inventory data for ALL vessels...\n');

    // Get all companies
    const companies = await prisma.company.findMany();
    
    if (companies.length === 0) {
      console.log('❌ No companies found.');
      return;
    }

    console.log(`📦 Found ${companies.length} company/companies\n`);

    // Inventory item templates for SLOPCHEST
    const slopchestTemplate = [
      { item_code: 'SLC001', item_name: 'Cigarettes', unit_price: 5.00, unit: 'carton', category: 'Tobacco' },
      { item_code: 'SLC002', item_name: 'Alcohol', unit_price: 15.00, unit: 'bottle', category: 'Beverages' },
      { item_code: 'SLC003', item_name: 'Snacks', unit_price: 3.50, unit: 'box', category: 'Food' },
      { item_code: 'SLC004', item_name: 'Tea/Coffee', unit_price: 2.50, unit: 'pack', category: 'Beverages' },
      { item_code: 'SLC005', item_name: 'Toiletries', unit_price: 8.00, unit: 'set', category: 'Personal Care' }
    ];

    // Inventory item templates for VICTUALLING
    const victuallingTemplate = [
      { item_code: 'VIC001', item_name: 'Fresh Vegetables', unit_price: 12.00, unit: 'kg', category: 'Produce' },
      { item_code: 'VIC002', item_name: 'Meat', unit_price: 25.00, unit: 'kg', category: 'Meat' },
      { item_code: 'VIC003', item_name: 'Flour', unit_price: 3.00, unit: 'kg', category: 'Staples' },
      { item_code: 'VIC004', item_name: 'Oil', unit_price: 8.00, unit: 'liter', category: 'Cooking' },
      { item_code: 'VIC005', item_name: 'Spices', unit_price: 15.00, unit: 'kg', category: 'Condiments' }
    ];

    // Get current month
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Process each company
    for (const company of companies) {
      console.log(`\n🏢 Processing company: ${company.company_name}`);
      
      // Get all vessels for this company
      const vessels = await prisma.vessel.findMany({
        where: { company_id: company.id }
      });

      if (vessels.length === 0) {
        console.log(`  ⚠️ No vessels found for this company`);
        continue;
      }

      console.log(`  📍 Found ${vessels.length} vessel(s) for this company\n`);

      // Process each vessel
      for (const vessel of vessels) {
        console.log(`  ⛵ Vessel: ${vessel.vessel_name} (ID: ${vessel.id})`);

        // Get crew members for this vessel
        const crewMembers = await prisma.crewMember.findMany({
          where: {
            vessel_id: vessel.id,
            deleted_at: null
          },
          take: 5
        });

        // Create SLOPCHEST items for this vessel
        const slopchestItems: any[] = [];
        for (const itemData of slopchestTemplate) {
          const existing = await prisma.inventoryItem.findFirst({
            where: {
              vessel_id: vessel.id,
              item_code: itemData.item_code,
              inventory_type: 'SLOPCHEST'
            }
          });

          if (!existing) {
            const item = await prisma.inventoryItem.create({
              data: {
                company_id: company.id,
                vessel_id: vessel.id,
                inventory_type: 'SLOPCHEST',
                ...itemData,
                available_quantity: 200,
                is_active: true
              }
            });
            slopchestItems.push(item);
            console.log(`    ✓ SLOPCHEST: ${item.item_name}`);
          } else {
            slopchestItems.push(existing);
          }
        }

        // Create VICTUALLING items for this vessel
        const victuallingItems: any[] = [];
        for (const itemData of victuallingTemplate) {
          const existing = await prisma.inventoryItem.findFirst({
            where: {
              vessel_id: vessel.id,
              item_code: itemData.item_code,
              inventory_type: 'VICTUALLING'
            }
          });

          if (!existing) {
            const item = await prisma.inventoryItem.create({
              data: {
                company_id: company.id,
                vessel_id: vessel.id,
                inventory_type: 'VICTUALLING',
                ...itemData,
                available_quantity: 500,
                is_active: true
              }
            });
            victuallingItems.push(item);
            console.log(`    ✓ VICTUALLING: ${item.item_name}`);
          } else {
            victuallingItems.push(existing);
          }
        }

        // Create some consumption records for crew if crew members exist
        if (crewMembers.length > 0 && slopchestItems.length > 0) {
          console.log(`\n    📝 Creating SLOPCHEST consumption records...`);
          
          let consumptionCount = 0;
          for (let i = 0; i < crewMembers.length; i++) {
            // Create 2-3 consumption records per crew member
            const numRecords = Math.floor(Math.random() * 2) + 2;
            
            for (let j = 0; j < numRecords && j < slopchestItems.length; j++) {
              const item = slopchestItems[j];
              const quantity = Math.floor(Math.random() * 5) + 1;
              const totalDeduction = quantity * item.unit_price;

              const existing = await prisma.inventoryConsumption.findFirst({
                where: {
                  vessel_id: vessel.id,
                  crew_member_id: crewMembers[i].id,
                  item_id: item.id,
                  month: currentMonth,
                  year: currentYear
                }
              });

              if (!existing) {
                await prisma.inventoryConsumption.create({
                  data: {
                    vessel_id: vessel.id,
                    crew_member_id: crewMembers[i].id,
                    item_id: item.id,
                    consumption_date: new Date(
                      currentYear,
                      currentMonth - 1,
                      Math.floor(Math.random() * 28) + 1
                    ),
                    month: currentMonth,
                    year: currentYear,
                    quantity: quantity,
                    unit_price: item.unit_price,
                    total_deduction: totalDeduction,
                    notes: `Test consumption for ${crewMembers[i].name}`,
                    created_by: 1
                  }
                });
                consumptionCount++;
              }
            }
          }
          console.log(`    ✓ Created ${consumptionCount} SLOPCHEST consumption records`);
        }

        // Create on-signer records for owner/charterer
        if (slopchestItems.length > 0) {
          console.log(`\n    👤 Creating on-signer (owner/charterer) records...`);
          
          const signers = ['Captain Smith', 'Chief Engineer', 'Harbour Master'];
          let signerCount = 0;

          for (const signer of signers) {
            const item = slopchestItems[Math.floor(Math.random() * slopchestItems.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const totalDeduction = quantity * item.unit_price;

            const existing = await prisma.inventoryOnSigner.findFirst({
              where: {
                vessel_id: vessel.id,
                signer_name: signer,
                item_id: item.id,
                month: currentMonth,
                year: currentYear
              }
            });

            if (!existing) {
              await prisma.inventoryOnSigner.create({
                data: {
                  vessel_id: vessel.id,
                  item_id: item.id,
                  signer_name: signer,
                  consumption_date: new Date(
                    currentYear,
                    currentMonth - 1,
                    Math.floor(Math.random() * 28) + 1
                  ),
                  month: currentMonth,
                  year: currentYear,
                  quantity: quantity,
                  unit_price: item.unit_price,
                  total_deduction: totalDeduction,
                  remarks: `Test on-signer entry for ${signer}`,
                  created_by: 1
                }
              });
              signerCount++;
            }
          }
          console.log(`    ✓ Created ${signerCount} on-signer records`);
        }

        console.log(`  ✅ Completed for vessel: ${vessel.vessel_name}\n`);
      }
    }

    console.log('\n✅ Test data seeded successfully for all vessels!\n');

    // Print summary statistics
    console.log('📊 Summary Statistics:');
    const totalItems = await prisma.inventoryItem.count();
    const totalConsumptions = await prisma.inventoryConsumption.count();
    const totalOnSigners = await prisma.inventoryOnSigner.count();

    console.log(`   - Total inventory items: ${totalItems}`);
    console.log(`   - Total consumption records: ${totalConsumptions}`);
    console.log(`   - Total on-signer records: ${totalOnSigners}`);

    // Group by vessel
    const itemsByVessel = await prisma.inventoryItem.groupBy({
      by: ['vessel_id'],
      _count: {
        id: true
      }
    });

    console.log(`\n📍 Items per vessel:`);
    for (const group of itemsByVessel) {
      const vessel = await prisma.vessel.findUnique({
        where: { id: group.vessel_id }
      });
      console.log(`   - ${vessel?.vessel_name}: ${group._count.id} items`);
    }

    console.log('\n🧪 Ready to test inventory across all vessels!\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllVesselsInventory();
