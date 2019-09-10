
import { Schema } from 'mongoose';

export const campaignSchema: Schema = new Schema({
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  template: { type: Schema.Types.ObjectId, ref: 'Template' },
  owner: { type: Schema.Types.ObjectId, ref: 'Company' },
  links: [{ type: Schema.Types.ObjectId, ref: 'Link' }],
  name: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  fromName: String,
  fromEmail: String,
  replyToName: String,
  replyToEmail: String,
  sendMode: String,
  trackOpen: Boolean,
  trackClick: Boolean,
  status: { type: String, enum: ['draft', 'sent', 'scheduled'] },
  createdDate: { type: Date, default: Date.now() },
  sendDate: { type: String },

});

export const CampaignSchema = campaignSchema;