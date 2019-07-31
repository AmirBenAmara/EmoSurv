import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';
import { User } from '../interfaces/user.interface';

export const userSchema: Schema = new Schema({
  userName: { type: String, unique: true },
  firstName: String,
  lastName: String,
  emailContact: String,
  password: { type: String, required: true },
  attachedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  role: { type: String, enum: ['manager', 'RH', 'company', 'profile', 'admin', 'tech'], default: 'company', required: true },
  accountStatus: {type: String, enum: ['Activated', 'Not Activated'], default: 'Not Activated'},
  company: {type : Schema.Types.ObjectId, ref: 'Company'},
});

userSchema.pre('save', function(next) {
  const user = this;

  const SALT_WORK_FACTOR = 10;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) { return next(); }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) { return next(err); }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, (errr, hash) => {
      if (err) { return next(errr); }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = (candidatePassword: string, userPass: string, cb) => {
  return bcrypt.compareSync(candidatePassword, userPass);
};

export const UserSchema = userSchema;
