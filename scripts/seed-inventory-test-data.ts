import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log('🌱 Seeding test inventory data...\n');

    // Get or create company
    let company = await prisma.company.findFirst();
    if (!company) {
      console.log('❌ No company found. Please create a company first.');
      return;
    }
    console.log(`✓ Using company: ${company.company_name}`);

    // Get a vessel
    let vessel = await prisma.vessel.findFirst({
      where: { company_id: company.id }
    });
    if (!vessel) {
      console.log('❌ No vessel found. Please create a vessel first.');
      return;
    }
    console.log(`✓ Using vessel: ${vessel.vessel_name}`);

    // Get some crew members
    const crew = await prisma.crewMember.findMany({
      where: {
        vessel_id: vessel.id,
        deleted_at: null
      },
      take: 3
    });

    if (crew.length === 0) {
      console.log('❌ No crew members found for this vessel.');
      return;
    }
    console.log(`✓ Found ${crew.length} crew members\n`);

    // Create SLOPCHEST inventory items if they don't exist
    const slopchestItems = [
      { item_code: 'SLC001', item_name: 'Cigarettes', unit_price: 5.00, unit: 'carton', category: 'Tobacco' },
      { item_code: 'SLC002', item_name: 'Alcohol', unit_price: 15.00, unit: 'bottle', category: 'Beverages' },
      { item_code: 'SLC003', item_name: 'Snacks', unit_price: 3.50, unit: 'box', category: 'Food' }
    ];

    console.log('Creating/verifying SLOPCHEST inventory items...');
    const items: any[] = [];
    
    for (const itemData of slopchestItems) {
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
            available_quantity: 100,
            is_active: true
          }
        });
        console.log(`  ✓ Created: ${item.item_name}`);
        items.push(item);
      } else {
        console.log(`  - Exists: ${existing.item_name}`);
        items.push(existing);
      }
    }

    // Current month (May 2026)
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    console.log(`\n📅 Creating consumption records for ${currentMonth}/${currentYear}...\n`);

    // Create consumption records
    const consumptionRecords = [];
    for (let i = 0; i < crew.length; i++) {
      for (let j = 0; j < 2; j++) {
        const item = items[j % items.length];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const totalDeduction = quantity * item.unit_price;

        const existingRecord = await prisma.inventoryConsumption.findFirst({
          where: {
            vessel_id: vessel.id,
            crew_member_id: crew[i].id,
            item_id: item.id,
            month: currentMonth,
            year: currentYear
          }
        });

        if (!existingRecord) {
          const record = await prisma.inventoryConsumption.create({
            data: {
              vessel_id: vessel.id,
              crew_member_id: crew[i].id,
              item_id: item.id,
              consumption_date: new Date(currentYear, currentMonth - 1, Math.floor(Math.random() * 28) + 1),
              month: currentMonth,
              year: currentYear,
              quantity: quantity,
              unit_price: item.unit_price,
              total_deduction: totalDeduction,
              notes: `Test consumption for ${crew[i].name}`,
              created_by: 1
            }
          });
          consumptionRecords.push(record);
          console.log(`  ✓ ${crew[i].name} (${crew[i].rank}): ${quantity} x ${item.item_name} = $${totalDeduction.toFixed(2)}`);
        } else {
          console.log(`  - Exists: ${crew[i].name} - ${item.item_name}`);
        }
      }
    }

    // Create some on-signer (owner) records
    console.log(`\n👤 Creating on-signer consumption records...\n`);
    
    const signerRecords = [
      { name: 'Captain Smith', quantity: 3 },
      { name: 'Chief Engineer', quantity: 2 }
    ];

    for (const signer of signerRecords) {
      const item = items[0]; // Use first item
      
      const existingRecord = await prisma.inventoryOnSigner.findFirst({
        where: {
          vessel_id: vessel.id,
          signer_name: signer.name,
          item_id: item.id,
          month: currentMonth,
          year: currentYear
        }
      });

      if (!existingRecord) {
        const totalDeduction = signer.quantity * item.unit_price;
        const record = await prisma.inventoryOnSigner.create({
          data: {
            vessel_id: vessel.id,
            item_id: item.id,
            signer_name: signer.name,
            consumption_date: new Date(currentYear, currentMonth - 1, 15),
            month: currentMonth,
            year: currentYear,
            quantity: signer.quantity,
            unit_price: item.unit_price,
            total_deduction: totalDeduction,
            remarks: 'Owner consumption',
            created_by: 1
          }
        });
        console.log(`  ✓ ${signer.name}: ${signer.quantity} x ${item.item_name} = $${totalDeduction.toFixed(2)}`);
      } else {
        console.log(`  - Exists: ${signer.name}`);
      }
    }

    console.log('\n✅ Test data seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Inventory items: ${items.length}`);
    console.log(`   - Crew consumption records: ${consumptionRecords.length}`);
    console.log(`   - Vessel: ${vessel.vessel_name}`);
    console.log(`   - Month/Year: ${currentMonth}/${currentYear}`);
    console.log(`\n🧪 Ready to test Portage Bill report!`);

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
