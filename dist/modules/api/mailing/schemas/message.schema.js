"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.messageSchema = new mongoose_1.Schema({
    campaign: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Campaign' },
    template: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template' },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    subject: String,
    EmailTo: String,
    content: String,
    fromEmail: String,
    fromName: String,
    replyToName: String,
    replyToEmail: String,
    opened: Boolean,
    openedTimes: [String],
    sendDate: String,
    createdDate: { type: Date, default: Date.now() },
});
exports.MessageSchema = exports.messageSchema;
//# sourceMappingURL=message.schema.js.map