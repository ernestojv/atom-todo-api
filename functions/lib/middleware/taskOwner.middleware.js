"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskOwner = void 0;
const task_service_1 = require("../services/task.service");
const validateTaskOwner = async (req, res, next) => {
    var _a;
    const tasksService = new task_service_1.TaskService();
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const taskId = req.params.id || req.params.taskId;
        if (!userEmail) {
            res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
            return;
        }
        if (!taskId) {
            res.status(400).json({
                success: false,
                message: 'ID de tarea requerido'
            });
            return;
        }
        const task = await tasksService.getTaskById(taskId);
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }
        if (task.userEmail !== userEmail) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar esta tarea'
            });
            return;
        }
        req.task = task;
        next();
    }
    catch (error) {
        console.error('Error en validateTaskOwner:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.validateTaskOwner = validateTaskOwner;
//# sourceMappingURL=taskOwner.middleware.js.map