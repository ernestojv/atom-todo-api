import { Router } from 'express';
import { taskRoutes } from './task.routes';
import { userRoutes } from './user.routes';
const routerApi = (app: any) => {
    const router = Router();
    app.use('/api', router);
    router.use('/task', taskRoutes);
    router.use('/user', userRoutes);
};

export { routerApi };