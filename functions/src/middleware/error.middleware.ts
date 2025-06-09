import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let boom: Boom.Boom;

  // Si ya es un error de Boom, usarlo directamente
  if (Boom.isBoom(error)) {
    boom = error;
  } else {
    // Convertir errores comunes a Boom
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      boom = Boom.serverUnavailable('Database connection failed');
    } else if (error.name === 'ValidationError') {
      boom = Boom.badRequest(error.message);
    } else {
      // Error genérico
      boom = Boom.internal(error.message || 'Internal Server Error');
    }
  }

  // Log del error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: boom.message,
    statusCode: boom.output.statusCode,
    url: req.url,
    method: req.method,
    stack: boom.stack
  });

  // Responder con formato consistente
  res.status(boom.output.statusCode).json({
    error: {
      statusCode: boom.output.statusCode,
      message: boom.message,
      ...(process.env.NODE_ENV === 'development' && { stack: boom.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.url
  });
};