import express from 'express';

import { UserService } from '../../../application/services/UserService';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../../repositories/UserRepository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);


export const userRoutes = express.Router();

userRoutes
  .route('/')
  .get(userController.getUsers.bind(userController))
  .post(userController.createUser.bind(userController));
userRoutes
  .route('/:id')
  .get(userController.getUserById.bind(userController))
  .post(userController.updateUser.bind(userController))
  .delete(userController.deleteUser.bind(userController));
