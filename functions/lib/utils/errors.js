"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrors = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
class AppErrors {
    static userNotFound(email) {
        return boom_1.default.notFound(`Usuario con email ${email} no encontrado`);
    }
    static userNotFoundById(id) {
        return boom_1.default.notFound(`Usuario con ID ${id} no encontrado`);
    }
    static userAlreadyExists(email) {
        return boom_1.default.conflict(`El usuario con email ${email} ya existe`);
    }
    static emailAlreadyInUse(email) {
        return boom_1.default.conflict(`El email ${email} ya está en uso`);
    }
    static userCreationFailed(email) {
        return boom_1.default.internal(`Error al crear usuario con email ${email}`);
    }
    static userDeactivated(email) {
        return boom_1.default.forbidden(`El usuario ${email} está desactivado`);
    }
    static taskNotFound(id) {
        return boom_1.default.notFound(`Tarea con ID ${id} no encontrada`);
    }
    static invalidEmail() {
        return boom_1.default.badRequest('El formato del email es inválido');
    }
    static requiredField(field) {
        return boom_1.default.badRequest(`El campo ${field} es requerido`);
    }
    static firestoreError(operation) {
        return boom_1.default.internal(`Error en Firestore durante ${operation}`);
    }
    static unauthorized(message = 'No autorizado') {
        return boom_1.default.unauthorized(message);
    }
    static validationError(message) {
        return boom_1.default.badRequest(`Error de validación: ${message}`);
    }
    static tooManyRequests(message = 'Demasiadas solicitudes') {
        return boom_1.default.tooManyRequests(message);
    }
    static jwtGenerationError() {
        return boom_1.default.internal('Error al generar token JWT');
    }
    static tokenExpired() {
        return boom_1.default.unauthorized('Token expirado');
    }
    static invalidToken() {
        return boom_1.default.unauthorized('Token inválido');
    }
    static tokenVerificationError() {
        return boom_1.default.unauthorized('Error al verificar token');
    }
    static missingToken() {
        return boom_1.default.unauthorized('Token requerido');
    }
    static invalidTokenFormat() {
        return boom_1.default.unauthorized('Formato de token inválido. Use: Bearer <token>');
    }
    static authenticationFailed() {
        return boom_1.default.unauthorized('Credenciales inválidas o usuario no encontrado');
    }
}
exports.AppErrors = AppErrors;
//# sourceMappingURL=errors.js.map