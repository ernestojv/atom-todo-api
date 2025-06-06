import * as admin from 'firebase-admin';

import { ServiceAccount } from "firebase-admin";
const serviceAccount = require("../keys/serviceAcoountKey.json") as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const firestore = admin.firestore();