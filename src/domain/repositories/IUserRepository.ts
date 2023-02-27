import { IUserModel } from '../../application/interfaces/IUserModel';
import { UserDTO } from '../enitities/UserDTO';

export interface IUserRepository {
  getAll(): Promise<UserDTO[]>;
  getById(id: string): Promise<IUserModel | null>;
  create(user: UserDTO): void;
  update(user: UserDTO): Promise<IUserModel | null>;
  delete(id: string): void;
}
