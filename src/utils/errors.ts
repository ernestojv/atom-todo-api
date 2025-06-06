import Boom from '@hapi/boom';

export class AppErrors {

    static firestoreError(operation: string) {
        return Boom.internal(`Error en Firestore durante ${operation}`);
    }

}