import { TaskStatus } from '../models/task.model';

export interface CreateTaskDto {
  title: string;
  description: string;
  userEmail: string;
  status?: TaskStatus;
  createdAt?: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface GetTasksQueryDto {
  userEmail: string;
  status?: TaskStatus;
}

export interface TaskParamsDto {
  id: string;
}