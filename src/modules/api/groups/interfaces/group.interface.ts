import { Document } from 'mongoose';

export interface Group extends Document {
  readonly title: string;
  readonly createdDate: Date;
  readonly tests: [object];
  readonly profiles: [object];
  readonly evaluations: [object];
  readonly company: object;

}
