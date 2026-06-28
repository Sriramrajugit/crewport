import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInventoryItems() {
  try {
    console.log('Seeding inventory items...');

    const items = [
      { item_name: 'Coffee - Instant', item_code: 'ITEM001', unit_price: 150.00, unit: 'jar', category: 'Beverages', inventory_type: 'VICTUALLING' },
      { item_name: 'Tea - Black Premium', item_code: 'ITEM002', unit_price: 200.00, unit: 'kg', category: 'Beverages', inventory_type: 'VICTUALLING' },
      { item_name: 'Sugar - Granulated', item_code: 'ITEM003', unit_price: 80.00, unit: 'kg', category: 'Provisions', inventory_type: 'VICTUALLING' },
      { item_name: 'Milk Powder', item_code: 'ITEM004', unit_price: 450.00, unit: 'kg', category: 'Dairy', inventory_type: 'VICTUALLING' },
      { item_name: 'Butter - Salted', item_code: 'ITEM005', unit_price: 350.00, unit: 'kg', category: 'Dairy', inventory_type: 'VICTUALLING' },
      { item_name: 'Chocolate Spread', item_code: 'ITEM006', unit_price: 280.00, unit: 'jar', category: 'Breakfast Items', inventory_type: 'VICTUALLING' },
      { item_name: 'Wheat Flour', item_code: 'ITEM007', unit_price: 60.00, unit: 'kg', category: 'Provisions', inventory_type: 'VICTUALLING' },
      { item_name: 'Rice - Basmati', item_code: 'ITEM008', unit_price: 120.00, unit: 'kg', category: 'Provisions', inventory_type: 'VICTUALLING' },
      { item_name: 'Cooking Oil', item_code: 'ITEM009', unit_price: 140.00, unit: 'litre', category: 'Cooking Items', inventory_type: 'VICTUALLING' },
      { item_name: 'Salt - Iodized', item_code: 'ITEM010', unit_price: 40.00, unit: 'kg', category: 'Provisions', inventory_type: 'VICTUALLING' },
      { item_name: 'Spices - Mixed', item_code: 'ITEM011', unit_price: 500.00, unit: 'kg', category: 'Spices', inventory_type: 'VICTUALLING' },
      { item_name: 'Tomato Sauce', item_code: 'ITEM012', unit_price: 180.00, unit: 'bottle', category: 'Condiments', inventory_type: 'VICTUALLING' },
      { item_name: 'Biscuits - Assorted', item_code: 'ITEM013', unit_price: 220.00, unit: 'carton', category: 'Breakfast Items', inventory_type: 'VICTUALLING' },
      { item_name: 'Fruits - Fresh', item_code: 'ITEM014', unit_price: 450.00, unit: 'bunch', category: 'Fresh Produce', inventory_type: 'VICTUALLING' },
      { item_name: 'Vegetables - Mixed', item_code: 'ITEM015', unit_price: 380.00, unit: 'set', category: 'Fresh Produce', inventory_type: 'VICTUALLING' },
    ];

    // Get company ID (assuming company_id = 1)
    const company = await prisma.company.findFirst();
    if (!company) {
      console.log('No company found. Please create a company first.');
      return;
    }

    for (const item of items) {
      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          company_id: company.id,
          item_code: item.item_code,
          inventory_type: item.inventory_type
        }
      });

      if (!existingItem) {
        const createdItem = await prisma.inventoryItem.create({
          data: {
            company_id: company.id,
            ...item,
            is_active: true
          }
        });
        console.log(`✓ Created: ${createdItem.item_name} (${createdItem.inventory_type})`);
      } else {
        console.log(`- Already exists: ${item.item_name}`);
      }
    }

    console.log('\n✅ Inventory items seeded successfully!');
  } catch (error) {
    console.error('Error seeding inventory items:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedInventoryItems();
