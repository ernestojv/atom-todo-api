import request from 'supertest';
import { createTestApp, testUser } from '../helpers/app.helper';

describe('Auth Integration Tests', () => {
  const app = createTestApp();

  beforeEach(async () => {
    // Crear usuario antes de cada test
    await request(app)
      .post('/api/user')
      .send({ email: testUser.email });
  });

  describe('POST /api/auth/login', () => {
    it('should return JWT token for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });

      console.log('Login response:', response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    it('should return same user on multiple logins', async () => {
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
  });

  describe('POST /api/auth/verify', () => {
    let authToken: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email });
      
      console.log('BeforeEach login response:', loginResponse.status, loginResponse.body);

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

      console.log('Verify response:', response.status, response.body);

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
  });
});