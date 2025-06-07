import { User } from '../models/user.model';

export interface LoginDto {
  email: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: string;
  };
  message: string;
  timestamp: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
}