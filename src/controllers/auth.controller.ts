import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { JwtService } from '../services/jwt.service';
import { LoginDto, LoginResponse } from '../dto/auth.dto';
import { AppErrors } from '../utils/errors';

export class AuthController {
  private userService: UserService;
  private jwtService: JwtService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email } = req.body as LoginDto;

    let user;

    try {
      user = await this.userService.getUserByEmail(email);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'output' in error &&
        typeof (error as any).output === 'object' &&
        (error as any).output !== null &&
        'statusCode' in (error as any).output &&
        (error as any).output.statusCode === 404
      ) {
        throw AppErrors.authenticationFailed();
      } else {
        throw error;
      }
    }

    if (!user.isActive) {
      throw AppErrors.authenticationFailed();
    }

    const token = this.jwtService.generateToken(user);

    const response: LoginResponse = {
      success: true,
      data: {
        user,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      },
      message: 'Inicio de sesión exitoso',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = this.jwtService.extractTokenFromHeader(authHeader);

    const payload = this.jwtService.verifyToken(token);

    const user = await this.userService.getUserById(payload.userId);

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        user,
        payload
      },
      timestamp: new Date().toISOString()
    });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = this.jwtService.extractTokenFromHeader(authHeader);

    const payload = this.jwtService.verifyToken(token);
    const user = await this.userService.getUserById(payload.userId);

    if (!user.isActive) {
      throw AppErrors.authenticationFailed();
    }

    const newToken = this.jwtService.generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user,
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      },
      message: 'Token renovado exitosamente',
      timestamp: new Date().toISOString()
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    // TODO: Implement logout logic and token invalidation
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      timestamp: new Date().toISOString()
    });
  }
}