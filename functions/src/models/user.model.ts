export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export interface CreateUserData {
  email: string;
  createdAt?: Date;
  isActive?: boolean;
}

export interface UpdateUserData {
  email?: string;
  isActive?: boolean;
  updatedAt?: Date;
}