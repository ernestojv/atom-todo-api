"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firestore_1 = require("../config/firestore");
const errors_1 = require("../utils/errors");
class UserRepository {
    constructor() {
        this.collectionName = 'users';
    }
    async findByEmail(email) {
        try {
            const usersRef = firestore_1.db.collection(this.collectionName);
            const snapshot = await usersRef
                .where('email', '==', email.toLowerCase().trim())
                .limit(1)
                .get();
            if (snapshot.empty) {
                return null;
            }
            const doc = snapshot.docs[0];
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                isActive: data.isActive
            };
        }
        catch (error) {
            console.error('Error en UserRepository.findByEmail:', error);
            throw errors_1.AppErrors.firestoreError('obtener usuario por email');
        }
    }
    async findById(id) {
        try {
            const docRef = firestore_1.db.collection(this.collectionName).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return null;
            }
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                isActive: data.isActive
            };
        }
        catch (error) {
            console.error('Error en UserRepository.findById:', error);
            throw errors_1.AppErrors.firestoreError('obtener usuario por ID');
        }
    }
    async create(userData) {
        try {
            const usersRef = firestore_1.db.collection(this.collectionName);
            const dataToSave = {
                email: userData.email.toLowerCase().trim(),
                createdAt: userData.createdAt || new Date(),
                isActive: userData.isActive !== undefined ? userData.isActive : true
            };
            const docRef = await usersRef.add(dataToSave);
            return Object.assign({ id: docRef.id }, dataToSave);
        }
        catch (error) {
            console.error('Error en UserRepository.create:', error);
            throw errors_1.AppErrors.firestoreError('crear usuario');
        }
    }
    async update(id, updateData) {
        try {
            const docRef = firestore_1.db.collection(this.collectionName).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return null;
            }
            const dataToUpdate = {
                updatedAt: new Date()
            };
            if (updateData.email !== undefined) {
                dataToUpdate.email = updateData.email.toLowerCase().trim();
            }
            if (updateData.isActive !== undefined) {
                dataToUpdate.isActive = updateData.isActive;
            }
            await docRef.update(dataToUpdate);
            return await this.findById(id);
        }
        catch (error) {
            console.error('Error en UserRepository.update:', error);
            throw errors_1.AppErrors.firestoreError('actualizar usuario');
        }
    }
    async delete(id) {
        try {
            const docRef = firestore_1.db.collection(this.collectionName).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return false;
            }
            await docRef.delete();
            return true;
        }
        catch (error) {
            console.error('Error en UserRepository.delete:', error);
            throw errors_1.AppErrors.firestoreError('eliminar usuario');
        }
    }
    async findAll() {
        try {
            const usersRef = firestore_1.db.collection(this.collectionName);
            const snapshot = await usersRef
                .where('isActive', '==', true)
                .orderBy('createdAt', 'desc')
                .get();
            const users = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    email: data.email,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                    isActive: data.isActive
                });
            });
            return users;
        }
        catch (error) {
            console.error('Error en UserRepository.findAll:', error);
            throw errors_1.AppErrors.firestoreError('obtener todos los usuarios');
        }
    }
    async emailExists(email) {
        try {
            const user = await this.findByEmail(email);
            return user !== null;
        }
        catch (error) {
            console.error('Error en UserRepository.emailExists:', error);
            throw errors_1.AppErrors.firestoreError('verificar existencia de email');
        }
    }
    async countUsers() {
        try {
            const usersRef = firestore_1.db.collection(this.collectionName);
            const snapshot = await usersRef
                .where('isActive', '==', true)
                .get();
            return snapshot.size;
        }
        catch (error) {
            console.error('Error en UserRepository.countUsers:', error);
            throw errors_1.AppErrors.firestoreError('contar usuarios');
        }
    }
    async deleteUserTasks(userEmail) {
        try {
            const tasksRef = firestore_1.db.collection('tasks');
            const snapshot = await tasksRef
                .where('userEmail', '==', userEmail.toLowerCase().trim())
                .get();
            const batch = firestore_1.db.batch();
            let deletedCount = 0;
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
                deletedCount++;
            });
            if (deletedCount > 0) {
                await batch.commit();
            }
            return deletedCount;
        }
        catch (error) {
            console.error('Error en UserRepository.deleteUserTasks:', error);
            throw errors_1.AppErrors.firestoreError('eliminar tareas del usuario');
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map