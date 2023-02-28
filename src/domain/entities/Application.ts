import mongoose, { Schema } from 'mongoose';

const applicationSchema = new mongoose.Schema({
  dateApplied: {
    type: Date,
    required: true,
  },
  jobPosition: {
    type: Schema.Types.ObjectId,
    ref: 'JobPosition',
    required: true,
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'Applicant',
  },
});
