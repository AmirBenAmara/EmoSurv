import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from './interfaces/campaign.interface';
import { CampaignSchema } from './schemas/campaign.schema';
import { Template } from './interfaces/template.interface';
import { TemplateSchema } from './schemas/template.schema';
// const sendmail = require('sendmail')();
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';
import { MessageSchema } from './schemas/message.schema';
import { Message } from './interfaces/message.interface';
import {v4 as uuid} from 'uuid'
import { from } from 'rxjs';
@Injectable()
export class MailingService {
    transporter;
    constructor(
        @InjectModel(CampaignSchema) private readonly campaignModel: Model<Campaign>,
        @InjectModel(TemplateSchema) private readonly templateModel: Model<Template>,
        @InjectModel(MessageSchema) private readonly messageModel: Model<Message>,
    ) {
    }

    async createTemplate(template: Template): Promise<any> {
        const createdTemplate = new this.templateModel(template);
        return await createdTemplate.save();
    }

    async updateTemplate(id, template): Promise<any> {
        return this.templateModel.findByIdAndUpdate({ _id: id }, { $set: template }).exec();
    }

    async createCampaign(campaign): Promise<any> {
        const template = await this.templateModel.findById(campaign.template).exec();
        const messages = [];
        campaign['messages'] = [];
        await campaign.emails.forEach(async (email) => {

            const message = {
                template: template['_id'], subject: campaign.subject, EmailTo: email, content: template['content'], fromEmail: campaign['fromEmail']
                , fromName: campaign['fromName'], replyToName: campaign['replyToName'], replyToEmail: campaign['replyToEmail'], sendDate: Date.now().toString(),uuid:uuid(),
            };
            // const messageResult = new this.messageModel(message);
            // const result = await messageResult.save();
            // console.log(result['_id']);
            messages.push(message);
        });
        // campaign['messages'] = messages;
        campaign['sendDate'] = Date.now().toString();
        campaign['status'] = 'sent';
        const createdCampaign = new this.campaignModel(campaign);

        const result = await createdCampaign.save();

        this.sendmail(messages, result['_id']);
        return result;
    }
    async findAllCampaigns(): Promise<Campaign[]> {
        return await this.campaignModel.find().populate('messages Message').populate('createdBy User').populate('template Template').exec();
    }
    async findAllTemplates(): Promise<Template[]> {
        return await this.templateModel.find().exec();
    }
    async updateCampaign(id, campaign) {
        return await this.campaignModel.findOneAndUpdate({ _id: id }, { $set: campaign }).exec();
    }
    async deleteTemplate(id) {
        return await this.templateModel.remove({ _id: id }).exec();
    }
    async deleteCampaign(id) {
        const result = await this.campaignModel.findById(id).exec();
        if (result.status === 'draft' || result.status === 'scheduled') {
            return await this.campaignModel.remove({ _id: id }).exec();
        }
        return { message: 'cannot delete' };
    }
    async sendmail(msgs, idCampaign) {

        const smtpMyMailConfig = smtpPool({
            host: 'mailer4.fivepoints.fr',
            port: 465,
            secure: true,
            auth: {
                user: 'mailer4',
                pass: 'Aaaa0000',
            },
            maxConnections: 5,
            // do not send more than 10 messages per connection, default is 100
            maxMessages: 10,
            // no not send more than 5 messages in a second, default is no limit
            rateLimit: 5,
            tls: {
                rejectUnauthorized: false,
            },
        });
        this.transporter = await nodemailer.createTransport(smtpMyMailConfig, {
            pool: true,
        });

        const messages = [];

        msgs.forEach(async (msg) => {
            messages.push(
                {
                    from: `${msg.fromName} <${msg.fromEmail}>`,
                    replyTo: `${msg.replyToName} <${msg.replyToEmail}>`,
                    to: msg.EmailTo,
                    subject: msg.subject,
                    html: this.addTrackerToMail(msg),
                },
            );
            const msgItem = new this.messageModel(msg);
            const resultmsg = await msgItem.save();
            const result = await this.campaignModel.findByIdAndUpdate(idCampaign, { $push: { messages: resultmsg['_id'] } });
        });



        await this.transporter.on('idle', async () => {
            while (this.transporter.isIdle() && messages.length) {
                // console.log(messages.shift());
                await this.transporter.sendMail(messages.shift(), (error, info) => {
                    if (error) {
                        // return console.log(error);
                    }
                    // console.log('Message sent: %s', info.messageId);
                    // console.log('Message info');
                    // console.log(info);
                    // console.log('Preview URL: %s', nodemailer.getTemplateMessageUrl(info));
                });
            }
        });
        // transporter.close();

        // const transporter = await nodemailer.createTransport(smtpMyMailConfig);
        // await transporter.sendMail(mailOptions, (error: Error, info: nodemailer.SentMessageInfo): void => {
        //   console.log(error);
        //   console.log(info);

        //   // nothing
        // });
    }

    addTrackerToMail(mail){

        let indexBody = mail.content.indexOf('</div>');
        return mail.content.substr(0, indexBody) + '<img src=\"http://camail.fivepoints.fr/api/mailing/track/'+mail.uuid+'\"/>' + mail.content.substr(indexBody);


    }

    async trackEmailByUid(uuid){
        return await this.messageModel.findOneAndUpdate({uuid},{$set : {opened : true}}).exec();
    }
    
  
}

