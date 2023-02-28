import mongoose from 'mongoose';
import validator from 'validator';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a title'],
    maxLength: [30, 'The category title must be less or equal to 30 characters'],
    minLength: [2, 'The category title must be more or equal to 2 characters'],
    validate: [validator.isAlpha, 'Category title must only contain letters!'],
  },
});
export const Category = mongoose.model('Category', categorySchema);
