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
const campaign_schema_1 = require("./schemas/campaign.schema");
const template_schema_1 = require("./schemas/template.schema");
const nodemailer = require("nodemailer");
const smtpPool = require("nodemailer-smtp-pool");
const message_schema_1 = require("./schemas/message.schema");
let MailingService = class MailingService {
    constructor(campaignModel, templateModel, messageModel) {
        this.campaignModel = campaignModel;
        this.templateModel = templateModel;
        this.messageModel = messageModel;
    }
    createTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdTemplate = new this.templateModel(template);
            return yield createdTemplate.save();
        });
    }
    updateTemplate(id, template) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.templateModel.findByIdAndUpdate({ _id: id }, { $set: template }).exec();
        });
    }
    createCampaign(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.templateModel.findById(campaign.template).exec();
            const messages = [];
            campaign['messages'] = [];
            yield campaign.emails.forEach((email) => __awaiter(this, void 0, void 0, function* () {
                const message = {
                    template: template['_id'], subject: campaign.subject, EmailTo: email, content: template['content'], fromEmail: campaign['fromEmail'],
                    fromName: campaign['fromName'], replyToName: campaign['replyToName'], replyToEmail: campaign['replyToEmail'], sendDate: Date.now().toString(),
                };
                messages.push(message);
            }));
            campaign['sendDate'] = Date.now().toString();
            campaign['status'] = 'sent';
            const createdCampaign = new this.campaignModel(campaign);
            const result = yield createdCampaign.save();
            this.sendmail(messages, result['_id']);
            return result;
        });
    }
    findAllCampaigns() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.campaignModel.find().populate('messages Message').populate('createdBy User').populate('template Template').exec();
        });
    }
    findAllTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.templateModel.find().exec();
        });
    }
    updateCampaign(id, campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.campaignModel.findOneAndUpdate({ _id: id }, { $set: campaign }).exec();
        });
    }
    deleteTemplate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.templateModel.remove({ _id: id }).exec();
        });
    }
    deleteCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.campaignModel.findById(id).exec();
            if (result.status === 'draft' || result.status === 'scheduled') {
                return yield this.campaignModel.remove({ _id: id }).exec();
            }
            return { message: 'cannot delete' };
        });
    }
    sendmail(msgs, idCampaign) {
        return __awaiter(this, void 0, void 0, function* () {
            const smtpMyMailConfig = smtpPool({
                host: 'chehir.tn',
                port: 465,
                secure: true,
                auth: {
                    user: 'fivep@chehir.tn',
                    pass: 'Aaaa0000',
                },
                maxConnections: 5,
                maxMessages: 10,
                rateLimit: 5,
            });
            this.transporter = yield nodemailer.createTransport(smtpMyMailConfig, {
                pool: true,
            });
            const messages = [];
            msgs.forEach((msg) => __awaiter(this, void 0, void 0, function* () {
                messages.push({
                    from: `${msg.fromName} <${msg.fromEmail}>`,
                    replyTo: `${msg.replyToName} <${msg.replyToEmail}>`,
                    to: msg.EmailTo,
                    subject: msg.subject,
                    html: `${msg.content}`,
                });
                const msgItem = new this.messageModel(msg);
                const resultmsg = yield msgItem.save();
                const result = yield this.campaignModel.findByIdAndUpdate(idCampaign, { $push: { messages: resultmsg['_id'] } });
            }));
            yield this.transporter.on('idle', () => __awaiter(this, void 0, void 0, function* () {
                while (this.transporter.isIdle() && messages.length) {
                    yield this.transporter.sendMail(messages.shift(), (error, info) => {
                        if (error) {
                        }
                    });
                }
            }));
        });
    }
};
MailingService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(campaign_schema_1.CampaignSchema)),
    __param(1, mongoose_2.InjectModel(template_schema_1.TemplateSchema)),
    __param(2, mongoose_2.InjectModel(message_schema_1.MessageSchema)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], MailingService);
exports.MailingService = MailingService;
//# sourceMappingURL=mailing.service.js.map