import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IUserModel } from '../../application/interfaces/IUserModel';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxLength: [30, 'The name must be less or equal to 30 characters'],
    minLength: [2, 'The name must be more or equal to 2 characters'],
    validate: [validator.isAlpha, 'User name must only contain letters!'],
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name'],
    trim: true,
    maxLength: [30, 'The last name must be less or equal to 30 characters'],
    minLength: [2, 'The last name must be more or equal to 2 characters'],
    validate: [validator.isAlpha, 'User last name must only contain letters!'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email should be in proper format'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['applicant', 'recruiter', 'admin'],
    default: 'applicant',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Only works on CREATE and SAVE!! E jo tek findOne dhe update
      validator: function (this: IUserModel, el: string) {
        return el === this.password;
      },
      message: 'Passwords do not match!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = '';
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model<IUserModel>('User', userSchema);

/* const testUser = new User({
  name: 'test',
  lastName: 'test',
  email: 'test2@hotmail.com',
  role: 'applicant',
  password: 'Pa$$w0rd',
  passwordConfirm: 'Pa$$w0rd',
});

testUser
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error!', err);
  });
 */
