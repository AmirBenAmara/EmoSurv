import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';

export const companySchema: Schema = new Schema({
  name: String,
  email: {type: String, unique: true},
  phone: String,
  newsLetter: Boolean,
  address: { country: String, city: String, address: String},
  foundYear: String,
  size: {type: String, enum: ['[1..9]', '[10..99]', '[100..999]', '+1000', 'none'], default: 'none'},
  website: String,
  socials: { facebook: String, linkedin: String, github: String, twitter: String },
  Requests: [{
    reqDate: String, skillsSet: [String],
    experienceYears: Number, mission: String,
    jobLocation: String, worktime: { type: String, enum: ['Full', 'Half'] },
  }],
  profiles: [{type: Schema.Types.ObjectId, ref: 'Profile' }],
  contacts: [{type: Schema.Types.ObjectId, ref: 'Contacts' }],
  templates: [{type: Schema.Types.ObjectId, ref: 'Template' }],
  campaigns: [{type: Schema.Types.ObjectId, ref: 'Campaign' }],
});

export const CompanySchema = companySchema;
