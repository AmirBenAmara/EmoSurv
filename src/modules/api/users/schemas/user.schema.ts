import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';
import { User } from '../interfaces/user.interface';

export const userSchema: Schema = new Schema({
  userId : String,
  typeWith: String,
  typistType: String,
  pcTimeAverage: String,
  ageRange : String,
  gender : String,
  status :String,
  degree :String,
  country : String
 
});



export const UserSchema = userSchema;
