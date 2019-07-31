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
const group_schema_1 = require("./schemas/group.schema");
const evaluation_schema_1 = require("../evaluation/schemas/evaluation.schema");
let GroupsService = class GroupsService {
    constructor(groupModel, evalModel) {
        this.groupModel = groupModel;
        this.evalModel = evalModel;
    }
    getGroupsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.groupModel.find({ company: id }).populate('tests Test profiles Profile evaluations Evaluation').exec();
        });
    }
    addProfileToGroup(idProfile, idGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.groupModel.findByIdAndUpdate(idGroup, { $push: { profiles: idProfile } }).exec();
        });
    }
    addTestToGroup(idTest, idGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.groupModel.findByIdAndUpdate(idGroup, { $push: { tests: idTest } }).exec();
        });
    }
    createEvalInGroup(evaluation, idGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.groupModel.findByIdAndUpdate(idGroup, { $push: { tests: idTest } }).exec();
        });
    }
};
GroupsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(group_schema_1.GroupSchema)),
    __param(1, mongoose_2.InjectModel(evaluation_schema_1.EvaluationSchema)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], GroupsService);
exports.GroupsService = GroupsService;
//# sourceMappingURL=group.service.js.map