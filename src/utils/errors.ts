import Boom from '@hapi/boom';

export class AppErrors {

    static firestoreError(operation: string) {
        return Boom.internal(`Error en Firestore durante ${operation}`);
    }

    static validationError(message: string) {
        return Boom.badRequest(`Error de validación: ${message}`);
    }

}