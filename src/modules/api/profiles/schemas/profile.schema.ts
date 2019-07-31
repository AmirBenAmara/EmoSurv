import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';

export const profileSchema: Schema = new Schema({
  name: String,
  lastname: String,
  email: { type: String, lowercase: true, unique: true, index: true},
  phone: Number,
  birthday: { type: Date, max: Date.now() },
  createdDate: Number,
  cinNumber: { type: Number, maxlength: 8},
  cinPic: String,
  cvFile: String,
  cvData: { type: String },
  picFile: { type: String },
  socials: { facebook: String, linkedin: String, github: String, twitter: String },
  pools: [{ type: Schema.Types.ObjectId, ref: 'Pool' }],
  experiences: [{
    organism: String, startDate: Date, endDate: Date,
    position: String, degree: String, mission: String,
    experienceType: { type: String, enum: ['Academic', 'Professional', 'Social'] },
  }],
  skills: [{ type: String }],
  jobState: { type: String, enum: ['Candidate', 'Hired', 'Not hired'], default: 'Candidate' },
});
// company name/ id, startdate, enddate, position, job mission,
// type : academic/pro, fac, start, end, diplome, section, levem,
profileSchema.index({ cvData: 'text' });

export const ProfileSchema = profileSchema;
