"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
class AbstractStrategy {
}
exports.AbstractStrategy = AbstractStrategy;
function PassportStrategy(Strategy) {
    class MixinStrategy extends Strategy {
        constructor(...args) {
            super(...args, (...params) => this.validate(...params));
            passport.use(this);
        }
    }
    return MixinStrategy;
}
exports.PassportStrategy = PassportStrategy;
//# sourceMappingURL=passport.strategy.js.map