const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;
let adminToken;
let vesselId;
let crewUserId;
let crewMemberId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin user and get token
  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@crewtest.com',
    password: 'password123',
    role: 'admin'
  });
  adminToken = adminRes.body.token;

  // Create a vessel
  const vesselRes = await request(app)
    .post('/api/vessels')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'MV Test Ship',
      imoNumber: 'IMO1234567',
      vesselType: 'Tanker',
      flag: 'Panama'
    });
  vesselId = vesselRes.body.data._id;

  // Create a crew user
  const crewRes = await request(app).post('/api/auth/register').send({
    name: 'Crew Member',
    email: 'crew@crewtest.com',
    password: 'password123',
    role: 'crew'
  });
  crewUserId = crewRes.body.user.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Only clear crew members between tests, keep users and vessel
  const CrewMember = mongoose.model('CrewMember');
  await CrewMember.deleteMany({});
});

describe('Crew Routes', () => {
  const getCrewData = () => ({
    user: crewUserId,
    rank: 'Captain',
    nationality: 'Filipino',
    passportNumber: 'P1234567',
    vessel: vesselId
  });

  describe('POST /api/crew', () => {
    it('should allow admin to create a crew member and return 201', async () => {
      const res = await request(app)
        .post('/api/crew')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getCrewData());

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.rank).toBe('Captain');
      crewMemberId = res.body.data._id;
    });
  });

  describe('GET /api/crew', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/crew')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getCrewData());
      crewMemberId = res.body.data._id;
    });

    it('should allow admin to list all crew members', async () => {
      const res = await request(app)
        .get('/api/crew')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/crew/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/crew')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getCrewData());
      crewMemberId = res.body.data._id;
    });

    it('should get a single crew member by id', async () => {
      const res = await request(app)
        .get(`/api/crew/${crewMemberId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(crewMemberId);
    });
  });

  describe('PUT /api/crew/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/crew')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getCrewData());
      crewMemberId = res.body.data._id;
    });

    it('should allow admin to update crew member status', async () => {
      const res = await request(app)
        .put(`/api/crew/${crewMemberId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'onboard' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('onboard');
    });
  });

  describe('DELETE /api/crew/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/crew')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(getCrewData());
      crewMemberId = res.body.data._id;
    });

    it('should allow admin to delete a crew member', async () => {
      const res = await request(app)
        .delete(`/api/crew/${crewMemberId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const check = await request(app)
        .get(`/api/crew/${crewMemberId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(check.statusCode).toBe(404);
    });
  });
});
