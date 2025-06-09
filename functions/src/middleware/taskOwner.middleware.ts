import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';

declare global {
    namespace Express {
        interface Request {
            user?: any;
            task?: any;
        }
    }
}

export const validateTaskOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const tasksService = new TaskService();
    try {
        const userEmail = req.user?.email;
        const taskId = req.params.id || req.params.taskId;

        if (!userEmail) {
            res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
            return;
        }

        if (!taskId) {
            res.status(400).json({
                success: false,
                message: 'ID de tarea requerido'
            });
            return;
        }

        const task = await tasksService.getTaskById(taskId);

        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
            return;
        }

        if (task.userEmail !== userEmail) {
            res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar esta tarea'
            });
            return;
        }

        req.task = task;
        next();

    } catch (error) {
        console.error('Error en validateTaskOwner:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};