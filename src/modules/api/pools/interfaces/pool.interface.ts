import { Document } from 'mongoose';
import { Profile } from '../../profiles/interfaces/profile.interface';

export interface Pool extends Document {
  readonly title: string;
  readonly uniqueName: string;
  readonly description: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly attended: [object];
  readonly profiles: [object];
  readonly registred: [object];
  readonly Coach: string;
  readonly Nhours: number;
  readonly NSofthours: number;

  // comparePassword(candidatePassword: string, userPass: string): any;

}
