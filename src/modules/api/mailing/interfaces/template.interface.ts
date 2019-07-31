import { Document } from 'mongoose';

export interface Template extends Document {
  owner: object;
  name: string;
  createdBy: object;
  content: string;
  createdDate: Date;
}
