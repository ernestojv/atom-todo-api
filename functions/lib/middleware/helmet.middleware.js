"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicSecurity = exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
// Configuración básica de Helmet
exports.securityHeaders = (0, helmet_1.default)({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            connectSrc: ["'self'"]
        }
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    // Forzar HTTPS en producción
    hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true
    },
    hidePoweredBy: true,
    referrerPolicy: { policy: "no-referrer" }
});
// Versión simplificada para desarrollo
exports.basicSecurity = (0, helmet_1.default)({
    contentSecurityPolicy: false,
    hsts: false
});
//# sourceMappingURL=helmet.middleware.js.map