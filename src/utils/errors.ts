import Boom from '@hapi/boom';

export class AppErrors {

    static firestoreError(operation: string) {
        return Boom.internal(`Error en Firestore durante ${operation}`);
    }

    static validationError(message: string) {
        return Boom.badRequest(`Error de validación: ${message}`);
    }

    static tooManyRequests(message: string = 'Demasiadas solicitudes') {
        return Boom.tooManyRequests(message);
    }

    static requiredField(field: string) {
        return Boom.badRequest(`El campo ${field} es requerido`);
    }

    static invalidEmail() {
        return Boom.badRequest('El email proporcionado no es válido');
    }

    //Tasks

    static taskNotFound(id: string) {
        return Boom.notFound(`Tarea con ID ${id} no encontrada`);
    }

}