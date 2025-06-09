"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const task_model_1 = require("../models/task.model");
const errors_1 = require("../utils/errors");
class TaskService {
    constructor() {
        this.taskRepository = new task_repository_1.TaskRepository();
    }
    async getTasksByUser(userEmail, status) {
        this.validateEmail(userEmail);
        const tasks = await this.taskRepository.findByUser(userEmail, status);
        return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async getTaskById(id) {
        this.validateTaskId(id);
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw errors_1.AppErrors.taskNotFound(id);
        }
        return task;
    }
    async createTask(taskDto) {
        this.validateTaskData(taskDto);
        const taskData = {
            title: taskDto.title.trim(),
            description: taskDto.description.trim(),
            userEmail: taskDto.userEmail.toLowerCase().trim(),
            status: taskDto.status || task_model_1.TaskStatus.TODO,
            createdAt: taskDto.createdAt || new Date()
        };
        return await this.taskRepository.create(taskData);
    }
    async updateTask(id, updateDto) {
        this.validateTaskId(id);
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw errors_1.AppErrors.taskNotFound(id);
        }
        if (updateDto.title !== undefined) {
            this.validateTitle(updateDto.title);
            updateDto.title = updateDto.title.trim();
        }
        if (updateDto.description !== undefined) {
            this.validateDescription(updateDto.description);
            updateDto.description = updateDto.description.trim();
        }
        if (updateDto.status !== undefined) {
            this.validateStatus(updateDto.status);
        }
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedAt: new Date() });
        const updatedTask = await this.taskRepository.update(id, updateData);
        if (!updatedTask) {
            throw errors_1.AppErrors.taskNotFound(id);
        }
        return updatedTask;
    }
    async deleteTask(id) {
        this.validateTaskId(id);
        const deleted = await this.taskRepository.delete(id);
        if (!deleted) {
            throw errors_1.AppErrors.taskNotFound(id);
        }
    }
    async getTaskStats(userEmail) {
        this.validateEmail(userEmail);
        const stats = await this.taskRepository.getTaskStatsByUser(userEmail);
        const completionRate = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
        return Object.assign(Object.assign({}, stats), { completionRate: Math.round(completionRate * 100) / 100 });
    }
    async moveToInProgress(id) {
        return await this.updateTask(id, { status: task_model_1.TaskStatus.IN_PROGRESS });
    }
    async markAsDone(id) {
        return await this.updateTask(id, { status: task_model_1.TaskStatus.DONE });
    }
    async moveBackToTodo(id) {
        return await this.updateTask(id, { status: task_model_1.TaskStatus.TODO });
    }
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw errors_1.AppErrors.requiredField('userEmail');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw errors_1.AppErrors.invalidEmail();
        }
    }
    validateTaskId(id) {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw errors_1.AppErrors.requiredField('id');
        }
    }
    validateTaskData(taskData) {
        this.validateTitle(taskData.title);
        this.validateDescription(taskData.description);
        this.validateEmail(taskData.userEmail);
    }
    validateTitle(title) {
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            throw errors_1.AppErrors.requiredField('title');
        }
        if (title.length > 100) {
            throw errors_1.AppErrors.validationError('El título no puede exceder 100 caracteres');
        }
    }
    validateDescription(description) {
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            throw errors_1.AppErrors.requiredField('description');
        }
        if (description.length > 500) {
            throw errors_1.AppErrors.validationError('La descripción no puede exceder 500 caracteres');
        }
    }
    validateStatus(status) {
        if (!Object.values(task_model_1.TaskStatus).includes(status)) {
            throw errors_1.AppErrors.validationError('Status inválido. Debe ser: todo, in_progress o done');
        }
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map