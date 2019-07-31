import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';
import { Pool } from '../interfaces/pool.interface';

export const poolSchema: Schema = new Schema({
  title: String,
  uniqueName: { type: String, lowercase: true, unique: true, index: true },
  description: String,
  startDate: { type: Date, default: null },
  //TODO: add created date
  endDate: { type: Date, min: Date.now() },
  attended: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  registred: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  Coach: String,
  Nhours: Number,
  NSofthours: Number,
});

export const PoolSchema = poolSchema;
