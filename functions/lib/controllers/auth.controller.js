"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../services/user.service");
const jwt_service_1 = require("../services/jwt.service");
const errors_1 = require("../utils/errors");
class AuthController {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.jwtService = new jwt_service_1.JwtService();
    }
    async login(req, res) {
        const { email } = req.body;
        let user;
        try {
            user = await this.userService.getUserByEmail(email);
        }
        catch (error) {
            if (typeof error === 'object' &&
                error !== null &&
                'output' in error &&
                typeof error.output === 'object' &&
                error.output !== null &&
                'statusCode' in error.output &&
                error.output.statusCode === 404) {
                throw errors_1.AppErrors.authenticationFailed();
            }
            else {
                throw error;
            }
        }
        if (!user.isActive) {
            throw errors_1.AppErrors.authenticationFailed();
        }
        const token = this.jwtService.generateToken(user);
        const response = {
            success: true,
            data: {
                user,
                token,
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            },
            message: 'Inicio de sesión exitoso',
            timestamp: new Date().toISOString()
        };
        res.status(200).json(response);
    }
    async verifyToken(req, res) {
        const authHeader = req.headers.authorization;
        const token = this.jwtService.extractTokenFromHeader(authHeader);
        const payload = this.jwtService.verifyToken(token);
        const user = await this.userService.getUserById(payload.userId);
        res.status(200).json({
            success: true,
            data: {
                valid: true,
                user,
                payload
            },
            timestamp: new Date().toISOString()
        });
    }
    async refreshToken(req, res) {
        const authHeader = req.headers.authorization;
        const token = this.jwtService.extractTokenFromHeader(authHeader);
        const payload = this.jwtService.verifyToken(token);
        const user = await this.userService.getUserById(payload.userId);
        if (!user.isActive) {
            throw errors_1.AppErrors.authenticationFailed();
        }
        const newToken = this.jwtService.generateToken(user);
        res.status(200).json({
            success: true,
            data: {
                user,
                token: newToken,
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            },
            message: 'Token renovado exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async logout(req, res) {
        // TODO: Implement logout logic and token invalidation
        res.status(200).json({
            success: true,
            message: 'Sesión cerrada exitosamente',
            timestamp: new Date().toISOString()
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map