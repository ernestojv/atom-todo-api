import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido',
      'string.empty': 'El email no puede estar vacío'
    })
});

export const tokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'El token es requerido',
      'string.empty': 'El token no puede estar vacío'
    })
});