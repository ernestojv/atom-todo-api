"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next); // Envía cualquier error al error middleware
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.middleware.js.map