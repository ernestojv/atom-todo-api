"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async checkUserExists(req, res) {
        const email = typeof req.query.email === 'string' ? req.query.email : '';
        const exists = await this.userService.checkUserExists(email);
        res.status(200).json({
            success: true,
            data: { exists },
            timestamp: new Date().toISOString()
        });
    }
    async getUserByEmail(req, res) {
        const emailParam = req.params['email'];
        const decodedEmail = decodeURIComponent(emailParam);
        const user = await this.userService.getUserByEmail(decodedEmail);
        res.status(200).json({
            success: true,
            data: user,
            timestamp: new Date().toISOString()
        });
    }
    async getUserById(req, res) {
        const id = req.params.id;
        const user = await this.userService.getUserById(id);
        res.status(200).json({
            success: true,
            data: user,
            timestamp: new Date().toISOString()
        });
    }
    async createUser(req, res) {
        const userData = req.body;
        const newUser = await this.userService.createUser(userData);
        res.status(201).json({
            success: true,
            data: newUser,
            message: 'Usuario creado exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async updateUser(req, res) {
        const id = req.params.id;
        const updateData = req.body;
        const updatedUser = await this.userService.updateUser(id, updateData);
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Usuario actualizado exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        await this.userService.deleteUser(id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async deactivateUser(req, res) {
        const id = req.params.id;
        const user = await this.userService.deactivateUser(id);
        res.status(200).json({
            success: true,
            data: user,
            message: 'Usuario desactivado exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async activateUser(req, res) {
        const id = req.params.id;
        const user = await this.userService.activateUser(id);
        res.status(200).json({
            success: true,
            data: user,
            message: 'Usuario activado exitosamente',
            timestamp: new Date().toISOString()
        });
    }
    async getAllUsers(req, res) {
        const users = await this.userService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
            count: users.length,
            timestamp: new Date().toISOString()
        });
    }
    async getUserStats(req, res) {
        const stats = await this.userService.getUserStats();
        res.status(200).json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map