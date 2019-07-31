import { Schema } from 'mongoose';

export const templateSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Company' },
  name: {type: String, unique: false},
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdDate: { type: Date, default: Date.now() },
});

export const TemplateSchema = templateSchema;