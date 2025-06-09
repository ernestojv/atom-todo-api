"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const asyncHandler_middleware_1 = require("../middleware/asyncHandler.middleware");
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const authController = new auth_controller_1.AuthController();
router.post('/login', rateLimit_middleware_1.strictRateLimit, (0, validation_middleware_1.validate)(auth_schema_1.loginSchema, 'body'), (0, asyncHandler_middleware_1.asyncHandler)(authController.login.bind(authController)));
router.post('/verify', rateLimit_middleware_1.readRateLimit, (0, asyncHandler_middleware_1.asyncHandler)(authController.verifyToken.bind(authController)));
router.post('/refresh', rateLimit_middleware_1.strictRateLimit, (0, asyncHandler_middleware_1.asyncHandler)(authController.refreshToken.bind(authController)));
router.post('/logout', rateLimit_middleware_1.readRateLimit, (0, asyncHandler_middleware_1.asyncHandler)(authController.logout.bind(authController)));
//# sourceMappingURL=auth.routes.js.map