import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async checkUserExists(req: Request, res: Response): Promise<void> {
    const email = typeof req.query.email === 'string' ? req.query.email : '';

    const exists = await this.userService.checkUserExists(email);

    res.status(200).json({
      success: true,
      data: { exists },
      timestamp: new Date().toISOString()
    });
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    const emailParam = req.params['email'];
    const decodedEmail = decodeURIComponent(emailParam);

    const user = await this.userService.getUserByEmail(decodedEmail);

    res.status(200).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const user = await this.userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const userData = req.body as CreateUserDto;

    const newUser = await this.userService.createUser(userData);

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const updateData = req.body as UpdateUserDto;

    const updatedUser = await this.userService.updateUser(id, updateData);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await this.userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async deactivateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const user = await this.userService.deactivateUser(id);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Usuario desactivado exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async activateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const user = await this.userService.activateUser(id);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Usuario activado exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      timestamp: new Date().toISOString()
    });
  }

  async getUserStats(req: Request, res: Response): Promise<void> {
    const stats = await this.userService.getUserStats();

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  }
}