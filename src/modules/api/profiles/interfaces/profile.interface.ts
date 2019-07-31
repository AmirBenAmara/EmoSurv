import { Document } from 'mongoose';
import { Pool } from '../../pools/interfaces/pool.interface';

export interface Profile extends Document {
  readonly name: string;
  readonly lastname: string;
  readonly email: string;
  readonly phone: number;
  readonly birthday: Date;
  readonly cinNumber: number;
  readonly cinPic: string;
  readonly cvFile: string;
  readonly cvData: string;
  readonly picFile: string;
  readonly socials: [object];
  readonly pools: [Pool];
  readonly experiences: [object];
  readonly skills: [string];
  readonly jobState: string;
  createdDate: number;
}
