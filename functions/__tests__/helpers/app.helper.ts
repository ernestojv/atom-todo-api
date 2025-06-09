import express from 'express';
import { corsMiddleware } from '../../src/middleware/cors.middleware';
import { errorHandler } from '../../src/middleware/error.middleware';
import { routerApi } from '../../src/routes/index.routes';

// Crear app de Express para testing
export function createTestApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());

  routerApi(app);

  app.use(errorHandler);

  return app;
}

// Datos de prueba
export const testUser = {
  email: 'test@integration.com',
  id: 'test-user-id'
};

export const testTask = {
  title: 'Test Task',
  description: 'Task for integration testing',
  status: 'todo' as const,
  userEmail: testUser.email
};