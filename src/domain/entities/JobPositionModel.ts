import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import validator from 'validator';

const jobPositionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A job position must have a title'],
    trim: true,
    maxLength: [30, 'The job position title must be less or equal to 30 characters'],
    minLength: [2, 'The job position title must be more or equal to 2 characters'],
    validate: [validator.isAlpha, 'Company title must only contain letters!'],
  },
  description: {
    type: String,
    required: [true, 'A job position must have a description'],
    trim: true,
    maxLength: [1000, 'The job position description must be less or equal to 1000 characters'],
    minLength: [10, 'The job position description must be more or equal to 10 characters'],
    validate: [validator.isAlpha, 'Company description must only contain letters!'],
  },
  skillSet: {
    type: String,
    required: [true, 'A job position must have a skillset'],
    trim: true,
    maxLength: [300, 'The job position skillset must be less or equal to 300 characters'],
    minLength: [10, 'The job position skillset must be more or equal to 10 characters'],
    validate: [validator.isAlpha, 'Company skillset must only contain letters!'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  applications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
  createdAt: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: [true, 'A job position must have an expiry date'],
    validate: {
      validator: function (this, el: Date) {
        return el > this.createdAt;
      },
      message: 'Expiry date must be after createdAt date!',
    },
  },
});
export const JobPosition = mongoose.model('JobPosition', jobPositionSchema);
