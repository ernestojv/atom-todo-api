"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const errorHandler = (error, req, res, next) => {
    let boom;
    // Si ya es un error de Boom, usarlo directamente
    if (boom_1.default.isBoom(error)) {
        boom = error;
    }
    else {
        // Convertir errores comunes a Boom
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            boom = boom_1.default.serverUnavailable('Database connection failed');
        }
        else if (error.name === 'ValidationError') {
            boom = boom_1.default.badRequest(error.message);
        }
        else {
            // Error genérico
            boom = boom_1.default.internal(error.message || 'Internal Server Error');
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
        error: Object.assign({ statusCode: boom.output.statusCode, message: boom.message }, (process.env.NODE_ENV === 'development' && { stack: boom.stack })),
        timestamp: new Date().toISOString(),
        path: req.url
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map