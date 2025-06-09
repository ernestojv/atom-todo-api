import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const jwtService: JwtService = new JwtService();
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

    } catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};