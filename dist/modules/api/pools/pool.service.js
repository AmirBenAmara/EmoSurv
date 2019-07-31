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
const pool_schema_1 = require("./schemas/pool.schema");
let PoolsService = class PoolsService {
    constructor(poolModel) {
        this.poolModel = poolModel;
    }
    create(pool) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPool = new this.poolModel(pool);
            return yield createdPool.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolModel.find().populate('profiles profile').exec();
        });
    }
    findAllLanding() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolModel.find({}, { title: 1, uniqueName: 1, startDate: 1, endDate: 1, Nhours: 1 }).exec();
        });
    }
    registerProfile(poolid, profileid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolModel.findOneAndUpdate({ _id: poolid }, { $push: { registred: profileid } }).exec();
        });
    }
    findByIdLanding(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolModel.findById({ _id: id }, { title: 1, uniqueName: 1, startDate: 1, endDate: 1, Nhours: 1 }).exec();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolModel.findById({ _id: id });
        });
    }
};
PoolsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(pool_schema_1.PoolSchema)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], PoolsService);
exports.PoolsService = PoolsService;
//# sourceMappingURL=pool.service.js.map