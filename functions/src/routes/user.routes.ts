import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { strictRateLimit, readRateLimit } from '../middleware/rateLimit.middleware';
import {
  createUserSchema,
  updateUserSchema,
  checkUserQuerySchema,
  userParamsSchema,
  getUserByEmailParamsSchema
} from '../schemas/user.schema';

const router = Router();
const userController = new UserController();

router.get('/check',
  readRateLimit,
  validate(checkUserQuerySchema, 'query'),
  asyncHandler(userController.checkUserExists.bind(userController))
);

router.get('/stats',
  readRateLimit,
  asyncHandler(userController.getUserStats.bind(userController))
);

router.get('/all',
  readRateLimit,
  asyncHandler(userController.getAllUsers.bind(userController))
);

router.get('/email/:email',
  readRateLimit,
  validate(getUserByEmailParamsSchema, 'params'),
  asyncHandler(userController.getUserByEmail.bind(userController))
);

router.get('/:id',
  readRateLimit,
  validate(userParamsSchema, 'params'),
  asyncHandler(userController.getUserById.bind(userController))
);

router.post('/',
  strictRateLimit,
  validate(createUserSchema, 'body'),
  asyncHandler(userController.createUser.bind(userController))
);

router.put('/:id',
  strictRateLimit,
  validate(userParamsSchema, 'params'),
  validate(updateUserSchema, 'body'),
  asyncHandler(userController.updateUser.bind(userController))
);

router.delete('/:id',
  strictRateLimit,
  validate(userParamsSchema, 'params'),
  asyncHandler(userController.deleteUser.bind(userController))
);

router.patch('/:id/deactivate',
  strictRateLimit,
  validate(userParamsSchema, 'params'),
  asyncHandler(userController.deactivateUser.bind(userController))
);

router.patch('/:id/activate',
  strictRateLimit,
  validate(userParamsSchema, 'params'),
  asyncHandler(userController.activateUser.bind(userController))
);

export { router as userRoutes };