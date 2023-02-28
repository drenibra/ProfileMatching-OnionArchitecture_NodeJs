import { IUserService } from './../interfaces/IUserService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserDTO } from '../../domain/entities/DTOs/UserDTO';
import { Request, Response } from 'express';
import { IUserModel } from '../interfaces/IUserModel';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<UserDTO[]> {
    return this.userRepository.getAll();
  }

  async getUserById(id: string): Promise<IUserModel | null> {
    return this.userRepository.getById(id);
  }

  async createUser(user: UserDTO): Promise<void> {
    return this.userRepository.create(user);
  }

  async updateUser(user: UserDTO): Promise<IUserModel | null> {
    return this.userRepository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
