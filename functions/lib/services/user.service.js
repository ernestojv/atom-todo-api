"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../utils/errors");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async getUserByEmail(email) {
        this.validateEmail(email);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw errors_1.AppErrors.userNotFound(email);
        }
        return user;
    }
    async getUserById(id) {
        this.validateUserId(id);
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw errors_1.AppErrors.userNotFoundById(id);
        }
        return user;
    }
    async checkUserExists(email) {
        this.validateEmail(email);
        return await this.userRepository.emailExists(email);
    }
    async createUser(userDto) {
        this.validateEmail(userDto.email);
        const existingUser = await this.userRepository.findByEmail(userDto.email);
        if (existingUser) {
            throw errors_1.AppErrors.userAlreadyExists(userDto.email);
        }
        const userData = {
            email: userDto.email.toLowerCase().trim(),
            createdAt: userDto.createdAt || new Date(),
            isActive: true
        };
        return await this.userRepository.create(userData);
    }
    async updateUser(id, updateDto) {
        this.validateUserId(id);
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw errors_1.AppErrors.userNotFoundById(id);
        }
        if (updateDto.email) {
            this.validateEmail(updateDto.email);
            const emailExists = await this.userRepository.emailExists(updateDto.email);
            if (emailExists) {
                const userWithEmail = await this.userRepository.findByEmail(updateDto.email);
                if (userWithEmail && userWithEmail.id !== id) {
                    throw errors_1.AppErrors.emailAlreadyInUse(updateDto.email);
                }
            }
        }
        const updateData = Object.assign(Object.assign({}, updateDto), { updatedAt: new Date() });
        const updatedUser = await this.userRepository.update(id, updateData);
        if (!updatedUser) {
            throw errors_1.AppErrors.userNotFoundById(id);
        }
        return updatedUser;
    }
    async deleteUser(id) {
        this.validateUserId(id);
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw errors_1.AppErrors.userNotFoundById(id);
        }
        await this.userRepository.deleteUserTasks(existingUser.email);
        const deleted = await this.userRepository.delete(id);
        if (!deleted) {
            throw errors_1.AppErrors.userNotFoundById(id);
        }
    }
    async deactivateUser(id) {
        return await this.updateUser(id, { isActive: false });
    }
    async activateUser(id) {
        return await this.updateUser(id, { isActive: true });
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    async getUserStats() {
        const users = await this.userRepository.findAll();
        const totalUsers = await this.userRepository.countUsers();
        const activeUsers = users.filter(user => user.isActive).length;
        return {
            totalUsers,
            activeUsers
        };
    }
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw errors_1.AppErrors.requiredField('email');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw errors_1.AppErrors.invalidEmail();
        }
        if (email.length > 255) {
            throw errors_1.AppErrors.validationError('El email no puede exceder 255 caracteres');
        }
    }
    validateUserId(id) {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            throw errors_1.AppErrors.requiredField('id');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map