"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.groupSchema = new mongoose_1.Schema({
    title: String,
    createdDate: { type: Date, min: Date.now() },
    profiles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],
    tests: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Test' }],
    evaluations: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Evaluation' }],
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
});
exports.GroupSchema = exports.groupSchema;
//# sourceMappingURL=group.schema.js.map