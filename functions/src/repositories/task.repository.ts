import { db } from '../config/firestore';
import { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '../models/task.model';
import { AppErrors } from '../utils/errors';

export class TaskRepository {
    private readonly collectionName = 'tasks';

    async findByUser(userEmail: string, status?: TaskStatus): Promise<Task[]> {
        try {
            let query = db.collection(this.collectionName)
                .where('userEmail', '==', userEmail.toLowerCase().trim());

            if (status) {
                query = query.where('status', '==', status);
            }

            const snapshot = await query
                .orderBy('createdAt', 'desc')
                .get();

            const tasks: Task[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data() as {
                    title: string;
                    description: string;
                    status: TaskStatus;
                    createdAt: FirebaseFirestore.Timestamp;
                    updatedAt?: FirebaseFirestore.Timestamp;
                    userEmail: string;
                };
                tasks.push({
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    status: data.status as TaskStatus,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                    userEmail: data.userEmail
                });
            });

            return tasks;
        } catch (error) {
            console.error('Error en TaskRepository.findByUser:', error);
            throw AppErrors.firestoreError('obtener tareas del usuario');
        }
    }

    async findById(id: string): Promise<Task | null> {
        try {
            const docRef = db.collection(this.collectionName).doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return null;
            }

            const data = doc.data()!;
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                status: data.status as TaskStatus,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
                userEmail: data.userEmail
            };
        } catch (error) {
            console.error('Error en TaskRepository.findById:', error);
            throw AppErrors.firestoreError('obtener tarea por ID');
        }
    }

    async create(taskData: CreateTaskData): Promise<Task> {
        try {
            const tasksRef = db.collection(this.collectionName);

            const dataToSave = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status || TaskStatus.TODO,
                createdAt: taskData.createdAt || new Date(),
                userEmail: taskData.userEmail.toLowerCase().trim()
            };

            const docRef = await tasksRef.add(dataToSave);

            return {
                id: docRef.id,
                ...dataToSave
            };
        } catch (error) {
            console.error('Error en TaskRepository.create:', error);
            throw AppErrors.firestoreError('crear tarea');
        }
    }

    async update(id: string, updateData: UpdateTaskData): Promise<Task | null> {
        try {
            const docRef = db.collection(this.collectionName).doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return null;
            }

            const dataToUpdate: any = {
                updatedAt: new Date()
            };

            if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
            if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
            if (updateData.status !== undefined) dataToUpdate.status = updateData.status;

            await docRef.update(dataToUpdate);

            return await this.findById(id);
        } catch (error) {
            console.error('Error en TaskRepository.update:', error);
            throw AppErrors.firestoreError('actualizar tarea');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const docRef = db.collection(this.collectionName).doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return false;
            }

            await docRef.delete();
            return true;
        } catch (error) {
            console.error('Error en TaskRepository.delete:', error);
            throw AppErrors.firestoreError('eliminar tarea');
        }
    }

    async countByUser(userEmail: string): Promise<number> {
        try {
            const tasksRef = db.collection(this.collectionName);
            const snapshot = await tasksRef
                .where('userEmail', '==', userEmail.toLowerCase().trim())
                .get();

            return snapshot.size;
        } catch (error) {
            console.error('Error en TaskRepository.countByUser:', error);
            throw AppErrors.firestoreError('contar tareas del usuario');
        }
    }

    async getTaskStatsByUser(userEmail: string): Promise<{
        total: number;
        todo: number;
        inProgress: number;
        done: number;
    }> {
        try {
            const tasks = await this.findByUser(userEmail);
            const total = tasks.length;
            const todo = tasks.filter(task => task.status === TaskStatus.TODO).length;
            const inProgress = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
            const done = tasks.filter(task => task.status === TaskStatus.DONE).length;

            return { total, todo, inProgress, done };
        } catch (error) {
            console.error('Error en TaskRepository.getTaskStatsByUser:', error);
            throw AppErrors.firestoreError('obtener estadísticas de tareas');
        }
    }
}