"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTask = exports.testUser = void 0;
exports.createTestApp = createTestApp;
exports.createTestUser = createTestUser;
exports.loginAndGetToken = loginAndGetToken;
exports.getAuthHeaders = getAuthHeaders;
exports.cleanupTestUser = cleanupTestUser;
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cors_middleware_1 = require("../../middleware/cors.middleware");
const helmet_middleware_1 = require("../../middleware/helmet.middleware");
const error_middleware_1 = require("../../middleware/error.middleware");
const task_routes_1 = require("../../routes/task.routes");
const user_routes_1 = require("../../routes/user.routes");
const auth_routes_1 = require("../../routes/auth.routes");
function createTestApp() {
    const app = (0, express_1.default)();
    app.use(cors_middleware_1.corsMiddleware);
    app.use(helmet_middleware_1.basicSecurity);
    app.use(express_1.default.json());
    app.use('/api/auth', auth_routes_1.authRoutes);
    app.use('/api/tasks', task_routes_1.taskRoutes);
    app.use('/api/users', user_routes_1.userRoutes);
    app.use(error_middleware_1.errorHandler);
    return app;
}
exports.testUser = {
    email: 'integration.test@example.com',
    id: 'test-user-id'
};
exports.testTask = {
    title: 'Integration Test Task',
    description: 'Task for integration testing',
    userEmail: exports.testUser.email
};
async function createTestUser(app) {
    try {
        console.log('Creating test user with email:', exports.testUser.email);
        const response = await (0, supertest_1.default)(app)
            .post('/api/users')
            .send({
            email: exports.testUser.email
        });
        console.log('Create user response status:', response.status);
        console.log('Create user response body:', JSON.stringify(response.body, null, 2));
        if (response.status !== 201) {
            throw new Error(`Failed to create user: ${response.status} - ${JSON.stringify(response.body)}`);
        }
        return response;
    }
    catch (error) {
        console.error('Error in createTestUser:', error);
        throw error;
    }
}
async function loginAndGetToken(app) {
    var _a, _b;
    try {
        console.log('Attempting login with email:', exports.testUser.email);
        const response = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ email: exports.testUser.email });
        console.log('Login response status:', response.status);
        console.log('Login response body:', JSON.stringify(response.body, null, 2));
        if (response.status !== 200) {
            throw new Error(`Login failed: ${response.status} - ${JSON.stringify(response.body)}`);
        }
        if (!((_b = (_a = response.body) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.token)) {
            throw new Error(`No token in login response: ${JSON.stringify(response.body)}`);
        }
        return response.body.data.token;
    }
    catch (error) {
        console.error('Error in loginAndGetToken:', error);
        throw error;
    }
}
function getAuthHeaders(token) {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}
async function cleanupTestUser(app) {
    var _a, _b;
    try {
        console.log('Cleaning up test user:', exports.testUser.email);
        // Intentar obtener el usuario
        const userResponse = await (0, supertest_1.default)(app)
            .get(`/api/users/email/${encodeURIComponent(exports.testUser.email)}`);
        if (userResponse.status === 200 && ((_b = (_a = userResponse.body) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id)) {
            console.log('Found user to delete:', userResponse.body.data.id);
            // Eliminar el usuario
            const deleteResponse = await (0, supertest_1.default)(app)
                .delete(`/api/users/${userResponse.body.data.id}`);
            console.log('Delete user response status:', deleteResponse.status);
        }
        else {
            console.log('User not found, nothing to cleanup');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('Cleanup error (this is normal):', error.message);
        }
        else {
            console.log('Cleanup error (this is normal):', error);
        }
    }
}
//# sourceMappingURL=test-helpers.js.map