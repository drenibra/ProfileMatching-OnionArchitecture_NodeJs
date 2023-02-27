import { IUserModel } from '../application/interfaces/IUserModel';
import { UserDTO } from '../domain/enitities/UserDTO';
import { User } from '../domain/enitities/UserModel';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  async getAll(): Promise<UserDTO[]> {
    const users = await User.find({});
    return users.map((user: IUserModel) => ({
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo,
      role: user.role,
    }));
  }
  async getById(id: string): Promise<IUserModel | null> {
    return await User.findById(id);
  }
  create(user: UserDTO): void {
    console.log('test');
  }
  async update(user: UserDTO): Promise<IUserModel | null> {
    return await User.findOneAndUpdate({ id: user.id }, user);
  }
  async delete(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }
}
