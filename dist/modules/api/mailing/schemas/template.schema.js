"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.templateSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    name: { type: String, unique: false },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdDate: { type: Date, default: Date.now() },
});
exports.TemplateSchema = exports.templateSchema;
//# sourceMappingURL=template.schema.js.map