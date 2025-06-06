export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress', 
  DONE = 'done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt?: Date;
  userEmail: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  userEmail: string;
  status?: TaskStatus;
  createdAt?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  updatedAt?: Date;
}