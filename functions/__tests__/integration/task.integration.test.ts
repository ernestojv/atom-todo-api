import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';

describe('Task Integration Tests', () => {
  const app = createTestApp();
  let authToken: string;
  let testUserEmail: string;
  let createdTaskId: string;

  const uniqueUser = () => ({
    email: `taskuser-${Date.now()}@test.com`
  });

  const testTask = {
    title: 'Test Task',
    description: 'Task for integration testing',
    status: 'todo' as const
  };

  beforeAll(async () => {
    const userData = uniqueUser();
    testUserEmail = userData.email;

    await request(app)
      .post('/api/user')
      .send({ email: testUserEmail });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserEmail });

    authToken = loginResponse.body.data.token;
  });

  describe('POST /api/task', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          userEmail: testUserEmail
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Tarea creada exitosamente',
        data: {
          title: testTask.title,
          description: testTask.description,
          status: testTask.status,
          userEmail: testUserEmail,
          id: expect.any(String)
        }
      });

      createdTaskId = response.body.data.id;
    });

    it('should reject task creation without auth token', async () => {
      const response = await request(app)
        .post('/api/task')
        .send({
          ...testTask,
          userEmail: testUserEmail
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should reject task with invalid data', async () => {
      const response = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Empty title
          userEmail: testUserEmail
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject task with missing required fields', async () => {
      const response = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing title and userEmail'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should create task with valid status values', async () => {
      const statuses = ['todo', 'in_progress', 'done'];
      
      for (const status of statuses) {
        const response = await request(app)
          .post('/api/task')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: `Task with ${status} status`,
            description: 'Testing status values',
            status,
            userEmail: testUserEmail
          });

        expect(response.status).toBe(201);
        expect(response.body.data.status).toBe(status);
      }
    });
  });

  describe('GET /api/task', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Todo Task',
          description: 'A todo task',
          status: 'todo',
          userEmail: testUserEmail
        });

      await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'In Progress Task',
          description: 'An in-progress task',
          status: 'in_progress',
          userEmail: testUserEmail
        });
    });

    it('should get all tasks for user', async () => {
      const response = await request(app)
        .get(`/api/task?userEmail=${testUserEmail}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        count: expect.any(Number),
        filter: 'all',
        data: expect.any(Array)
      });

      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.count).toBe(response.body.data.length);

      const userEmails = response.body.data.map((task: any) => task.userEmail);
      expect(userEmails.every((email: string) => email === testUserEmail)).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get(`/api/task?userEmail=${testUserEmail}&status=todo`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        filter: { status: 'todo' },
        data: expect.any(Array)
      });

      const statuses = response.body.data.map((task: any) => task.status);
      expect(statuses.every((status: string) => status === 'todo')).toBe(true);
    });

    it('should reject request without auth token', async () => {
      const response = await request(app)
        .get(`/api/task?userEmail=${testUserEmail}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should reject request without userEmail', async () => {
      const response = await request(app)
        .get('/api/task')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return empty array for user with no tasks', async () => {
      const newUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: newUser.email });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: newUser.email });

      const response = await request(app)
        .get(`/api/task?userEmail=${newUser.email}`)
        .set('Authorization', `Bearer ${loginRes.body.data.token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /api/task/stats', () => {
    beforeEach(async () => {
      const statuses = ['todo', 'in-progress', 'done'];
      
      for (let i = 0; i < statuses.length; i++) {
        await request(app)
          .post('/api/task')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: `Task ${i + 1}`,
            description: `Task with ${statuses[i]} status`,
            status: statuses[i],
            userEmail: testUserEmail
          });
      }
    });

    it('should get task statistics for user', async () => {
      const response = await request(app)
        .get(`/api/task/stats?userEmail=${testUserEmail}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Object)
      });

      expect(response.body.data).toHaveProperty('total');
      expect(typeof response.body.data.total).toBe('number');
      expect(response.body.data.total).toBeGreaterThanOrEqual(3);
      
      expect(response.body.data).toHaveProperty('todo');
      expect(response.body.data).toHaveProperty('done');
      
      if (response.body.data.inProgress !== undefined) {
        expect(typeof response.body.data.inProgress).toBe('number');
      }
    });

    it('should reject request without auth token', async () => {
      const response = await request(app)
        .get(`/api/task/stats?userEmail=${testUserEmail}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/task/:id', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          userEmail: testUserEmail
        });
      
      createdTaskId = createResponse.body.data.id;
    });

    it('should get task by id', async () => {
      const response = await request(app)
        .get(`/api/task/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: createdTaskId,
          title: testTask.title,
          description: testTask.description,
          status: testTask.status,
          userEmail: testUserEmail
        }
      });
    });

    it('should reject request without auth token', async () => {
      const response = await request(app)
        .get(`/api/task/${createdTaskId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should reject access to other user\'s task', async () => {
      const otherUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: otherUser.email });

      const otherLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: otherUser.email });

      if (otherLoginRes.status !== 200 || !otherLoginRes.body.data?.token) {
        throw new Error(`Failed to login other user: ${JSON.stringify(otherLoginRes.body)}`);
      }

      const response = await request(app)
        .get(`/api/task/${createdTaskId}`)
        .set('Authorization', `Bearer ${otherLoginRes.body.data.token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should handle non-existing task id', async () => {
      const response = await request(app)
        .get('/api/task/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/task/:id', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          userEmail: testUserEmail
        });
      
      createdTaskId = createResponse.body.data.id;
    });

    it('should update task', async () => {
      const updateData = {
        title: 'Updated Task Title',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/task/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Tarea actualizada exitosamente',
        data: {
          id: createdTaskId,
          title: updateData.title,
          description: updateData.description,
          userEmail: testUserEmail
        }
      });
    });

    it('should reject update without auth token', async () => {
      const response = await request(app)
        .put(`/api/task/${createdTaskId}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should reject update of other user\'s task', async () => {
      const otherUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: otherUser.email });

      const otherLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: otherUser.email });

      if (otherLoginRes.status !== 200 || !otherLoginRes.body.data?.token) {
        throw new Error(`Failed to login other user: ${JSON.stringify(otherLoginRes.body)}`);
      }

      const response = await request(app)
        .put(`/api/task/${createdTaskId}`)
        .set('Authorization', `Bearer ${otherLoginRes.body.data.token}`)
        .send({ title: 'Hacked' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should handle non-existing task id', async () => {
      const response = await request(app)
        .put('/api/task/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' });

      expect([404, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/task/:id/in-progress', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          userEmail: testUserEmail
        });
      
      createdTaskId = createResponse.body.data.id;
    });

    it('should move task to in-progress', async () => {
      const response = await request(app)
        .patch(`/api/task/${createdTaskId}/in-progress`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Tarea movida a En Progreso',
        data: {
          id: createdTaskId,
          status: 'in_progress'
        }
      });
    });

    it('should reject without auth token', async () => {
      const response = await request(app)
        .patch(`/api/task/${createdTaskId}/in-progress`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/task/:id/done', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          userEmail: testUserEmail
        });
      
      createdTaskId = createResponse.body.data.id;
    });

    it('should mark task as done', async () => {
      const response = await request(app)
        .patch(`/api/task/${createdTaskId}/done`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Tarea marcada como Completada',
        data: {
          id: createdTaskId,
          status: 'done'
        }
      });
    });

    it('should reject without auth token', async () => {
      const response = await request(app)
        .patch(`/api/task/${createdTaskId}/done`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/task/:id/todo', () => {
    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          status: 'done',
          userEmail: testUserEmail
        });
      
      createdTaskId = createResponse.body.data.id;
    });

    it('should move task back to todo', async () => {
      const response = await request(app)
        .patch(`/api/task/${createdTaskId}/todo`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Tarea movida a Por Hacer',
        data: {
          id: createdTaskId,
          status: 'todo'
        }
      });
    });

    it('should reject without auth token', async () => {
      const response = await request(app)
        .patch(`/api/task/${createdTaskId}/todo`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/task/:id', () => {
    let taskToDeleteId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testTask,
          userEmail: testUserEmail
        });
      
      if (createResponse.status === 201) {
        taskToDeleteId = createResponse.body.data.id;
      }
    });

    it('should delete task', async () => {
      if (!taskToDeleteId) {
        throw new Error('Task was not created properly in beforeEach');
      }

      const response = await request(app)
        .delete(`/api/task/${taskToDeleteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Tarea eliminada exitosamente'
      });

      const checkResponse = await request(app)
        .get(`/api/task/${taskToDeleteId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect([404, 500]).toContain(checkResponse.status);
      expect(checkResponse.body.success).toBe(false);
    });

    it('should reject delete without auth token', async () => {
      if (!taskToDeleteId) {
        return; // Skip test if no task was created
      }

      const response = await request(app)
        .delete(`/api/task/${taskToDeleteId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should reject delete of other user\'s task', async () => {
      if (!taskToDeleteId) {
        return; // Skip test if no task was created
      }

      const otherUser = uniqueUser();
      
      await request(app)
        .post('/api/user')
        .send({ email: otherUser.email });

      const otherLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: otherUser.email });

      if (otherLoginRes.status !== 200 || !otherLoginRes.body.data?.token) {
        throw new Error(`Failed to login other user: ${JSON.stringify(otherLoginRes.body)}`);
      }

      const response = await request(app)
        .delete(`/api/task/${taskToDeleteId}`)
        .set('Authorization', `Bearer ${otherLoginRes.body.data.token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    it('should handle non-existing task id', async () => {
      const response = await request(app)
        .delete('/api/task/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });
});