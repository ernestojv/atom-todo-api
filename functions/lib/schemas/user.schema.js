"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailParamsSchema = exports.userParamsSchema = exports.checkUserQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
    }),
    createdAt: joi_1.default.date()
        .default(() => new Date())
});
exports.updateUserSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .optional()
        .messages({
        'string.email': 'Debe ser un email válido'
    }),
    isActive: joi_1.default.boolean()
        .optional()
});
exports.checkUserQuerySchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
    })
});
exports.userParamsSchema = joi_1.default.object({
    id: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'El ID del usuario es requerido'
    })
});
exports.getUserByEmailParamsSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
    })
});
//# sourceMappingURL=user.schema.js.map