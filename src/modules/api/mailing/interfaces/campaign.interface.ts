import { Document } from 'mongoose';

export interface Campaign extends Document {

  readonly messages: [object];
  readonly template: object;
  readonly owner: object;
  readonly name: string;
  readonly createdBy: object;
  readonly links: [object];
  readonly subject: string;
  readonly fromName: string;
  readonly fromEmail: string;
  readonly replyToName: string;
  readonly replyToEmail: string;
  readonly sendMode: string;
  readonly trackOpen: boolean;
  readonly trackClick: boolean;
  readonly status: string;
}
