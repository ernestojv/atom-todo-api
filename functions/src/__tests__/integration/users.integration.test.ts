import request from 'supertest';
import { Application } from 'express';
import { createTestApp, testUser, cleanupTestUser } from './test-helpers';

describe('Users Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await cleanupTestUser(app);
  });

  afterEach(async () => {
    await cleanupTestUser(app);
  });

  describe('POST /api/users', () => {
    it('should create user successfully', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.isActive).toBe(true);
    });

    it('should fail to create duplicate user', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const response = await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      expect(response.status).toBe(409);
      expect(response.body.error.message).toContain('ya existe');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/users/check', () => {
    it('should return true for existing user', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const response = await request(app)
        .get('/api/users/check')
        .query({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.data.exists).toBe(true);
    });

    it('should return false for non-existing user', async () => {
      const response = await request(app)
        .get('/api/users/check')
        .query({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.data.exists).toBe(false);
    });
  });

  describe('GET /api/users/email/:email', () => {
    it('should get user by email', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const response = await request(app)
        .get(`/api/users/email/${encodeURIComponent(testUser.email)}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.id).toBe(createResponse.body.data.id);
    });

    it('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .get('/api/users/email/nonexistent@example.com');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const userId = createResponse.body.data.id;
      const newEmail = 'updated@example.com';

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ email: newEmail });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(newEmail);
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should fail to update non-existing user', async () => {
      const response = await request(app)
        .put('/api/users/nonexistent-id')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('eliminado');

      const getResponse = await request(app)
        .get(`/api/users/${userId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe('PATCH /api/users/:id/deactivate', () => {
    it('should deactivate user', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/users/${userId}/deactivate`);

      expect(response.status).toBe(200);
      expect(response.body.data.isActive).toBe(false);
    });
  });

  describe('GET /api/users/stats', () => {
    it('should return user statistics', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: testUser.email });

      const response = await request(app)
        .get('/api/users/stats');

      expect(response.status).toBe(200);
      expect(response.body.data.totalUsers).toBeGreaterThanOrEqual(1);
      expect(response.body.data.activeUsers).toBeGreaterThanOrEqual(1);
    });
  });
});