import { Document } from 'mongoose';

export interface User extends Document {
  userName: string;
  firstName: string;
  attachedUsers: [object];
  emailContact: string;
  lastName: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string, userPass: string): any;

}
