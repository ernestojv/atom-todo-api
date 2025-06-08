import rateLimit from 'express-rate-limit';
import { AppErrors } from '../utils/errors';

// Rate limit general para toda la API
export const generalRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,


    handler: (req, res) => {
        const error = AppErrors.tooManyRequests('Demasiadas solicitudes desde esta IP');
        res.status(error.output.statusCode).json({
            error: {
                statusCode: error.output.statusCode,
                message: error.message
            },
            timestamp: new Date().toISOString(),
            path: req.url
        });
    }
});

// Rate limit estricto para operaciones sensibles (crear, actualizar, eliminar)
export const strictRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: {
        error: 'Límite excedido para operaciones de escritura, intenta de nuevo en 10 minutos.'
    },

    handler: (req, res) => {
        const error = AppErrors.tooManyRequests('Límite excedido para operaciones de escritura');
        res.status(error.output.statusCode).json({
            error: {
                statusCode: error.output.statusCode,
                message: error.message
            },
            timestamp: new Date().toISOString(),
            path: req.url
        });
    }
});

// Rate limit suave para operaciones de lectura
export const readRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        error: 'Límite excedido para consultas, intenta de nuevo en 5 minutos.'
    }
});