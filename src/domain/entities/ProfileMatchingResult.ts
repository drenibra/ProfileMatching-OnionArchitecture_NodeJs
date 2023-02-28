import mongoose, { Schema } from 'mongoose';

const profileMatchingResultSchema = new mongoose.Schema({
  result: {
    type: Number,
    required: true,
  },
  application: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
  },
});
