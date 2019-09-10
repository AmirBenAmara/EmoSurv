import { Document } from 'mongoose';

export interface Link extends Document {
  readonly url: string;
  readonly openedTimes: number;
  
}
