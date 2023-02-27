import { Request, Response, NextFunction } from 'express';
import { User } from './../../../domain/enitities/UserModel';
import { catchAsync } from './../utils/catchAsync';
import { AppError } from './../utils/AppError';
import jwt from 'jsonwebtoken';
import { IUserModel } from '../../../application/interfaces/IUserModel';

interface JwtPayload {
  id: string;
  iat: number;
}

interface IRequest extends Request {
  user?: IUserModel;
}

export class AuthController {
  protected signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
  public signUp = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, lastName, email, photo, role, password, passwordConfirm } = req.body;

    console.log(req.body);

    const newUser = await User.create({
      name,
      lastName,
      email,
      photo,
      role: 'applicant',
      password,
      passwordConfirm,
    });

    const token = this.signToken(newUser._id.toString());

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  });

  public login = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide an email and password!', 400));
    }

    const user: IUserModel | null = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is ok, send token to client
    const token = this.signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  });

  private jwtVerifyPromisified = (token: string, secret: string) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, {}, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    });
  };

  public protected = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access!', 401));
    }

    // 2) Verification token
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const decoded = (await this.jwtVerifyPromisified(token, process.env.JWT_SECRET || '')) as JwtPayload;

    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new AppError('The user belonging to this token does no longer exists', 401));
    }

    // 4) Check if user changed password after the token was issued
    freshUser.changedPasswordAfter(decoded.iat);
    console.log(decoded.iat);
    if (await freshUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
  });

  public restrictTo = (...roles: string[]) => {
    return (req: IRequest, res: Response, next: NextFunction) => {
      // roles is an array ['applicant', 'recruiter']. role='applicant'
      if (!roles.includes(req.user?.role || '')) {
        return next(new AppError('You do not have permission to perform this action', 403));
      }
      next();
    };
  };
}
