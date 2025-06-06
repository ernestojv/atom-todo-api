import { Router } from 'express';
import { taskRoutes } from './task.routes';

const routerApi = (app: any) => {
    const router = Router();
    app.use('/api', router);
    router.use('/task', taskRoutes);
};

export { routerApi };