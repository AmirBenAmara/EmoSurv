import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';

export const groupSchema: Schema = new Schema({
  title: String,
  createdDate: { type: Date, min: Date.now() },
  profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
  evaluations : [{ type: Schema.Types.ObjectId, ref: 'Evaluation' }],
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
});

export const GroupSchema = groupSchema;
