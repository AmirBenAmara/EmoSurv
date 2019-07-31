"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.evaluationSchema = new mongoose_1.Schema({
    language: String,
    text: String,
    submitDate: Number,
    startedDate: Number,
    createdDate: Number,
    outOfTab: Number,
    consoleOutput: String,
    testOutput: String,
    resultCode: String,
    resultPercent: Number,
    correctAnswers: Number,
    ProfileAnswers: Object,
    correctCode: [String],
    timeOutOfTabPerQuestion: Object,
    timeSpentPerQuestion: Object,
    profileTotalAnswers: Number,
    candidateDescription: String,
    link_github: [String],
    algo: [{ exercice: String, resultCandidate: { type: String, default: '' } }],
    uuid: String,
    status: { type: String, enum: ['not started', 'started', 'finished'] },
    profile: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile', required: true },
    pool: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Pool' },
    test: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Test', required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    companySchema: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
});
exports.EvaluationSchema = exports.evaluationSchema;
//# sourceMappingURL=evaluation.schema.js.map