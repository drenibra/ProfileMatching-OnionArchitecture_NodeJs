import { UserDTO } from '../../domain/entities/DTOs/UserDTO';
import { IUserModel } from './IUserModel';

export interface IUserService {
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: string): Promise<IUserModel | null>;
  createUser(user: UserDTO): void;
  updateUser(user: UserDTO): Promise<IUserModel | null>;
  deleteUser(id: string): void;
}
