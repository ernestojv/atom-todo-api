import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppErrors } from '../utils/errors';

// Función par middleware para validar con Joi
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      throw AppErrors.validationError(errorMessages);
    }

    if (property === 'body') {
      req[property] = value;
    }

    next();
  };
};