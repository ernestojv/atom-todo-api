export interface CreateUserDto {
  email: string;
  createdAt?: Date;
}

export interface UpdateUserDto {
  email?: string;
  isActive?: boolean;
}