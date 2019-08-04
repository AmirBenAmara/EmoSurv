import { Schema } from 'mongoose';

export const messageSchema: Schema = new Schema({
  campaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  template: { type: Schema.Types.ObjectId, ref: 'Template' },
  owner: { type: Schema.Types.ObjectId, ref: 'Company' },
  subject: String,
  EmailTo: String,
  content: String,
  fromEmail: String,
  fromName: String,
  replyToName: String,
  replyToEmail: String,
  opened: { type: Boolean, default: false},
  openedTimes: [String],
  sendDate: String,
  createdDate: { type: Date, default: Date.now() },
  uuid : String,

});

export const MessageSchema = messageSchema;