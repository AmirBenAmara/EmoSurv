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
const mailing_controller_1 = require("./mailing.controller");
const mailing_service_1 = require("./mailing.service");
const campaign_schema_1 = require("./schemas/campaign.schema");
const template_schema_1 = require("./schemas/template.schema");
const message_schema_1 = require("./schemas/message.schema");
let MailingModule = class MailingModule {
};
MailingModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Campaign', schema: campaign_schema_1.CampaignSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Template', schema: template_schema_1.TemplateSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Message', schema: message_schema_1.MessageSchema }]),
        ],
        controllers: [mailing_controller_1.MailingController],
        providers: [mailing_service_1.MailingService],
    })
], MailingModule);
exports.MailingModule = MailingModule;
//# sourceMappingURL=mailing.module.js.map