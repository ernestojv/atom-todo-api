import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
    
  createdAt: Joi.date()
    .default(() => new Date())
});

export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Debe ser un email válido'
    }),
    
  isActive: Joi.boolean()
    .optional()
});

export const checkUserQuerySchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    })
});

export const userParamsSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del usuario es requerido'
    })
});

export const getUserByEmailParamsSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    })
});