"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = new this.userModel(user);
            return yield createdUser.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.find().exec();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findById({ _id: id });
        });
    }
    findUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.userModel.findOne({ email: user.email }).exec();
            if (!res) {
                return { message: 'User not found' };
            }
            const res2 = yield res.comparePassword(user.password, res.password);
            if (!res2) {
                return { message: 'Wrong Password' };
            }
            return this.createToken(res);
        });
    }
    createToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const expiresIn = 3600;
            return {
                message: 'OK',
                accessToken: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, 'secretKey'),
            };
        });
    }
    updatePassword(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.userModel.findOne({ email: obj.email }).exec();
            if (!res) {
                return { message: 'User not found' };
            }
            const test = yield res.comparePassword(obj.oldPassword, res.password);
            if (test) {
                res.password = yield bcrypt.hashSync(obj.newPassword, 10);
                const res2 = yield this.userModel.findByIdAndUpdate({ _id: res._id }, { $set: res });
                return this.createToken(res);
            }
            else {
                return { message: 'your password is wrong' };
            }
        });
    }
    validateUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findOne({ email: payload.data.email, pass: payload.data.pass }).exec();
        });
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(user_schema_1.UserSchema)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=user.service.js.map