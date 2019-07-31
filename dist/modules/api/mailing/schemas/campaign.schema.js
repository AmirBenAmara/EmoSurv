"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.campaignSchema = new mongoose_1.Schema({
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' }],
    template: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template' },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    name: String,
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
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
exports.CampaignSchema = exports.campaignSchema;
//# sourceMappingURL=campaign.schema.js.map