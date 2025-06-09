import * as admin from 'firebase-admin';

// Configuración para Cloud Functions
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();