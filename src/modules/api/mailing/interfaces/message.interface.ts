import { Document } from 'mongoose';

export interface Message extends Document {
  readonly campaign: object;
  readonly template: object;
  readonly owner: object;
  readonly subject: string;
  readonly EmailTo: string;
  readonly content: string;
  readonly fromEmail: string;
  readonly fromName: string;
  readonly replyToName: string;
  readonly replyToEmail: string;
  readonly opened: boolean;
  readonly openedTimes: [string];
  readonly sendDate: string;
}
