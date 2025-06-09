import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { strictRateLimit, readRateLimit } from '../middleware/rateLimit.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
  taskParamsSchema
} from '../schemas/task.schema';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.get('/',
  authMiddleware,
  readRateLimit,
  validate(getTasksQuerySchema, 'query'),
  asyncHandler(taskController.getTasks.bind(taskController))
);

router.get('/stats',
  authMiddleware,
  readRateLimit,
  validate(getTasksQuerySchema, 'query'),
  asyncHandler(taskController.getTaskStats.bind(taskController))
);

router.get('/:id',
  authMiddleware,
  readRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.getTaskById.bind(taskController))
);

router.post('/',
  authMiddleware,
  strictRateLimit,
  validate(createTaskSchema, 'body'),
  asyncHandler(taskController.createTask.bind(taskController))
);

router.put('/:id',
  authMiddleware,
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  asyncHandler(taskController.updateTask.bind(taskController))
);

router.delete('/:id',
  authMiddleware,
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.deleteTask.bind(taskController))
);

router.patch('/:id/in-progress',
  authMiddleware,
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.moveToInProgress.bind(taskController))
);

router.patch('/:id/done',
  authMiddleware,
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.markAsDone.bind(taskController))
);

router.patch('/:id/todo',
  authMiddleware,
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.moveBackToTodo.bind(taskController))
);

export { router as taskRoutes };