"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errors_1 = require("../utils/errors");
// Función par middleware para validar con Joi
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message).join(', ');
            throw errors_1.AppErrors.validationError(errorMessages);
        }
        if (property === 'body') {
            req[property] = value;
        }
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map