"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const firestore_1 = require("../config/firestore");
const task_model_1 = require("../models/task.model");
const errors_1 = require("../utils/errors");
class TaskRepository {
    constructor() {
        this.collectionName = 'tasks';
    }
    async findByUser(userEmail, status) {
        try {
            let query = firestore_1.db.collection(this.collectionName)
                .where('userEmail', '==', userEmail.toLowerCase().trim());
            if (status) {
                query = query.where('status', '==', status);
            }
            const snapshot = await query
                .orderBy('createdAt', 'desc')
                .get();
            const tasks = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                tasks.push({
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                    userEmail: data.userEmail
                });
            });
            return tasks;
        }
        catch (error) {
            console.error('Error en TaskRepository.findByUser:', error);
            throw errors_1.AppErrors.firestoreError('obtener tareas del usuario');
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
                title: data.title,
                description: data.description,
                status: data.status,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                userEmail: data.userEmail
            };
        }
        catch (error) {
            console.error('Error en TaskRepository.findById:', error);
            throw errors_1.AppErrors.firestoreError('obtener tarea por ID');
        }
    }
    async create(taskData) {
        try {
            const tasksRef = firestore_1.db.collection(this.collectionName);
            const dataToSave = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status || task_model_1.TaskStatus.TODO,
                createdAt: taskData.createdAt || new Date(),
                userEmail: taskData.userEmail.toLowerCase().trim()
            };
            const docRef = await tasksRef.add(dataToSave);
            return Object.assign({ id: docRef.id }, dataToSave);
        }
        catch (error) {
            console.error('Error en TaskRepository.create:', error);
            throw errors_1.AppErrors.firestoreError('crear tarea');
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
            if (updateData.title !== undefined)
                dataToUpdate.title = updateData.title;
            if (updateData.description !== undefined)
                dataToUpdate.description = updateData.description;
            if (updateData.status !== undefined)
                dataToUpdate.status = updateData.status;
            await docRef.update(dataToUpdate);
            return await this.findById(id);
        }
        catch (error) {
            console.error('Error en TaskRepository.update:', error);
            throw errors_1.AppErrors.firestoreError('actualizar tarea');
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
            console.error('Error en TaskRepository.delete:', error);
            throw errors_1.AppErrors.firestoreError('eliminar tarea');
        }
    }
    async countByUser(userEmail) {
        try {
            const tasksRef = firestore_1.db.collection(this.collectionName);
            const snapshot = await tasksRef
                .where('userEmail', '==', userEmail.toLowerCase().trim())
                .get();
            return snapshot.size;
        }
        catch (error) {
            console.error('Error en TaskRepository.countByUser:', error);
            throw errors_1.AppErrors.firestoreError('contar tareas del usuario');
        }
    }
    async getTaskStatsByUser(userEmail) {
        try {
            const tasks = await this.findByUser(userEmail);
            const total = tasks.length;
            const todo = tasks.filter(task => task.status === task_model_1.TaskStatus.TODO).length;
            const inProgress = tasks.filter(task => task.status === task_model_1.TaskStatus.IN_PROGRESS).length;
            const done = tasks.filter(task => task.status === task_model_1.TaskStatus.DONE).length;
            return { total, todo, inProgress, done };
        }
        catch (error) {
            console.error('Error en TaskRepository.getTaskStatsByUser:', error);
            throw errors_1.AppErrors.firestoreError('obtener estadísticas de tareas');
        }
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=task.repository.js.map