import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../../../application/interfaces/IUserService';
import { UserDTO } from '../../../domain/enitities/UserDTO';
import { User } from '../../../domain/enitities/UserModel';
import { catchAsync } from '../utils/catchAsync';

export class UserController {
  constructor(private userService: IUserService) {}

  public getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = await this.userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  });

  public getUserById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    if (user) {
      res.status(200).json({
        status: 'success',
        user,
      });
    } else {
      res.status(404).send();
    }
  });

  async createUser(req: Request, res: Response): Promise<void> {
    const user = req.body as UserDTO;
    await this.userService.createUser(user);
    res.status(201).send();
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = req.body as UserDTO;
    user.id = id;
    await this.userService.updateUser(user);
    res.status(204).send();
  }

  public deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    res.status(204).send();
  });
}
