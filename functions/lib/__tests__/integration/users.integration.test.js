"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_helpers_1 = require("./test-helpers");
describe('Users Integration Tests', () => {
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
    describe('POST /api/users', () => {
        it('should create user successfully', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(test_helpers_1.testUser.email);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.isActive).toBe(true);
        });
        it('should fail to create duplicate user', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            expect(response.status).toBe(409);
            expect(response.body.error.message).toContain('ya existe');
        });
        it('should fail with invalid email', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: 'invalid-email' });
            expect(response.status).toBe(400);
        });
    });
    describe('GET /api/users/check', () => {
        it('should return true for existing user', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const response = await (0, supertest_1.default)(app)
                .get('/api/users/check')
                .query({ email: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.data.exists).toBe(true);
        });
        it('should return false for non-existing user', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/users/check')
                .query({ email: 'nonexistent@example.com' });
            expect(response.status).toBe(200);
            expect(response.body.data.exists).toBe(false);
        });
    });
    describe('GET /api/users/email/:email', () => {
        it('should get user by email', async () => {
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const response = await (0, supertest_1.default)(app)
                .get(`/api/users/email/${encodeURIComponent(test_helpers_1.testUser.email)}`);
            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe(test_helpers_1.testUser.email);
            expect(response.body.data.id).toBe(createResponse.body.data.id);
        });
        it('should return 404 for non-existing user', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/users/email/nonexistent@example.com');
            expect(response.status).toBe(404);
        });
    });
    describe('PUT /api/users/:id', () => {
        it('should update user successfully', async () => {
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const userId = createResponse.body.data.id;
            const newEmail = 'updated@example.com';
            const response = await (0, supertest_1.default)(app)
                .put(`/api/users/${userId}`)
                .send({ email: newEmail });
            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe(newEmail);
            expect(response.body.data.updatedAt).toBeDefined();
        });
        it('should fail to update non-existing user', async () => {
            const response = await (0, supertest_1.default)(app)
                .put('/api/users/nonexistent-id')
                .send({ email: 'test@example.com' });
            expect(response.status).toBe(404);
        });
    });
    describe('DELETE /api/users/:id', () => {
        it('should delete user successfully', async () => {
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const userId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/users/${userId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toContain('eliminado');
            const getResponse = await (0, supertest_1.default)(app)
                .get(`/api/users/${userId}`);
            expect(getResponse.status).toBe(404);
        });
    });
    describe('PATCH /api/users/:id/deactivate', () => {
        it('should deactivate user', async () => {
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const userId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/users/${userId}/deactivate`);
            expect(response.status).toBe(200);
            expect(response.body.data.isActive).toBe(false);
        });
    });
    describe('GET /api/users/stats', () => {
        it('should return user statistics', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/users')
                .send({ email: test_helpers_1.testUser.email });
            const response = await (0, supertest_1.default)(app)
                .get('/api/users/stats');
            expect(response.status).toBe(200);
            expect(response.body.data.totalUsers).toBeGreaterThanOrEqual(1);
            expect(response.body.data.activeUsers).toBeGreaterThanOrEqual(1);
        });
    });
});
//# sourceMappingURL=users.integration.test.js.map