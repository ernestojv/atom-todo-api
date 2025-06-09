import { db } from '../config/firestore';
import { User, CreateUserData, UpdateUserData } from '../models/user.model';
import { AppErrors } from '../utils/errors';

export class UserRepository {
  private readonly collectionName = 'users';

  async findByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = db.collection(this.collectionName);
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
    } catch (error) {
      console.error('Error en UserRepository.findByEmail:', error);
      throw AppErrors.firestoreError('obtener usuario por email');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        email: data.email,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
        isActive: data.isActive
      };
    } catch (error) {
      console.error('Error en UserRepository.findById:', error);
      throw AppErrors.firestoreError('obtener usuario por ID');
    }
  }

  async create(userData: CreateUserData): Promise<User> {
    try {
      const usersRef = db.collection(this.collectionName);

      const dataToSave = {
        email: userData.email.toLowerCase().trim(),
        createdAt: userData.createdAt || new Date(),
        isActive: userData.isActive !== undefined ? userData.isActive : true
      };

      const docRef = await usersRef.add(dataToSave);

      return {
        id: docRef.id,
        ...dataToSave
      };
    } catch (error) {
      console.error('Error en UserRepository.create:', error);
      throw AppErrors.firestoreError('crear usuario');
    }
  }

  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        return null;
      }

      const dataToUpdate: any = {
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
    } catch (error) {
      console.error('Error en UserRepository.update:', error);
      throw AppErrors.firestoreError('actualizar usuario');
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
      console.error('Error en UserRepository.delete:', error);
      throw AppErrors.firestoreError('eliminar usuario');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const usersRef = db.collection(this.collectionName);
      const snapshot = await usersRef
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      const users: User[] = [];
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
    } catch (error) {
      console.error('Error en UserRepository.findAll:', error);
      throw AppErrors.firestoreError('obtener todos los usuarios');
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      console.error('Error en UserRepository.emailExists:', error);
      throw AppErrors.firestoreError('verificar existencia de email');
    }
  }

  async countUsers(): Promise<number> {
    try {
      const usersRef = db.collection(this.collectionName);
      const snapshot = await usersRef
        .where('isActive', '==', true)
        .get();

      return snapshot.size;
    } catch (error) {
      console.error('Error en UserRepository.countUsers:', error);
      throw AppErrors.firestoreError('contar usuarios');
    }
  }

  async deleteUserTasks(userEmail: string): Promise<number> {
    try {
      const tasksRef = db.collection('tasks');
      const snapshot = await tasksRef
        .where('userEmail', '==', userEmail.toLowerCase().trim())
        .get();

      const batch = db.batch();
      let deletedCount = 0;

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      if (deletedCount > 0) {
        await batch.commit();
      }

      return deletedCount;
    } catch (error) {
      console.error('Error en UserRepository.deleteUserTasks:', error);
      throw AppErrors.firestoreError('eliminar tareas del usuario');
    }
  }
}