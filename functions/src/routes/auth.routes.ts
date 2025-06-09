import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { strictRateLimit, readRateLimit } from '../middleware/rateLimit.middleware';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();
const authController = new AuthController();

router.post('/login',
  strictRateLimit,
  validate(loginSchema, 'body'),
  asyncHandler(authController.login.bind(authController))
);

router.post('/verify',
  readRateLimit,
  asyncHandler(authController.verifyToken.bind(authController))
);

router.post('/refresh',
  strictRateLimit,
  asyncHandler(authController.refreshToken.bind(authController))
);

router.post('/logout',
  readRateLimit,
  asyncHandler(authController.logout.bind(authController))
);

export { router as authRoutes };