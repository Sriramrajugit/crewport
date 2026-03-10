const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;
let adminToken;
let vesselId;
let itemId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin user and get token
  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@invtest.com',
    password: 'password123',
    role: 'admin'
  });
  adminToken = adminRes.body.token;

  // Create a vessel
  const vesselRes = await request(app)
    .post('/api/vessels')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'MV Inventory Ship',
      imoNumber: 'IMO9999999',
      vesselType: 'Container',
      flag: 'Liberia'
    });
  vesselId = vesselRes.body.data._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const InventoryItem = mongoose.model('InventoryItem');
  await InventoryItem.deleteMany({});
});

describe('Inventory Routes', () => {
  const getItemData = (overrides = {}) => ({
    name: 'Life Jacket',
    category: 'Safety Equipment',
    quantity: 20,
    unit: 'pcs',
    minQuantity: 10,
    vessel: vesselId,
    ...overrides
  });

  describe('POST /api/inventory', () => {
    it('should allow admin to create an inventory item and return 201', async () => {
      const res = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData());

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Life Jacket');
      expect(res.body.data.quantity).toBe(20);
      itemId = res.body.data._id;
    });
  });

  describe('GET /api/inventory', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData());
      itemId = res.body.data._id;
    });

    it('should allow authenticated user to list inventory items', async () => {
      const res = await request(app)
        .get('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/inventory/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData());
      itemId = res.body.data._id;
    });

    it('should get a single inventory item by id', async () => {
      const res = await request(app)
        .get(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(itemId);
    });
  });

  describe('PUT /api/inventory/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData());
      itemId = res.body.data._id;
    });

    it('should allow admin to update inventory item quantity', async () => {
      const res = await request(app)
        .put(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(50);
    });
  });

  describe('DELETE /api/inventory/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData());
      itemId = res.body.data._id;
    });

    it('should allow admin to delete an inventory item', async () => {
      const res = await request(app)
        .delete(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const check = await request(app)
        .get(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(check.statusCode).toBe(404);
    });
  });

  describe('Low Stock Filter', () => {
    it('should return items below minQuantity when lowStock=true', async () => {
      // Create a normal stock item (qty=20, min=10)
      await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData({ name: 'Normal Item', quantity: 20, minQuantity: 10 }));

      // Create a low stock item (qty=5, min=10)
      await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getItemData({ name: 'Low Stock Item', quantity: 5, minQuantity: 10 }));

      const res = await request(app)
        .get('/api/inventory?lowStock=true')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Low Stock Item');
    });
  });
});
