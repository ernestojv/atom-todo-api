import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  if (process.env.NODE_ENV === 'test') {
    admin.initializeApp({
      projectId: 'test-project'
    });
  } else {
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

if (process.env.NODE_ENV === 'test') {
  const host = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  db.settings({
    host: host,
    ssl: false
  });
}