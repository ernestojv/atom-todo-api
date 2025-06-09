import { JwtService } from '../../src/services/jwt.service';
import { User } from '../../src/models/user.model';

describe('JwtService', () => {
  let jwtService: JwtService;
  let mockUser: User;

  beforeEach(() => {
    jwtService = new JwtService();
    mockUser = {
      id: 'user123',
      email: 'test@example.com',
      createdAt: new Date(),
      isActive: true
    };
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = jwtService.generateToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include user data in token payload', () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);

      expect(payload.userId).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload.userId).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        jwtService.verifyToken('invalid-token');
      }).toThrow();
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        jwtService.verifyToken('malformed.token');
      }).toThrow();
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'valid-token-123';
      const header = `Bearer ${token}`;

      const extractedToken = jwtService.extractTokenFromHeader(header);

      expect(extractedToken).toBe(token);
    });

    it('should throw error for missing header', () => {
      expect(() => {
        jwtService.extractTokenFromHeader(undefined);
      }).toThrow();
    });

    it('should throw error for invalid header format', () => {
      expect(() => {
        jwtService.extractTokenFromHeader('Invalid token-123');
      }).toThrow();
    });

    it('should throw error for empty token after Bearer', () => {
      expect(() => {
        jwtService.extractTokenFromHeader('Bearer ');
      }).toThrow();
    });
  });
});