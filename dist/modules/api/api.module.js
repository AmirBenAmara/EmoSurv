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
const users_module_1 = require("./users/users.module");
const pools_module_1 = require("./pools/pools.module");
const profiles_module_1 = require("./profiles/profiles.module");
const upload_module_1 = require("./upload/upload.module");
const evaluation_module_1 = require("./evaluation/evaluation.module");
const mailing_module_1 = require("./mailing/mailing.module");
const companies_module_1 = require("./companies/companies.module");
const group_module_1 = require("./groups/group.module");
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    common_1.Module({
        imports: [mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/nestdb'), users_module_1.UsersModule, group_module_1.GroupsModule, companies_module_1.CompaniesModule, pools_module_1.PoolsModule, profiles_module_1.ProfilesModule, upload_module_1.UploadModule, evaluation_module_1.EvaluationModule, mailing_module_1.MailingModule],
        controllers: [],
        providers: [],
    })
], ApiModule);
exports.ApiModule = ApiModule;
//# sourceMappingURL=api.module.js.map