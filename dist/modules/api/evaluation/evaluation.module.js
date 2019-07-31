"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const evaluation_controller_1 = require("./evaluation.controller");
const evaluation_service_1 = require("./evaluation.service");
const evaluation_schema_1 = require("./schemas/evaluation.schema");
const test_schema_1 = require("./schemas/test.schema");
const profile_schema_1 = require("../profiles/schemas/profile.schema");
const pool_schema_1 = require("../pools/schemas/pool.schema");
const company_schema_1 = require("../companies/schemas/company.schema");
let EvaluationModule = class EvaluationModule {
};
EvaluationModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Evaluation', schema: evaluation_schema_1.EvaluationSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Test', schema: test_schema_1.TestSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Profile', schema: profile_schema_1.ProfileSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Pool', schema: pool_schema_1.PoolSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Company', schema: company_schema_1.CompanySchema }]),
        ],
        controllers: [evaluation_controller_1.EvaluationController],
        providers: [evaluation_service_1.EvaluationService],
    })
], EvaluationModule);
exports.EvaluationModule = EvaluationModule;
//# sourceMappingURL=evaluation.module.js.map