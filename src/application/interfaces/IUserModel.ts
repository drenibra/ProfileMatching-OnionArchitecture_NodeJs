import { Document } from 'mongoose';

export interface IUserModel extends Document {
  name: string;
  lastName: string;
  email: string;
  photo?: string;
  role: 'applicant' | 'recruiter' | 'admin';
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  correctPassword(psw: string, pswdCompare: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): Promise<boolean>;
}
