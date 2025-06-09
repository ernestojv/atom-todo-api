"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_helpers_1 = require("./test-helpers");
describe('Auth Integration Tests', () => {
    let app;
    beforeAll(() => {
        app = (0, test_helpers_1.createTestApp)();
    });
    beforeEach(async () => {
        await (0, test_helpers_1.cleanupTestUser)(app);
    });
    afterEach(async () => {
        await (0, test_helpers_1.cleanupTestUser)(app);
    });
    describe('POST /api/auth/login', () => {
        it('should login successfully with existing user', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.email).toBe(test_helpers_1.testUser.email);
            expect(response.body.message).toBe('Inicio de sesión exitoso');
        });
        it('should fail login with non-existent user', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'nonexistent@example.com' });
            expect(response.status).toBe(401);
            expect(response.body.error.message).toContain('Credenciales inválidas');
        });
        it('should fail login with invalid email format', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'invalid-email' });
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('email válido');
        });
        it('should fail login with missing email', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('requerido');
        });
    });
    describe('POST /api/auth/verify', () => {
        it('should verify valid token', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const loginResponse = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: test_helpers_1.testUser.email });
            const token = loginResponse.body.data.token;
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/verify')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.data.valid).toBe(true);
            expect(response.body.data.user.email).toBe(test_helpers_1.testUser.email);
        });
        it('should fail with invalid token', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(401);
        });
        it('should fail with missing token', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/verify');
            expect(response.status).toBe(401);
        });
        it('should fail with malformed Authorization header', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/verify')
                .set('Authorization', 'Invalid token-format');
            expect(response.status).toBe(401);
        });
    });
    describe('POST /api/auth/refresh', () => {
        it('should refresh valid token', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const loginResponse = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: test_helpers_1.testUser.email });
            const token = loginResponse.body.data.token;
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/refresh')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.token).not.toBe(token);
            expect(response.body.message).toBe('Token renovado exitosamente');
        });
        it('should fail refresh with invalid token', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/refresh')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(401);
        });
    });
    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/logout');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Sesión cerrada exitosamente');
        });
    });
});
//# sourceMappingURL=auth.integration.test.js.map