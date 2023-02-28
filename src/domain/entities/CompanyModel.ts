import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import validator from 'validator';

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, 'A company must have a name'],
    trim: true,
    maxLength: [30, 'The company name must be less or equal to 30 characters'],
    minLength: [2, 'The company name must be more or equal to 2 characters'],
    validate: [validator.isAlpha, 'Company name must only contain letters!'],
  },
  location: {
    type: String,
    required: [true, 'A company must have a location'],
    trim: true,
    maxLength: [80, 'The company location must be less or equal to 80 characters'],
    minLength: [2, 'The company location must be more or equal to 2 characters'],
    validate: [validator.isAlpha, 'Company name must only contain letters!'],
  },
  logo: String,
  jobPositions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'JobPosition',
    },
  ],
  recruiters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Recruiter',
    },
  ],
});
export const Company = mongoose.model('Company', companySchema);
