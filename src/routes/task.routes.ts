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

const router = Router();
const taskController = new TaskController();

router.get('/', 
  readRateLimit,
  validate(getTasksQuerySchema, 'query'),
  asyncHandler(taskController.getTasks.bind(taskController))
);

router.get('/stats',
  readRateLimit,
  validate(getTasksQuerySchema, 'query'),
  asyncHandler(taskController.getTaskStats.bind(taskController))
);

router.get('/:id', 
  readRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.getTaskById.bind(taskController))
);

router.post('/', 
  strictRateLimit,
  validate(createTaskSchema, 'body'),
  asyncHandler(taskController.createTask.bind(taskController))
);

router.put('/:id', 
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  asyncHandler(taskController.updateTask.bind(taskController))
);

router.delete('/:id', 
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.deleteTask.bind(taskController))
);

router.patch('/:id/in-progress',
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.moveToInProgress.bind(taskController))
);

router.patch('/:id/done',
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.markAsDone.bind(taskController))
);

router.patch('/:id/todo',
  strictRateLimit,
  validate(taskParamsSchema, 'params'),
  asyncHandler(taskController.moveBackToTodo.bind(taskController))
);

export { router as taskRoutes };