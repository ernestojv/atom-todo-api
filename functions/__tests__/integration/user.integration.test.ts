import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';

describe('User Integration Tests', () => {
  const app = createTestApp();

  const uniqueTestUser = () => ({
    email: `test-${Date.now()}@integration.com`
  });

  describe('POST /api/user', () => {
    it('should create a new user', async () => {
      const testData = uniqueTestUser();
      
      const response = await request(app)
        .post('/api/user')
        .send({ email: testData.email });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          email: testData.email,
          isActive: true,
          id: expect.any(String)
        }
      });

    });

    it('should reject duplicate email', async () => {
      const testData = uniqueTestUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testData.email });

      const response = await request(app)
        .post('/api/user')
        .send({ email: testData.email });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/user')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/user')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/user/check', () => {
    it('should return true for existing user', async () => {
      const testData = uniqueTestUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testData.email });

      const response = await request(app)
        .get(`/api/user/check?email=${testData.email}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: { exists: true }
      });
    });

    it('should return false for non-existing user', async () => {
      const response = await request(app)
        .get('/api/user/check?email=nonexistent@test.com');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: { exists: false }
      });
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .get('/api/user/check?email=invalid-email');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing email query', async () => {
      const response = await request(app)
        .get('/api/user/check');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/user/email/:email', () => {
    it('should get user by email', async () => {
      const testData = uniqueTestUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testData.email });

      const response = await request(app)
        .get(`/api/user/email/${encodeURIComponent(testData.email)}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: testData.email,
          isActive: true,
          id: expect.any(String)
        }
      });
    });

    it('should handle non-existing user', async () => {
      const response = await request(app)
        .get('/api/user/email/nonexistent@test.com');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle email with special characters', async () => {
      const specialEmail = `test+special-${Date.now()}@test.com`;
      
      await request(app)
        .post('/api/user')
        .send({ email: specialEmail });

      const response = await request(app)
        .get(`/api/user/email/${encodeURIComponent(specialEmail)}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(specialEmail);
    });
  });

  describe('GET /api/user/:id', () => {
    it('should get user by id', async () => {
      const testData = uniqueTestUser();
      
      const createResponse = await request(app)
        .post('/api/user')
        .send({ email: testData.email });
      
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/user/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: testData.email,
          isActive: true,
          id: userId
        }
      });
    });

    it('should handle non-existing user id', async () => {
      const response = await request(app)
        .get('/api/user/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should update user isActive status', async () => {
      const testData = uniqueTestUser();
      
      const createResponse = await request(app)
        .post('/api/user')
        .send({ email: testData.email });
      
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/user/${userId}`)
        .send({ isActive: false });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: {
          email: testData.email,
          isActive: false,
          id: userId
        }
      });
    });

    it('should handle non-existing user id', async () => {
      const response = await request(app)
        .put('/api/user/nonexistent-id')
        .send({ isActive: false });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should ignore invalid update fields but still update valid ones', async () => {
      const testData = uniqueTestUser();
      
      const createResponse = await request(app)
        .post('/api/user')
        .send({ email: testData.email });
      
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/user/${userId}`)
        .send({ 
          invalidField: 'value',
          isActive: false
        });

      expect(response.status).toBe(200);
      expect(response.body.data.isActive).toBe(false);
      expect(response.body.data).not.toHaveProperty('invalidField');
    });
  });

  describe('PATCH /api/user/:id/deactivate', () => {
    it('should deactivate user', async () => {
      const testData = uniqueTestUser();
      
      const createResponse = await request(app)
        .post('/api/user')
        .send({ email: testData.email });
      
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/user/${userId}/deactivate`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Usuario desactivado exitosamente',
        data: {
          email: testData.email,
          isActive: false,
          id: userId
        }
      });
    });

    it('should handle non-existing user id', async () => {
      const response = await request(app)
        .patch('/api/user/nonexistent-id/deactivate');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/user/:id/activate', () => {
    it('should activate user', async () => {
      const testData = uniqueTestUser();
      
      const createResponse = await request(app)
        .post('/api/user')
        .send({ email: testData.email });
      
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.data.id;

      await request(app)
        .patch(`/api/user/${userId}/deactivate`);

      const response = await request(app)
        .patch(`/api/user/${userId}/activate`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Usuario activado exitosamente',
        data: {
          email: testData.email,
          isActive: true,
          id: userId
        }
      });
    });

    it('should handle non-existing user id', async () => {
      const response = await request(app)
        .patch('/api/user/nonexistent-id/activate');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/user/all', () => {
    it('should get all users', async () => {
      const testData1 = uniqueTestUser();
      const testData2 = uniqueTestUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testData1.email });

      await request(app)
        .post('/api/user')
        .send({ email: testData2.email });

      const response = await request(app)
        .get('/api/user/all');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        count: expect.any(Number),
        data: expect.any(Array)
      });

      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.count).toBe(response.body.data.length);

      const emails = response.body.data.map((user: any) => user.email);
      expect(emails).toContain(testData1.email);
      expect(emails).toContain(testData2.email);
    });
  });

  describe('GET /api/user/stats', () => {
    it('should get user statistics', async () => {
      const testData1 = uniqueTestUser();
      const testData2 = uniqueTestUser();
      
      const user1Response = await request(app)
        .post('/api/user')
        .send({ email: testData1.email });

      await request(app)
        .post('/api/user')
        .send({ email: testData2.email });

      expect(user1Response.status).toBe(201);
      
      await request(app)
        .patch(`/api/user/${user1Response.body.data.id}/deactivate`);

      const response = await request(app)
        .get('/api/user/stats');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          totalUsers: expect.any(Number),
          activeUsers: expect.any(Number)
        }
      });

      expect(response.body.data.totalUsers).toBeGreaterThanOrEqual(2);
      expect(response.body.data.activeUsers).toBeGreaterThanOrEqual(1);
      
      if (response.body.data.inactiveUsers !== undefined) {
        expect(response.body.data.inactiveUsers).toBeGreaterThanOrEqual(1);
        expect(response.body.data.totalUsers).toBe(
          response.body.data.activeUsers + response.body.data.inactiveUsers
        );
      }
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete user', async () => {
      const testData = uniqueTestUser();
      
      const createResponse = await request(app)
        .post('/api/user')
        .send({ email: testData.email });
      
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/user/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });

      const checkResponse = await request(app)
        .get(`/api/user/${userId}`);
      
      expect(checkResponse.status).toBe(404);
    });

    it('should handle non-existing user id', async () => {
      const response = await request(app)
        .delete('/api/user/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});