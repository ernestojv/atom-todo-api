"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRateLimit = exports.strictRateLimit = exports.generalRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errors_1 = require("../utils/errors");
// Rate limit general para toda la API
exports.generalRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const error = errors_1.AppErrors.tooManyRequests('Demasiadas solicitudes desde esta IP');
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
exports.strictRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: {
        error: 'Límite excedido para operaciones de escritura, intenta de nuevo en 10 minutos.'
    },
    handler: (req, res) => {
        const error = errors_1.AppErrors.tooManyRequests('Límite excedido para operaciones de escritura');
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
exports.readRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        error: 'Límite excedido para consultas, intenta de nuevo en 5 minutos.'
    }
});
//# sourceMappingURL=rateLimit.middleware.js.map