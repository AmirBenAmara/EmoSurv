import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';
import { Request } from '@nestjs/common';
import { companySchema } from '../../companies/schemas/company.schema';

export const evaluationSchema: Schema = new Schema({
  language: String,
  text: String,
  submitDate: Number,
  startedDate: Number,
  createdDate: Number,
  outOfTab: Number,
  consoleOutput: String,
  testOutput: String,
  resultCode: String,
  resultPercent: Number,
  correctAnswers: Number,
  ProfileAnswers: Object,
  correctCode: [String],
  timeOutOfTabPerQuestion: Object,
  timeSpentPerQuestion: Object,
  profileTotalAnswers: Number,
  candidateDescription: String,
  link_github: [String],
  algo: [{exercice: String, resultCandidate: {type: String, default: ''}}],
  uuid: String,
  status: { type: String, enum: ['not started', 'started', 'finished'] },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  pool: { type: Schema.Types.ObjectId, ref: 'Pool' },
  test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  companySchema: { type: Schema.Types.ObjectId, ref: 'Company' },
});

export const EvaluationSchema = evaluationSchema;