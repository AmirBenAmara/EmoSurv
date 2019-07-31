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
const common_1 = require("@nestjs/common");
const mailing_service_1 = require("./mailing.service");
const logging_interceptor_1 = require("../common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("../common/interceptors/transform.interceptor");
let MailingController = class MailingController {
    constructor(mailingService) {
        this.mailingService = mailingService;
    }
    findAllCampaigns() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.findAllCampaigns();
        });
    }
    findAllTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.findAllTemplates();
        });
    }
    createCampaign(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.createCampaign(campaign);
        });
    }
    createTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.createTemplate(template);
        });
    }
    updateTemplate(template, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.updateTemplate(id, template);
        });
    }
    updateCampaign(campaign, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.updateCampaign(id, campaign);
        });
    }
    deleteTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.deleteTemplate(id);
        });
    }
    deleteCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailingService.deleteCampaign(id);
        });
    }
};
__decorate([
    common_1.Get('campaign'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "findAllCampaigns", null);
__decorate([
    common_1.Get('template'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "findAllTemplates", null);
__decorate([
    common_1.Post('campaign'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "createCampaign", null);
__decorate([
    common_1.Post('template'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "createTemplate", null);
__decorate([
    common_1.Put('template/:id'),
    __param(0, common_1.Body()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "updateTemplate", null);
__decorate([
    common_1.Put('campaign/:id'),
    __param(0, common_1.Body()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "updateCampaign", null);
__decorate([
    common_1.Delete('template/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "deleteTemplate", null);
__decorate([
    common_1.Delete('campaign/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailingController.prototype, "deleteCampaign", null);
MailingController = __decorate([
    common_1.Controller('api/mailing'),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [mailing_service_1.MailingService])
], MailingController);
exports.MailingController = MailingController;
//# sourceMappingURL=mailing.controller.js.map