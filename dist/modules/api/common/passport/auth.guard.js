"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const common_1 = require("@nestjs/common");
const defaultOptions = {
    session: false,
    property: 'user',
};
function AuthGuard(type, role = [''], options = defaultOptions) {
    options = Object.assign({}, defaultOptions, options);
    const guard = common_1.mixin(class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const httpContext = context.switchToHttp();
                const [request, response] = [
                    httpContext.getRequest(),
                    httpContext.getResponse(),
                ];
                request[options.property || defaultOptions.property] = yield new Promise((resolve, reject) => passport.authenticate(type, options, (err, user, info) => {
                    if (role[0] !== '') {
                        if (role.indexOf(user.role)) {
                            return reject(err || new common_1.UnauthorizedException());
                        }
                    }
                    if (err || !user) {
                        return reject(err || new common_1.UnauthorizedException());
                    }
                    resolve(user);
                })(request, response, resolve));
                return true;
            });
        }
    });
    return guard;
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map