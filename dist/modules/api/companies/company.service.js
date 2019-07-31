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
const company_schema_1 = require("./schemas/company.schema");
let CompaniesService = class CompaniesService {
    constructor(companyModel) {
        this.companyModel = companyModel;
    }
    create(company) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdCompany = new this.companyModel(company);
            return yield createdCompany.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.find().exec();
        });
    }
    findAllAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.find().populate('profiles Profile').exec();
        });
    }
    findAllByCountry(countries) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.find({ 'address.country': countries }).exec();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.findById({ _id: id }).populate({ path: 'profiles' }).exec();
        });
    }
    updateOne(id, company) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.findByIdAndUpdate({ _id: id }, { $set: company }).exec();
        });
    }
};
CompaniesService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(company_schema_1.CompanySchema)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CompaniesService);
exports.CompaniesService = CompaniesService;
//# sourceMappingURL=company.service.js.map