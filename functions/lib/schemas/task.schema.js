"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskParamsSchema = exports.getTasksQuerySchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const task_model_1 = require("../models/task.model");
exports.createTaskSchema = joi_1.default.object({
    title: joi_1.default.string()
        .min(1)
        .max(100)
        .trim()
        .required()
        .messages({
        'string.empty': 'El título no puede estar vacío',
        'string.max': 'El título no puede exceder 100 caracteres',
        'any.required': 'El título es requerido'
    }),
    description: joi_1.default.string()
        .min(1)
        .max(500)
        .trim()
        .required()
        .messages({
        'string.empty': 'La descripción no puede estar vacía',
        'string.max': 'La descripción no puede exceder 500 caracteres',
        'any.required': 'La descripción es requerida'
    }),
    userEmail: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email del usuario es requerido'
    }),
    status: joi_1.default.string()
        .valid(...Object.values(task_model_1.TaskStatus))
        .default(task_model_1.TaskStatus.TODO)
        .messages({
        'any.only': 'El status debe ser: todo, in_progress o done'
    }),
    createdAt: joi_1.default.date()
        .default(() => new Date())
});
exports.updateTaskSchema = joi_1.default.object({
    title: joi_1.default.string()
        .min(1)
        .max(100)
        .trim()
        .optional()
        .messages({
        'string.empty': 'El título no puede estar vacío',
        'string.max': 'El título no puede exceder 100 caracteres'
    }),
    description: joi_1.default.string()
        .min(1)
        .max(500)
        .trim()
        .optional()
        .messages({
        'string.empty': 'La descripción no puede estar vacía',
        'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
    status: joi_1.default.string()
        .valid(...Object.values(task_model_1.TaskStatus))
        .optional()
        .messages({
        'any.only': 'El status debe ser: todo, in_progress o done'
    })
});
exports.getTasksQuerySchema = joi_1.default.object({
    userEmail: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email del usuario es requerido'
    }),
    status: joi_1.default.string()
        .valid(...Object.values(task_model_1.TaskStatus))
        .optional()
        .messages({
        'any.only': 'El status debe ser: todo, in_progress o done'
    })
});
exports.taskParamsSchema = joi_1.default.object({
    id: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'El ID de la tarea es requerido'
    })
});
//# sourceMappingURL=task.schema.js.map