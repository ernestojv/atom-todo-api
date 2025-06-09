import { UserRepository } from '../repositories/user.repository';
import { User, CreateUserData, UpdateUserData } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { AppErrors } from '../utils/errors';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserByEmail(email: string): Promise<User> {
    this.validateEmail(email);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw AppErrors.userNotFound(email);
    }

    return user;
  }

  async getUserById(id: string): Promise<User> {
    this.validateUserId(id);

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw AppErrors.userNotFoundById(id);
    }

    return user;
  }

  async checkUserExists(email: string): Promise<boolean> {
    this.validateEmail(email);

    return await this.userRepository.emailExists(email);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    this.validateEmail(userDto.email);

    const existingUser = await this.userRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw AppErrors.userAlreadyExists(userDto.email);
    }

    const userData: CreateUserData = {
      email: userDto.email.toLowerCase().trim(),
      createdAt: userDto.createdAt || new Date(),
      isActive: true
    };

    return await this.userRepository.create(userData);
  }

  async updateUser(id: string, updateDto: UpdateUserDto): Promise<User> {
    this.validateUserId(id);

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw AppErrors.userNotFoundById(id);
    }

    if (updateDto.email) {
      this.validateEmail(updateDto.email);
      
      const emailExists = await this.userRepository.emailExists(updateDto.email);
      if (emailExists) {
        const userWithEmail = await this.userRepository.findByEmail(updateDto.email);
        if (userWithEmail && userWithEmail.id !== id) {
          throw AppErrors.emailAlreadyInUse(updateDto.email);
        }
      }
    }

    const updateData: UpdateUserData = {
      ...updateDto,
      updatedAt: new Date()
    };

    const updatedUser = await this.userRepository.update(id, updateData);

    if (!updatedUser) {
      throw AppErrors.userNotFoundById(id);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    this.validateUserId(id);

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw AppErrors.userNotFoundById(id);
    }

    await this.userRepository.deleteUserTasks(existingUser.email);

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw AppErrors.userNotFoundById(id);
    }
  }

  async deactivateUser(id: string): Promise<User> {
    return await this.updateUser(id, { isActive: false });
  }

  async activateUser(id: string): Promise<User> {
    return await this.updateUser(id, { isActive: true });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
  }> {
    const users = await this.userRepository.findAll();
    const totalUsers = await this.userRepository.countUsers();
    const activeUsers = users.filter(user => user.isActive).length;

    return {
      totalUsers,
      activeUsers
    };
  }

  private validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
      throw AppErrors.requiredField('email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw AppErrors.invalidEmail();
    }

    if (email.length > 255) {
      throw AppErrors.validationError('El email no puede exceder 255 caracteres');
    }
  }

  private validateUserId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw AppErrors.requiredField('id');
    }
  }
}