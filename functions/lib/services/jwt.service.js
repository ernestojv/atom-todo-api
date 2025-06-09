"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
class JwtService {
    constructor() {
        this._secret = null;
        this._expiresIn = null;
    }
    get secret() {
        if (!this._secret) {
            this._secret = process.env.JWT_SECRET || 'default_secret';
            if (!this._secret) {
                throw new Error('JWT_SECRET environment variable is required');
            }
        }
        return this._secret;
    }
    get expiresIn() {
        if (!this._expiresIn) {
            this._expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        }
        return this._expiresIn;
    }
    generateToken(user) {
        try {
            return jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email
            }, this.secret, {
                expiresIn: this.expiresIn
            });
        }
        catch (error) {
            console.error('Error generating JWT token:', error);
            throw errors_1.AppErrors.jwtGenerationError();
        }
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch (error) {
            console.error('Error verifying JWT token:', error);
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw errors_1.AppErrors.tokenExpired();
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw errors_1.AppErrors.invalidToken();
            }
            throw errors_1.AppErrors.tokenVerificationError();
        }
    }
    extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            throw errors_1.AppErrors.missingToken();
        }
        if (!authHeader.startsWith('Bearer ')) {
            throw errors_1.AppErrors.invalidTokenFormat();
        }
        const token = authHeader.substring(7);
        if (!token) {
            throw errors_1.AppErrors.missingToken();
        }
        return token;
    }
    getTokenInfo(token) {
        return this.verifyToken(token);
    }
}
exports.JwtService = JwtService;
exports.jwtService = new JwtService();
//# sourceMappingURL=jwt.service.js.map