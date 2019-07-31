"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.companySchema = new mongoose_1.Schema({
    name: String,
    email: { type: String, lowercase: true, unique: true, index: true },
    phone: String,
    address: { country: String, city: String, address: String },
    foundYear: String,
    size: { type: String, enum: ['[1..9]', '[10..99]', '[100..999]', '+1000'] },
    website: String,
    socials: { facebook: String, linkedin: String, github: String, twitter: String },
    Requests: [{
            reqDate: String, skillsSet: [String],
            experienceYears: Number, mission: String,
            jobLocation: String, worktime: { type: String, enum: ['Full', 'Half'] },
        }],
    profiles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],
});
exports.CompanySchema = exports.companySchema;
//# sourceMappingURL=company.schema.js.map