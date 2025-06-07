import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppErrors } from '../utils/errors';

export interface CustomJwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        // Validar que JWT_SECRET existe
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is required');
        }

        this.secret = process.env.JWT_SECRET;
        this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    generateToken(user: User): string {
        try {
            return jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                this.secret as jwt.Secret,
                {
                    expiresIn: this.expiresIn
                } as jwt.SignOptions
            );
        } catch (error) {
            console.error('Error generating JWT token:', error);
            throw AppErrors.jwtGenerationError();
        }
    }

  verifyToken(token: string): CustomJwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as CustomJwtPayload;
      return decoded;
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      
      if (error instanceof jwt.TokenExpiredError) {
        throw AppErrors.tokenExpired();
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        throw AppErrors.invalidToken();
      }
      
      throw AppErrors.tokenVerificationError();
    }
  }

    extractTokenFromHeader(authHeader: string | undefined): string {
        if (!authHeader) {
            throw AppErrors.missingToken();
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw AppErrors.invalidTokenFormat();
        }

        const token = authHeader.substring(7);

        if (!token) {
            throw AppErrors.missingToken();
        }

        return token;
    }

    getTokenInfo(token: string): CustomJwtPayload {
        return this.verifyToken(token);
    }
}