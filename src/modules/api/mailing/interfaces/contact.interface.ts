import { Document } from 'mongoose';

export interface Contact extends Document {
  email: string;
}
