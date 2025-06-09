"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = require("../../services/task.service");
const task_repository_1 = require("../../repositories/task.repository");
const task_model_1 = require("../../models/task.model");
jest.mock('../../repositories/task.repository');
describe('TaskService', () => {
    let taskService;
    let mockTaskRepository;
    let mockTask;
    beforeEach(() => {
        mockTaskRepository = new task_repository_1.TaskRepository();
        taskService = new task_service_1.TaskService();
        taskService.taskRepository = mockTaskRepository;
        mockTask = {
            id: 'task123',
            title: 'Test Task',
            description: 'Test Description',
            status: task_model_1.TaskStatus.TODO,
            createdAt: new Date(),
            userEmail: 'test@example.com'
        };
    });
    describe('getTasksByUser', () => {
        it('should return tasks sorted by creation date', async () => {
            const tasks = [
                Object.assign(Object.assign({}, mockTask), { createdAt: new Date('2024-01-01') }),
                Object.assign(Object.assign({}, mockTask), { id: 'task456', createdAt: new Date('2024-01-02') })
            ];
            mockTaskRepository.findByUser.mockResolvedValue(tasks);
            const result = await taskService.getTasksByUser('test@example.com');
            expect(result).toHaveLength(2);
            expect(new Date(result[0].createdAt).getTime())
                .toBeGreaterThan(new Date(result[1].createdAt).getTime());
        });
        it('should validate email format', async () => {
            await expect(taskService.getTasksByUser('invalid-email'))
                .rejects.toThrow();
        });
        it('should filter by status when provided', async () => {
            mockTaskRepository.findByUser.mockResolvedValue([mockTask]);
            await taskService.getTasksByUser('test@example.com', task_model_1.TaskStatus.TODO);
            expect(mockTaskRepository.findByUser)
                .toHaveBeenCalledWith('test@example.com', task_model_1.TaskStatus.TODO);
        });
        it('should handle empty task array', async () => {
            mockTaskRepository.findByUser.mockResolvedValue([]);
            const result = await taskService.getTasksByUser('test@example.com');
            expect(result).toEqual([]);
        });
    });
    describe('createTask', () => {
        const createTaskDto = {
            title: 'New Task',
            description: 'New Description',
            userEmail: 'test@example.com'
        };
        it('should create task successfully', async () => {
            mockTaskRepository.create.mockResolvedValue(mockTask);
            const result = await taskService.createTask(createTaskDto);
            expect(result).toEqual(mockTask);
            expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Task',
                description: 'New Description',
                userEmail: 'test@example.com',
                status: task_model_1.TaskStatus.TODO
            }));
        });
        it('should validate required fields', async () => {
            const invalidDto = Object.assign(Object.assign({}, createTaskDto), { title: '' });
            await expect(taskService.createTask(invalidDto))
                .rejects.toThrow();
        });
        it('should trim whitespace from title and description', async () => {
            const dtoWithWhitespace = Object.assign(Object.assign({}, createTaskDto), { title: '  Trimmed Title  ', description: '  Trimmed Description  ' });
            mockTaskRepository.create.mockResolvedValue(mockTask);
            await taskService.createTask(dtoWithWhitespace);
            expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Trimmed Title',
                description: 'Trimmed Description'
            }));
        });
        it('should validate title length', async () => {
            const longTitle = 'a'.repeat(101);
            const invalidDto = Object.assign(Object.assign({}, createTaskDto), { title: longTitle });
            await expect(taskService.createTask(invalidDto))
                .rejects.toThrow();
        });
        it('should validate description length', async () => {
            const longDescription = 'a'.repeat(501);
            const invalidDto = Object.assign(Object.assign({}, createTaskDto), { description: longDescription });
            await expect(taskService.createTask(invalidDto))
                .rejects.toThrow();
        });
    });
    describe('updateTask', () => {
        it('should update task successfully', async () => {
            const updatedTask = Object.assign(Object.assign({}, mockTask), { title: 'Updated Title' });
            mockTaskRepository.findById.mockResolvedValue(mockTask);
            mockTaskRepository.update.mockResolvedValue(updatedTask);
            const result = await taskService.updateTask('task123', {
                title: 'Updated Title'
            });
            expect(result).toEqual(updatedTask);
        });
        it('should throw error if task not found', async () => {
            mockTaskRepository.findById.mockResolvedValue(null);
            await expect(taskService.updateTask('nonexistent', { title: 'Test' }))
                .rejects.toThrow();
        });
    });
    describe('deleteTask', () => {
        it('should delete task successfully', async () => {
            mockTaskRepository.delete.mockResolvedValue(true);
            await taskService.deleteTask('task123');
            expect(mockTaskRepository.delete).toHaveBeenCalledWith('task123');
        });
        it('should throw error if task not found', async () => {
            mockTaskRepository.delete.mockResolvedValue(false);
            await expect(taskService.deleteTask('nonexistent'))
                .rejects.toThrow();
        });
    });
    describe('status transitions', () => {
        beforeEach(() => {
            mockTaskRepository.findById.mockResolvedValue(mockTask);
            mockTaskRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockTask), { status: task_model_1.TaskStatus.IN_PROGRESS }));
        });
        it('should move task to in progress', async () => {
            await taskService.moveToInProgress('task123');
            expect(mockTaskRepository.update).toHaveBeenCalledWith('task123', expect.objectContaining({ status: task_model_1.TaskStatus.IN_PROGRESS }));
        });
        it('should mark task as done', async () => {
            mockTaskRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockTask), { status: task_model_1.TaskStatus.DONE }));
            await taskService.markAsDone('task123');
            expect(mockTaskRepository.update).toHaveBeenCalledWith('task123', expect.objectContaining({ status: task_model_1.TaskStatus.DONE }));
        });
        it('should move task back to todo', async () => {
            mockTaskRepository.update.mockResolvedValue(Object.assign(Object.assign({}, mockTask), { status: task_model_1.TaskStatus.TODO }));
            await taskService.moveBackToTodo('task123');
            expect(mockTaskRepository.update).toHaveBeenCalledWith('task123', expect.objectContaining({ status: task_model_1.TaskStatus.TODO }));
        });
    });
    describe('getTaskStats', () => {
        it('should return correct task statistics', async () => {
            mockTaskRepository.getTaskStatsByUser.mockResolvedValue({
                total: 4,
                todo: 1,
                inProgress: 1,
                done: 2
            });
            const result = await taskService.getTaskStats('test@example.com');
            expect(result).toEqual({
                total: 4,
                todo: 1,
                inProgress: 1,
                done: 2,
                completionRate: 50
            });
        });
        it('should handle empty task list', async () => {
            mockTaskRepository.getTaskStatsByUser.mockResolvedValue({
                total: 0,
                todo: 0,
                inProgress: 0,
                done: 0
            });
            const result = await taskService.getTaskStats('test@example.com');
            expect(result.completionRate).toBe(0);
        });
    });
});
//# sourceMappingURL=task.service.test.js.map