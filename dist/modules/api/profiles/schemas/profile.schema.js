"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.profileSchema = new mongoose_1.Schema({
    name: String,
    lastname: String,
    email: { type: String, lowercase: true, unique: true, index: true, required: true },
    phone: Number,
    birthday: { type: Date, max: Date.now() },
    createdDate: Number,
    cinNumber: { type: Number, maxlength: 8 },
    cinPic: String,
    cvFile: String,
    cvData: { type: String },
    picFile: { type: String },
    socials: { facebook: String, linkedin: String, github: String, twitter: String },
    pools: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Pool' }],
    experiences: [{
            organism: String, startDate: Date, endDate: Date,
            position: String, degree: String, mission: String,
            experienceType: { type: String, enum: ['Academic', 'Professional', 'Social'] },
        }],
    skills: [{ type: String }],
    jobState: { type: String, enum: ['Candidate', 'Hired', 'Not hired'], default: 'Candidate' },
});
exports.profileSchema.index({ cvData: 'text' });
exports.ProfileSchema = exports.profileSchema;
//# sourceMappingURL=profile.schema.js.map