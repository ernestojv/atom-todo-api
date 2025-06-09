import Joi from 'joi';
import { TaskStatus } from '../models/task.model';

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'El título no puede estar vacío',
      'string.max': 'El título no puede exceder 100 caracteres',
      'any.required': 'El título es requerido'
    }),
    
  description: Joi.string()
    .min(1)
    .max(500)
    .trim()
    .required()
    .messages({
      'string.empty': 'La descripción no puede estar vacía',
      'string.max': 'La descripción no puede exceder 500 caracteres',
      'any.required': 'La descripción es requerida'
    }),
    
  userEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email del usuario es requerido'
    }),
    
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .default(TaskStatus.TODO)
    .messages({
      'any.only': 'El status debe ser: todo, in_progress o done'
    }),
    
  createdAt: Joi.date()
    .default(() => new Date())
});

export const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.empty': 'El título no puede estar vacío',
      'string.max': 'El título no puede exceder 100 caracteres'
    }),
    
  description: Joi.string()
    .min(1)
    .max(500)
    .trim()
    .optional()
    .messages({
      'string.empty': 'La descripción no puede estar vacía',
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
    
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional()
    .messages({
      'any.only': 'El status debe ser: todo, in_progress o done'
    })
});

export const getTasksQuerySchema = Joi.object({
  userEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email del usuario es requerido'
    }),
    
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional()
    .messages({
      'any.only': 'El status debe ser: todo, in_progress o done'
    })
});

export const taskParamsSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID de la tarea es requerido'
    })
});