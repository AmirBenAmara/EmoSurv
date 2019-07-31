"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    name: String,
    email: { type: String, required: true, index: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['manager', 'coach', 'company', 'profile'], required: true },
    userStatus: { type: String, enum: ['Activated', 'Not Activated'], default: 'Not Activated' },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
});
exports.userSchema.pre('save', function (next) {
    const user = this;
    const SALT_WORK_FACTOR = 10;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (errr, hash) => {
            if (err) {
                return next(errr);
            }
            user.password = hash;
            next();
        });
    });
});
exports.userSchema.methods.comparePassword = (candidatePassword, userPass, cb) => {
    return bcrypt.compareSync(candidatePassword, userPass);
};
exports.UserSchema = exports.userSchema;
//# sourceMappingURL=user.schema.js.map