"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerApi = void 0;
const express_1 = require("express");
const task_routes_1 = require("./task.routes");
const user_routes_1 = require("./user.routes");
const auth_routes_1 = require("./auth.routes");
const routerApi = (app) => {
    const router = (0, express_1.Router)();
    app.use('/api', router);
    router.use('/task', task_routes_1.taskRoutes);
    router.use('/user', user_routes_1.userRoutes);
    router.use('/auth', auth_routes_1.authRoutes);
};
exports.routerApi = routerApi;
//# sourceMappingURL=index.routes.js.map