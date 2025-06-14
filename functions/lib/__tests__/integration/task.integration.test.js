"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const task_model_1 = require("../../models/task.model");
const test_helpers_1 = require("./test-helpers");
describe('Tasks Integration Tests', () => {
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
    describe('GET /api/tasks', () => {
        it('should get all tasks for user', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks')
                .query({ userEmail: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.count).toBeGreaterThanOrEqual(1);
            expect(response.body.filter).toBe('all');
        });
        it('should filter tasks by status', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { status: task_model_1.TaskStatus.TODO }));
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { title: 'In Progress Task', status: task_model_1.TaskStatus.IN_PROGRESS }));
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks')
                .query({
                userEmail: test_helpers_1.testUser.email,
                status: task_model_1.TaskStatus.TODO
            });
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].status).toBe(task_model_1.TaskStatus.TODO);
            expect(response.body.filter.status).toBe(task_model_1.TaskStatus.TODO);
        });
        it('should return empty array for user with no tasks', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks')
                .query({ userEmail: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
            expect(response.body.count).toBe(0);
        });
        it('should fail with invalid email format', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks')
                .query({ userEmail: 'invalid-email' });
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('email válido');
        });
        it('should fail with missing userEmail', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks');
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('requerido');
        });
        it('should return tasks sorted by creation date (newest first)', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { title: 'First Task' }));
            await new Promise(resolve => setTimeout(resolve, 100));
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { title: 'Second Task' }));
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks')
                .query({ userEmail: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].title).toBe('Second Task');
            expect(response.body.data[1].title).toBe('First Task');
        });
    });
    describe('POST /api/tasks', () => {
        it('should create task successfully', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe(test_helpers_1.testTask.title);
            expect(response.body.data.description).toBe(test_helpers_1.testTask.description);
            expect(response.body.data.userEmail).toBe(test_helpers_1.testTask.userEmail);
            expect(response.body.data.status).toBe(task_model_1.TaskStatus.TODO);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.createdAt).toBeDefined();
            expect(response.body.message).toBe('Tarea creada exitosamente');
        });
        it('should create task with custom status', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const taskWithStatus = Object.assign(Object.assign({}, test_helpers_1.testTask), { status: task_model_1.TaskStatus.IN_PROGRESS });
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(taskWithStatus);
            expect(response.status).toBe(201);
            expect(response.body.data.status).toBe(task_model_1.TaskStatus.IN_PROGRESS);
        });
        it('should fail with missing title', async () => {
            const invalidTask = {
                description: test_helpers_1.testTask.description,
                userEmail: test_helpers_1.testTask.userEmail
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(invalidTask);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('título');
        });
        it('should fail with missing description', async () => {
            const invalidTask = {
                title: test_helpers_1.testTask.title,
                userEmail: test_helpers_1.testTask.userEmail
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(invalidTask);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('descripción');
        });
        it('should fail with invalid email', async () => {
            const invalidTask = Object.assign(Object.assign({}, test_helpers_1.testTask), { userEmail: 'invalid-email' });
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(invalidTask);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('email válido');
        });
        it('should fail with title too long', async () => {
            const invalidTask = Object.assign(Object.assign({}, test_helpers_1.testTask), { title: 'a'.repeat(101) });
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(invalidTask);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('100 caracteres');
        });
        it('should fail with description too long', async () => {
            const invalidTask = Object.assign(Object.assign({}, test_helpers_1.testTask), { description: 'a'.repeat(501) });
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(invalidTask);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('500 caracteres');
        });
        it('should fail with invalid status', async () => {
            const invalidTask = Object.assign(Object.assign({}, test_helpers_1.testTask), { status: 'invalid_status' });
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(invalidTask);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toContain('todo, in_progress o done');
        });
        it('should trim whitespace from title and description', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const taskWithWhitespace = Object.assign(Object.assign({}, test_helpers_1.testTask), { title: '  Trimmed Title  ', description: '  Trimmed Description  ' });
            const response = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(taskWithWhitespace);
            expect(response.status).toBe(201);
            expect(response.body.data.title).toBe('Trimmed Title');
            expect(response.body.data.description).toBe('Trimmed Description');
        });
    });
    describe('GET /api/tasks/:id', () => {
        it('should get task by id', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .get(`/api/tasks/${taskId}`);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(taskId);
            expect(response.body.data.title).toBe(test_helpers_1.testTask.title);
        });
        it('should return 404 for non-existing task', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks/nonexistent-id');
            expect(response.status).toBe(404);
            expect(response.body.error.message).toContain('no encontrada');
        });
        it('should fail with missing task id', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks/');
            expect(response.status).toBe(404);
        });
    });
    describe('PUT /api/tasks/:id', () => {
        it('should update task successfully', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const updateData = {
                title: 'Updated Title',
                description: 'Updated Description',
                status: task_model_1.TaskStatus.IN_PROGRESS
            };
            const response = await (0, supertest_1.default)(app)
                .put(`/api/tasks/${taskId}`)
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe(updateData.title);
            expect(response.body.data.description).toBe(updateData.description);
            expect(response.body.data.status).toBe(updateData.status);
            expect(response.body.data.updatedAt).toBeDefined();
            expect(response.body.message).toBe('Tarea actualizada exitosamente');
        });
        it('should update partial task data', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const updateData = { title: 'Only Title Updated' };
            const response = await (0, supertest_1.default)(app)
                .put(`/api/tasks/${taskId}`)
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe(updateData.title);
            expect(response.body.data.description).toBe(test_helpers_1.testTask.description);
        });
        it('should return 404 for non-existing task', async () => {
            const response = await (0, supertest_1.default)(app)
                .put('/api/tasks/nonexistent-id')
                .send({ title: 'Updated' });
            expect(response.status).toBe(404);
        });
        it('should fail with invalid update data', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .put(`/api/tasks/${taskId}`)
                .send({ title: '' });
            expect(response.status).toBe(400);
        });
    });
    describe('DELETE /api/tasks/:id', () => {
        it('should delete task successfully', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/tasks/${taskId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Tarea eliminada exitosamente');
            const getResponse = await (0, supertest_1.default)(app)
                .get(`/api/tasks/${taskId}`);
            expect(getResponse.status).toBe(404);
        });
        it('should return 404 for non-existing task', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete('/api/tasks/nonexistent-id');
            expect(response.status).toBe(404);
        });
    });
    describe('PATCH /api/tasks/:id/in-progress', () => {
        it('should move task to in progress', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/tasks/${taskId}/in-progress`);
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe(task_model_1.TaskStatus.IN_PROGRESS);
            expect(response.body.message).toBe('Tarea movida a En Progreso');
        });
    });
    describe('PATCH /api/tasks/:id/done', () => {
        it('should mark task as done', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/tasks/${taskId}/done`);
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe(task_model_1.TaskStatus.DONE);
            expect(response.body.message).toBe('Tarea marcada como Completada');
        });
    });
    describe('PATCH /api/tasks/:id/todo', () => {
        it('should move task back to todo', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { status: task_model_1.TaskStatus.DONE }));
            const taskId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/tasks/${taskId}/todo`);
            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe(task_model_1.TaskStatus.TODO);
            expect(response.body.message).toBe('Tarea movida a Por Hacer');
        });
    });
    describe('GET /api/tasks/stats', () => {
        it('should return task statistics', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { status: task_model_1.TaskStatus.TODO }));
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { title: 'In Progress Task', status: task_model_1.TaskStatus.IN_PROGRESS }));
            await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { title: 'Done Task', status: task_model_1.TaskStatus.DONE }));
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks/stats')
                .query({ userEmail: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.data.total).toBe(3);
            expect(response.body.data.todo).toBe(1);
            expect(response.body.data.inProgress).toBe(1);
            expect(response.body.data.done).toBe(1);
            expect(response.body.data.completionRate).toBe(33.33);
        });
        it('should return zero stats for user with no tasks', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const response = await (0, supertest_1.default)(app)
                .get('/api/tasks/stats')
                .query({ userEmail: test_helpers_1.testUser.email });
            expect(response.status).toBe(200);
            expect(response.body.data.total).toBe(0);
            expect(response.body.data.completionRate).toBe(0);
        });
    });
    describe('Complete Task Workflow', () => {
        it('should complete full task lifecycle', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(test_helpers_1.testTask);
            const taskId = createResponse.body.data.id;
            expect(createResponse.body.data.status).toBe(task_model_1.TaskStatus.TODO);
            const inProgressResponse = await (0, supertest_1.default)(app)
                .patch(`/api/tasks/${taskId}/in-progress`);
            expect(inProgressResponse.body.data.status).toBe(task_model_1.TaskStatus.IN_PROGRESS);
            const doneResponse = await (0, supertest_1.default)(app)
                .patch(`/api/tasks/${taskId}/done`);
            expect(doneResponse.body.data.status).toBe(task_model_1.TaskStatus.DONE);
            const backToTodoResponse = await (0, supertest_1.default)(app)
                .patch(`/api/tasks/${taskId}/todo`);
            expect(backToTodoResponse.body.data.status).toBe(task_model_1.TaskStatus.TODO);
            const updateResponse = await (0, supertest_1.default)(app)
                .put(`/api/tasks/${taskId}`)
                .send({ title: 'Updated Task' });
            expect(updateResponse.body.data.title).toBe('Updated Task');
            const deleteResponse = await (0, supertest_1.default)(app)
                .delete(`/api/tasks/${taskId}`);
            expect(deleteResponse.status).toBe(200);
            const getResponse = await (0, supertest_1.default)(app)
                .get(`/api/tasks/${taskId}`);
            expect(getResponse.status).toBe(404);
        });
    });
    describe('Rate Limiting', () => {
        it('should apply rate limiting to write operations', async () => {
            await (0, test_helpers_1.createTestUser)(app);
            const promises = Array.from({ length: 25 }, (_, i) => (0, supertest_1.default)(app)
                .post('/api/tasks')
                .send(Object.assign(Object.assign({}, test_helpers_1.testTask), { title: `Rate Limit Test ${i}` })));
            const responses = await Promise.allSettled(promises);
            const rateLimitedResponses = responses.filter(result => result.status === 'fulfilled' && result.value.status === 429);
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=task.integration.test.js.map