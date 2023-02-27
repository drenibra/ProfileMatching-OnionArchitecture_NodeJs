import express from 'express';
import { AuthController } from '../controllers/AuthController';

const authController = new AuthController();

export const authRoutes = express.Router();

authRoutes.post('/login', authController.login.bind(authController));
authRoutes.post('/signup', authController.signUp.bind(authController));
