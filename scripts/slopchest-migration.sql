-- Add consumption_date field to slopchest_consumptions table
ALTER TABLE slopchest_consumptions 
ADD COLUMN consumption_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Add consumption_date field to slopchest_on_signers table
ALTER TABLE slopchest_on_signers 
ADD COLUMN consumption_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Add test data for SlopchestItem (sample crew items)
INSERT INTO slopchest_items (company_id, item_name, item_code, unit_price, unit, category, is_active, created_at, updated_at)
VALUES 
  (1, 'Coffee - Instant', 'ITEM001', 150.00, 'jar', 'Beverages', true, NOW(), NOW()),
  (1, 'Tea - Black Premium', 'ITEM002', 200.00, 'kg', 'Beverages', true, NOW(), NOW()),
  (1, 'Sugar - Granulated', 'ITEM003', 80.00, 'kg', 'Provisions', true, NOW(), NOW()),
  (1, 'Milk Powder', 'ITEM004', 450.00, 'kg', 'Dairy', true, NOW(), NOW()),
  (1, 'Butter - Salted', 'ITEM005', 350.00, 'kg', 'Dairy', true, NOW(), NOW()),
  (1, 'Chocolate Spread', 'ITEM006', 280.00, 'jar', 'Breakfast Items', true, NOW(), NOW()),
  (1, 'Wheat Flour', 'ITEM007', 60.00, 'kg', 'Provisions', true, NOW(), NOW()),
  (1, 'Rice - Basmati', 'ITEM008', 120.00, 'kg', 'Provisions', true, NOW(), NOW()),
  (1, 'Cooking Oil', 'ITEM009', 140.00, 'litre', 'Cooking Items', true, NOW(), NOW()),
  (1, 'Salt - Iodized', 'ITEM010', 40.00, 'kg', 'Provisions', true, NOW(), NOW()),
  (1, 'Spices - Mixed', 'ITEM011', 500.00, 'kg', 'Spices', true, NOW(), NOW()),
  (1, 'Tomato Sauce', 'ITEM012', 180.00, 'bottle', 'Condiments', true, NOW(), NOW()),
  (1, 'Biscuits - Assorted', 'ITEM013', 220.00, 'carton', 'Breakfast Items', true, NOW(), NOW()),
  (1, 'Fruits - Fresh', 'ITEM014', 450.00, 'bunch', 'Fresh Produce', true, NOW(), NOW()),
  (1, 'Vegetables - Mixed', 'ITEM015', 380.00, 'set', 'Fresh Produce', true, NOW(), NOW());

-- Print confirmation
SELECT COUNT(*) as "Items Created", 'Slopchest items data inserted successfully' as "Status" FROM slopchest_items WHERE item_code LIKE 'ITEM%';
