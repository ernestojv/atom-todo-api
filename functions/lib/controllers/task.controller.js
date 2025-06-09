"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
class TaskController {
    constructor() {
        this.taskService = new task_service_1.TaskService();
    }
    async getTasks(req, res) {
        const userEmail = typeof req.query.userEmail === 'string' ? req.query.userEmail : '';
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const tasks = await this.taskService.getTasksByUser(userEmail, status);
        res.status(200).json({
            success: true,
            data: tasks,
            count: tasks.length,
            filter: status ? { status } : 'all',
            timestamp: new Date().toISOString()
        });
    }
    async getTaskById(req, res) {
        const id = req.params.id;
        const task = await this.taskService.getTaskById(id);
        res.status(200).json({
            success: true,
            data: task,
            timestamp: new Date().toISOString()
        });
    }
    async createTask(req, res) {
        const taskData = req.body;
        const newTask = await this.taskService.createTask(taskData);
        res.status(201).json({
            success: true,
            data: newTask,
            message: 'Tarea creada exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async updateTask(req, res) {
        const id = req.params.id;
        const updateData = req.body;
        const updatedTask = await this.taskService.updateTask(id, updateData);
        res.status(200).json({
            success: true,
            data: updatedTask,
            message: 'Tarea actualizada exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async deleteTask(req, res) {
        const id = req.params.id;
        await this.taskService.deleteTask(id);
        res.status(200).json({
            success: true,
            message: 'Tarea eliminada exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async getTaskStats(req, res) {
        const userEmail = typeof req.query.userEmail === 'string' ? req.query.userEmail : '';
        const stats = await this.taskService.getTaskStats(userEmail);
        res.status(200).json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    }
    async moveToInProgress(req, res) {
        const id = req.params.id;
        const updatedTask = await this.taskService.moveToInProgress(id);
        res.status(200).json({
            success: true,
            data: updatedTask,
            message: 'Tarea movida a En Progreso',
            timestamp: new Date().toISOString()
        });
    }
    async markAsDone(req, res) {
        const id = req.params.id;
        const updatedTask = await this.taskService.markAsDone(id);
        res.status(200).json({
            success: true,
            data: updatedTask,
            message: 'Tarea marcada como Completada',
            timestamp: new Date().toISOString()
        });
    }
    async moveBackToTodo(req, res) {
        const id = req.params.id;
        const updatedTask = await this.taskService.moveBackToTodo(id);
        res.status(200).json({
            success: true,
            data: updatedTask,
            message: 'Tarea movida a Por Hacer',
            timestamp: new Date().toISOString()
        });
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map