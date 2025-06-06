import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto, GetTasksQueryDto, TaskParamsDto } from '../dto/task.dto';
import { TaskStatus } from '../models/task.model';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    const userEmail = typeof req.query.userEmail === 'string' ? req.query.userEmail : '';
    const status = typeof req.query.status === 'string' ? req.query.status as TaskStatus : undefined;
    
    const tasks = await this.taskService.getTasksByUser(userEmail, status);
    
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
      filter: status ? { status } : 'all',
      timestamp: new Date().toISOString()
    });
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    
    const task = await this.taskService.getTaskById(id);
    
    res.status(200).json({
      success: true,
      data: task,
      timestamp: new Date().toISOString()
    });
  }

  async createTask(req: Request, res: Response): Promise<void> {
    const taskData = req.body as CreateTaskDto;
    
    const newTask = await this.taskService.createTask(taskData);
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Tarea creada exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const updateData = req.body as UpdateTaskDto;
    
    const updatedTask = await this.taskService.updateTask(id, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Tarea actualizada exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    
    await this.taskService.deleteTask(id);
    
    res.status(200).json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async getTaskStats(req: Request, res: Response): Promise<void> {
    const userEmail = typeof req.query.userEmail === 'string' ? req.query.userEmail : '';
    
    const stats = await this.taskService.getTaskStats(userEmail);
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  }

  async moveToInProgress(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    
    const updatedTask = await this.taskService.moveToInProgress(id);
    
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Tarea movida a En Progreso',
      timestamp: new Date().toISOString()
    });
  }

  async markAsDone(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    
    const updatedTask = await this.taskService.markAsDone(id);
    
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Tarea marcada como Completada',
      timestamp: new Date().toISOString()
    });
  }

  async moveBackToTodo(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    
    const updatedTask = await this.taskService.moveBackToTodo(id);
    
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Tarea movida a Por Hacer',
      timestamp: new Date().toISOString()
    });
  }
}