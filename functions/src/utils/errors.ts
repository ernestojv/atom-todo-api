import Boom from '@hapi/boom';

export class AppErrors {
  static userNotFound(email: string) {
    return Boom.notFound(`Usuario con email ${email} no encontrado`);
  }

  static userNotFoundById(id: string) {
    return Boom.notFound(`Usuario con ID ${id} no encontrado`);
  }

  static userAlreadyExists(email: string) {
    return Boom.conflict(`El usuario con email ${email} ya existe`);
  }

  static emailAlreadyInUse(email: string) {
    return Boom.conflict(`El email ${email} ya está en uso`);
  }

  static userCreationFailed(email: string) {
    return Boom.internal(`Error al crear usuario con email ${email}`);
  }

  static userDeactivated(email: string) {
    return Boom.forbidden(`El usuario ${email} está desactivado`);
  }

  static taskNotFound(id: string) {
    return Boom.notFound(`Tarea con ID ${id} no encontrada`);
  }

  static invalidEmail() {
    return Boom.badRequest('El formato del email es inválido');
  }

  static requiredField(field: string) {
    return Boom.badRequest(`El campo ${field} es requerido`);
  }

  static firestoreError(operation: string) {
    return Boom.internal(`Error en Firestore durante ${operation}`);
  }

  static unauthorized(message: string = 'No autorizado') {
    return Boom.unauthorized(message);
  }

  static validationError(message: string) {
    return Boom.badRequest(`Error de validación: ${message}`);
  }

  static tooManyRequests(message: string = 'Demasiadas solicitudes') {
    return Boom.tooManyRequests(message);
  }

  static jwtGenerationError() {
    return Boom.internal('Error al generar token JWT');
  }

  static tokenExpired() {
    return Boom.unauthorized('Token expirado');
  }

  static invalidToken() {
    return Boom.unauthorized('Token inválido');
  }

  static tokenVerificationError() {
    return Boom.unauthorized('Error al verificar token');
  }

  static missingToken() {
    return Boom.unauthorized('Token requerido');
  }

  static invalidTokenFormat() {
    return Boom.unauthorized('Formato de token inválido. Use: Bearer <token>');
  }

  static authenticationFailed() {
    return Boom.unauthorized('Credenciales inválidas o usuario no encontrado');
  }
}