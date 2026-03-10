import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSlopchestItems() {
  try {
    console.log('Seeding slopchest items...');

    const items = [
      { item_name: 'Coffee - Instant', item_code: 'ITEM001', unit_price: 150.00, unit: 'jar', category: 'Beverages' },
      { item_name: 'Tea - Black Premium', item_code: 'ITEM002', unit_price: 200.00, unit: 'kg', category: 'Beverages' },
      { item_name: 'Sugar - Granulated', item_code: 'ITEM003', unit_price: 80.00, unit: 'kg', category: 'Provisions' },
      { item_name: 'Milk Powder', item_code: 'ITEM004', unit_price: 450.00, unit: 'kg', category: 'Dairy' },
      { item_name: 'Butter - Salted', item_code: 'ITEM005', unit_price: 350.00, unit: 'kg', category: 'Dairy' },
      { item_name: 'Chocolate Spread', item_code: 'ITEM006', unit_price: 280.00, unit: 'jar', category: 'Breakfast Items' },
      { item_name: 'Wheat Flour', item_code: 'ITEM007', unit_price: 60.00, unit: 'kg', category: 'Provisions' },
      { item_name: 'Rice - Basmati', item_code: 'ITEM008', unit_price: 120.00, unit: 'kg', category: 'Provisions' },
      { item_name: 'Cooking Oil', item_code: 'ITEM009', unit_price: 140.00, unit: 'litre', category: 'Cooking Items' },
      { item_name: 'Salt - Iodized', item_code: 'ITEM010', unit_price: 40.00, unit: 'kg', category: 'Provisions' },
      { item_name: 'Spices - Mixed', item_code: 'ITEM011', unit_price: 500.00, unit: 'kg', category: 'Spices' },
      { item_name: 'Tomato Sauce', item_code: 'ITEM012', unit_price: 180.00, unit: 'bottle', category: 'Condiments' },
      { item_name: 'Biscuits - Assorted', item_code: 'ITEM013', unit_price: 220.00, unit: 'carton', category: 'Breakfast Items' },
      { item_name: 'Fruits - Fresh', item_code: 'ITEM014', unit_price: 450.00, unit: 'bunch', category: 'Fresh Produce' },
      { item_name: 'Vegetables - Mixed', item_code: 'ITEM015', unit_price: 380.00, unit: 'set', category: 'Fresh Produce' },
    ];

    // Get company ID (assuming company_id = 1)
    const company = await prisma.company.findFirst();
    if (!company) {
      console.log('No company found. Please create a company first.');
      return;
    }

    for (const item of items) {
      const existingItem = await prisma.slopchestItem.findFirst({
        where: {
          company_id: company.id,
          item_code: item.item_code
        }
      });

      if (!existingItem) {
        const createdItem = await prisma.slopchestItem.create({
          data: {
            company_id: company.id,
            ...item,
            is_active: true
          }
        });
        console.log(`✓ Created: ${createdItem.item_name}`);
      } else {
        console.log(`- Already exists: ${item.item_name}`);
      }
    }

    console.log('\n✅ Slopchest items seeded successfully!');
  } catch (error) {
    console.error('Error seeding slopchest items:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedSlopchestItems();
