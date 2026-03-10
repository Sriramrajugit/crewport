const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Auth Routes', () => {
  const validUser = {
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201 with token and user object', async () => {
      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user.role).toBe('admin');
      expect(res.body.user.id).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should login with valid credentials and return 200 with token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: validUser.email,
        password: validUser.password
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(validUser.email);
    });

    it('should return 401 for invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: validUser.email,
        password: 'wrongpassword'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@test.com',
        password: 'password123'
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
