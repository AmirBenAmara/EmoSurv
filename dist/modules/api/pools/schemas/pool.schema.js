"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.poolSchema = new mongoose_1.Schema({
    title: String,
    uniqueName: { type: String, lowercase: true, unique: true, index: true },
    description: String,
    startDate: { type: Date, default: null },
    endDate: { type: Date, min: Date.now() },
    attended: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],
    profiles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],
    registred: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],
    Coach: String,
    Nhours: Number,
    NSofthours: Number,
});
exports.PoolSchema = exports.poolSchema;
//# sourceMappingURL=pool.schema.js.map