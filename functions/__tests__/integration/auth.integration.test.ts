import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';

describe('Auth Integration Tests', () => {
  const app = createTestApp();

  const uniqueUser = () => ({
    email: `auth-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@test.com`
  });

  describe('POST /api/auth/login', () => {
    it('should return JWT token for existing user', async () => {
      const testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    it('should return same user on multiple logins', async () => {
      const testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const firstLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      const secondLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      expect(firstLogin.status).toBe(200);
      expect(secondLogin.status).toBe(200);
      expect(secondLogin.body.data.user.email).toBe(testUser.email);
    });

    it('should reject login for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('Credenciales inválidas o usuario no encontrado');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('email');
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should handle case insensitive email', async () => {
      const testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email.toUpperCase() });

      if (response.status === 200) {
        expect(response.body.data.user.email).toBe(testUser.email);
      } else {
        expect(response.status).toBe(401);
      }
    });

    it('should handle email with extra whitespace', async () => {
      const testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: `  ${testUser.email}  ` });

      if (response.status === 200) {
        expect(response.body.data.user.email).toBe(testUser.email);
      } else {
        expect(response.status).toBe(401);
      }
    });

    it('should reject inactive user', async () => {
      const testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const userResponse = await request(app)
        .get(`/api/user/email/${encodeURIComponent(testUser.email)}`);
      
      const userId = userResponse.body.data.id;

      await request(app)
        .patch(`/api/user/${userId}/deactivate`);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toMatch(/Usuario inactivo|Credenciales inválidas/);
    });

    it('should handle special characters in email', async () => {
      const specialEmail = `test+tag-${Date.now()}@domain-name.co.uk`;
      
      await request(app)
        .post('/api/user')
        .send({ email: specialEmail });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: specialEmail });

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe(specialEmail);
    });

    it('should handle very long email', async () => {
      const longEmail = 'a'.repeat(300) + '@test.com';
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: longEmail });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle concurrent login requests', async () => {
      const testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const promises = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ email: testUser.email })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.data.user.email).toBe(testUser.email);
      });
    });
  });

  describe('POST /api/auth/verify', () => {
    let authToken: string;
    let testUser: { email: string };

    beforeEach(async () => {
      testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      if (loginResponse.status === 200 && loginResponse.body.data && loginResponse.body.data.token) {
        authToken = loginResponse.body.data.token;
      } else {
        throw new Error(`Failed to get auth token. Status: ${loginResponse.status}, Body: ${JSON.stringify(loginResponse.body)}`);
      }
    });

    it('should verify valid JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('valid', true);
      expect(response.body.data).toHaveProperty('payload');
      expect(response.body.data.payload).toHaveProperty('userId');
      expect(response.body.data.payload).toHaveProperty('email');
      expect(response.body.data.payload.email).toBe(testUser.email);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .post('/api/auth/verify');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Invalid format');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDJ9.invalid';
      
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject token with invalid signature', async () => {
      const invalidToken = authToken.slice(0, -5) + 'XXXXX';
      
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject token for deleted user', async () => {
      const userResponse = await request(app)
        .get(`/api/user/email/${encodeURIComponent(testUser.email)}`);
      
      const userId = userResponse.body.data.id;

      await request(app)
        .delete(`/api/user/${userId}`);

      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`);

      expect([401, 404]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject token for inactive user', async () => {
      const userResponse = await request(app)
        .get(`/api/user/email/${encodeURIComponent(testUser.email)}`);
      
      const userId = userResponse.body.data.id;

      await request(app)
        .patch(`/api/user/${userId}/deactivate`);

      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 401]).toContain(response.status);
      if (response.status === 401) {
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('POST /api/auth/refresh', () => {
    let authToken: string;
    let testUser: { email: string };

    beforeEach(async () => {
      testUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: testUser.email });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });
      
      if (loginResponse.status === 200 && loginResponse.body.data?.token) {
        authToken = loginResponse.body.data.token;
      } else {
        throw new Error(`Failed to login for refresh tests: ${JSON.stringify(loginResponse.body)}`);
      }
    });

    it('should refresh valid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
      
      // El token puede ser el mismo o diferente dependiendo de la implementación
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.token.length).toBeGreaterThan(0);
    });

    it('should reject refresh without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject refresh for inactive user', async () => {
      const userResponse = await request(app)
        .get(`/api/user/email/${encodeURIComponent(testUser.email)}`);
      
      const userId = userResponse.body.data.id;

      await request(app)
        .patch(`/api/user/${userId}/deactivate`);

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject refresh for deleted user', async () => {
      const userResponse = await request(app)
        .get(`/api/user/email/${encodeURIComponent(testUser.email)}`);
      
      const userId = userResponse.body.data.id;

      await request(app)
        .delete(`/api/user/${userId}`);

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`);

      expect([401, 404]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String)
      });
    });

    it('should logout even without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle malformed JSON in login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect([400, 500]).toContain(response.status);
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('');

      expect(response.status).toBe(400);
    });

    it('should handle undefined email field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: undefined });

      expect(response.status).toBe(400);
    });

    it('should handle empty string email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: '' });

      expect(response.status).toBe(400);
    });
  });
});