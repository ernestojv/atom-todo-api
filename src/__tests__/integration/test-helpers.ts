import request from 'supertest';
import express from 'express';
import { corsMiddleware } from '../../middleware/cors.middleware';
import { basicSecurity } from '../../middleware/helmet.middleware';
import { errorHandler } from '../../middleware/error.middleware';
import { taskRoutes } from '../../routes/task.routes';
import { userRoutes } from '../../routes/user.routes';
import { authRoutes } from '../../routes/auth.routes';

export function createTestApp(): express.Application {
  const app = express();
  
  app.use(corsMiddleware);
  app.use(basicSecurity);
  app.use(express.json());
  
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/users', userRoutes);
  
  app.use(errorHandler);
  
  return app;
}

export const testUser = {
  email: 'integration.test@example.com',
  id: 'test-user-id'
};

export const testTask = {
  title: 'Integration Test Task',
  description: 'Task for integration testing',
  userEmail: testUser.email
};

export async function createTestUser(app: express.Application) {
  try {
    console.log('Creating test user with email:', testUser.email);
    
    const response = await request(app)
      .post('/api/users')
      .send({
        email: testUser.email
      });
    
    console.log('Create user response status:', response.status);
    console.log('Create user response body:', JSON.stringify(response.body, null, 2));
    
    if (response.status !== 201) {
      throw new Error(`Failed to create user: ${response.status} - ${JSON.stringify(response.body)}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error in createTestUser:', error);
    throw error;
  }
}

export async function loginAndGetToken(app: express.Application): Promise<string> {
  try {
    console.log('Attempting login with email:', testUser.email);
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email });
    
    console.log('Login response status:', response.status);
    console.log('Login response body:', JSON.stringify(response.body, null, 2));
    
    if (response.status !== 200) {
      throw new Error(`Login failed: ${response.status} - ${JSON.stringify(response.body)}`);
    }
    
    if (!response.body?.data?.token) {
      throw new Error(`No token in login response: ${JSON.stringify(response.body)}`);
    }
    
    return response.body.data.token;
  } catch (error) {
    console.error('Error in loginAndGetToken:', error);
    throw error;
  }
}

export function getAuthHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function cleanupTestUser(app: express.Application) {
  try {
    console.log('Cleaning up test user:', testUser.email);
    
    // Intentar obtener el usuario
    const userResponse = await request(app)
      .get(`/api/users/email/${encodeURIComponent(testUser.email)}`);
    
    if (userResponse.status === 200 && userResponse.body?.data?.id) {
      console.log('Found user to delete:', userResponse.body.data.id);
      
      // Eliminar el usuario
      const deleteResponse = await request(app)
        .delete(`/api/users/${userResponse.body.data.id}`);
      
      console.log('Delete user response status:', deleteResponse.status);
    } else {
      console.log('User not found, nothing to cleanup');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('Cleanup error (this is normal):', error.message);
    } else {
      console.log('Cleanup error (this is normal):', error);
    }
  }
}