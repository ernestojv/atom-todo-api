"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const asyncHandler_middleware_1 = require("../middleware/asyncHandler.middleware");
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
exports.userRoutes = router;
const userController = new user_controller_1.UserController();
router.get('/check', rateLimit_middleware_1.readRateLimit, (0, validation_middleware_1.validate)(user_schema_1.checkUserQuerySchema, 'query'), (0, asyncHandler_middleware_1.asyncHandler)(userController.checkUserExists.bind(userController)));
router.get('/stats', rateLimit_middleware_1.readRateLimit, (0, asyncHandler_middleware_1.asyncHandler)(userController.getUserStats.bind(userController)));
router.get('/all', rateLimit_middleware_1.readRateLimit, (0, asyncHandler_middleware_1.asyncHandler)(userController.getAllUsers.bind(userController)));
router.get('/email/:email', rateLimit_middleware_1.readRateLimit, (0, validation_middleware_1.validate)(user_schema_1.getUserByEmailParamsSchema, 'params'), (0, asyncHandler_middleware_1.asyncHandler)(userController.getUserByEmail.bind(userController)));
router.get('/:id', rateLimit_middleware_1.readRateLimit, (0, validation_middleware_1.validate)(user_schema_1.userParamsSchema, 'params'), (0, asyncHandler_middleware_1.asyncHandler)(userController.getUserById.bind(userController)));
router.post('/', rateLimit_middleware_1.strictRateLimit, (0, validation_middleware_1.validate)(user_schema_1.createUserSchema, 'body'), (0, asyncHandler_middleware_1.asyncHandler)(userController.createUser.bind(userController)));
router.put('/:id', rateLimit_middleware_1.strictRateLimit, (0, validation_middleware_1.validate)(user_schema_1.userParamsSchema, 'params'), (0, validation_middleware_1.validate)(user_schema_1.updateUserSchema, 'body'), (0, asyncHandler_middleware_1.asyncHandler)(userController.updateUser.bind(userController)));
router.delete('/:id', rateLimit_middleware_1.strictRateLimit, (0, validation_middleware_1.validate)(user_schema_1.userParamsSchema, 'params'), (0, asyncHandler_middleware_1.asyncHandler)(userController.deleteUser.bind(userController)));
router.patch('/:id/deactivate', rateLimit_middleware_1.strictRateLimit, (0, validation_middleware_1.validate)(user_schema_1.userParamsSchema, 'params'), (0, asyncHandler_middleware_1.asyncHandler)(userController.deactivateUser.bind(userController)));
router.patch('/:id/activate', rateLimit_middleware_1.strictRateLimit, (0, validation_middleware_1.validate)(user_schema_1.userParamsSchema, 'params'), (0, asyncHandler_middleware_1.asyncHandler)(userController.activateUser.bind(userController)));
//# sourceMappingURL=user.routes.js.map