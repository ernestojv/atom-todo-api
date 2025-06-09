"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_service_1 = require("../services/jwt.service");
const authMiddleware = async (req, res, next) => {
    const jwtService = new jwt_service_1.JwtService();
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'Token de autorización requerido'
            });
            return;
        }
        // Verificar formato: "Bearer TOKEN"
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token no válido'
            });
            return;
        }
        // Verificar el token usando tu servicio
        const decoded = await jwtService.verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map