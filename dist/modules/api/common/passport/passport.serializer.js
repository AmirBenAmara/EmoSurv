"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
class PassportSerializer {
    constructor() {
        passport.serializeUser((user, done) => this.serializeUser(user, done));
        passport.deserializeUser((payload, done) => this.deserializeUser(payload, done));
    }
}
exports.PassportSerializer = PassportSerializer;
//# sourceMappingURL=passport.serializer.js.map