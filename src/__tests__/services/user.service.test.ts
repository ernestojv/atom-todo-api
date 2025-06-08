import { UserService } from '../../services/user.service';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../models/user.model';
import { CreateUserDto } from '../../dto/user.dto';

jest.mock('../../repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUser: User;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    (userService as any).userRepository = mockUserRepository;

    mockUser = {
      id: 'user123',
      email: 'test@example.com',
      createdAt: new Date(),
      isActive: true
    };
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.getUserByEmail('notfound@example.com'))
        .rejects.toThrow();
    });

    it('should validate email format', async () => {
      await expect(userService.getUserByEmail('invalid-email'))
        .rejects.toThrow();
    });

    it('should handle empty email', async () => {
      await expect(userService.getUserByEmail(''))
        .rejects.toThrow();
    });
  });

  describe('checkUserExists', () => {
    it('should return true when user exists', async () => {
      mockUserRepository.emailExists.mockResolvedValue(true);

      const result = await userService.checkUserExists('test@example.com');

      expect(result).toBe(true);
      expect(mockUserRepository.emailExists).toHaveBeenCalledWith('test@example.com');
    });

    it('should return false when user does not exist', async () => {
      mockUserRepository.emailExists.mockResolvedValue(false);

      const result = await userService.checkUserExists('notfound@example.com');

      expect(result).toBe(false);
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com'
    };

    it('should create user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.createUser(createUserDto))
        .rejects.toThrow();
    });

    it('should validate email format', async () => {
      const invalidDto = { email: 'invalid-email' };

      await expect(userService.createUser(invalidDto))
        .rejects.toThrow();
    });

    it('should normalize email to lowercase', async () => {
      const upperCaseDto = { email: 'TEST@EXAMPLE.COM' };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      await userService.createUser(upperCaseDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com'
        })
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, email: 'updated@example.com' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser('user123', { 
        email: 'updated@example.com' 
      });

      expect(result).toEqual(updatedUser);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.updateUser('nonexistent', { email: 'test@example.com' }))
        .rejects.toThrow();
    });

    it('should throw error if email already in use by another user', async () => {
      const anotherUser = { ...mockUser, id: 'another123' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.emailExists.mockResolvedValue(true);
      mockUserRepository.findByEmail.mockResolvedValue(anotherUser);

      await expect(userService.updateUser('user123', { 
        email: 'taken@example.com' 
      })).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete user and their tasks successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.deleteUserTasks.mockResolvedValue(5);
      mockUserRepository.delete.mockResolvedValue(true);

      await userService.deleteUser('user123');

      expect(mockUserRepository.deleteUserTasks).toHaveBeenCalledWith(mockUser.email);
      expect(mockUserRepository.delete).toHaveBeenCalledWith('user123');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.deleteUser('nonexistent'))
        .rejects.toThrow();
    });
  });
});