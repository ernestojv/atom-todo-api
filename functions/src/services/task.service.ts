import { TaskRepository } from '../repositories/task.repository';
import { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '../models/task.model';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { AppErrors } from '../utils/errors';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getTasksByUser(userEmail: string, status?: TaskStatus): Promise<Task[]> {
    this.validateEmail(userEmail);
    
    const tasks = await this.taskRepository.findByUser(userEmail, status);
    
    return tasks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTaskById(id: string): Promise<Task> {
    this.validateTaskId(id);
    
    const task = await this.taskRepository.findById(id);
    
    if (!task) {
      throw AppErrors.taskNotFound(id);
    }
    
    return task;
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    this.validateTaskData(taskDto);
    
    const taskData: CreateTaskData = {
      title: taskDto.title.trim(),
      description: taskDto.description.trim(),
      userEmail: taskDto.userEmail.toLowerCase().trim(),
      status: taskDto.status || TaskStatus.TODO,
      createdAt: taskDto.createdAt || new Date()
    };

    return await this.taskRepository.create(taskData);
  }

  async updateTask(id: string, updateDto: UpdateTaskDto): Promise<Task> {
    this.validateTaskId(id);
    
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw AppErrors.taskNotFound(id);
    }

    if (updateDto.title !== undefined) {
      this.validateTitle(updateDto.title);
      updateDto.title = updateDto.title.trim();
    }
    
    if (updateDto.description !== undefined) {
      this.validateDescription(updateDto.description);
      updateDto.description = updateDto.description.trim();
    }

    if (updateDto.status !== undefined) {
      this.validateStatus(updateDto.status);
    }

    const updateData: UpdateTaskData = {
      ...updateDto,
      updatedAt: new Date()
    };

    const updatedTask = await this.taskRepository.update(id, updateData);
    
    if (!updatedTask) {
      throw AppErrors.taskNotFound(id);
    }
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    this.validateTaskId(id);
    
    const deleted = await this.taskRepository.delete(id);
    
    if (!deleted) {
      throw AppErrors.taskNotFound(id);
    }
  }

  async getTaskStats(userEmail: string): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    completionRate: number;
  }> {
    this.validateEmail(userEmail);
    
    const stats = await this.taskRepository.getTaskStatsByUser(userEmail);
    const completionRate = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

    return {
      ...stats,
      completionRate: Math.round(completionRate * 100) / 100
    };
  }

  async moveToInProgress(id: string): Promise<Task> {
    return await this.updateTask(id, { status: TaskStatus.IN_PROGRESS });
  }

  async markAsDone(id: string): Promise<Task> {
    return await this.updateTask(id, { status: TaskStatus.DONE });
  }

  async moveBackToTodo(id: string): Promise<Task> {
    return await this.updateTask(id, { status: TaskStatus.TODO });
  }

  private validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
      throw AppErrors.requiredField('userEmail');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw AppErrors.invalidEmail();
    }
  }

  private validateTaskId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw AppErrors.requiredField('id');
    }
  }

  private validateTaskData(taskData: CreateTaskDto): void {
    this.validateTitle(taskData.title);
    this.validateDescription(taskData.description);
    this.validateEmail(taskData.userEmail);
  }

  private validateTitle(title: string): void {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw AppErrors.requiredField('title');
    }
    
    if (title.length > 100) {
      throw AppErrors.validationError('El título no puede exceder 100 caracteres');
    }
  }

  private validateDescription(description: string): void {
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      throw AppErrors.requiredField('description');
    }
    
    if (description.length > 500) {
      throw AppErrors.validationError('La descripción no puede exceder 500 caracteres');
    }
  }

  private validateStatus(status: TaskStatus): void {
    if (!Object.values(TaskStatus).includes(status)) {
      throw AppErrors.validationError('Status inválido. Debe ser: todo, in_progress o done');
    }
  }
}