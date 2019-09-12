import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from './interfaces/campaign.interface';
import { CampaignSchema } from './schemas/campaign.schema';
import { Template } from './interfaces/template.interface';
import { TemplateSchema } from './schemas/template.schema';
import { Contact } from './interfaces/contact.interface';
import { ContactSchema } from './schemas/contact.schema';
import { LinkSchema } from './schemas/link.schema';
// const sendmail = require('sendmail')();
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';
import { MessageSchema } from './schemas/message.schema';
import { Message } from './interfaces/message.interface';
import { v4 as uuid } from 'uuid'
import { from } from 'rxjs';
import { CompanySchema } from '../companies/schemas/company.schema';
import { Company } from '../companies/interfaces/company.interface';
import { Link } from './interfaces/link.interface';
@Injectable()
export class MailingService {
    transporter;
    constructor(
        @InjectModel(CampaignSchema) private readonly campaignModel: Model<Campaign>,
        @InjectModel(TemplateSchema) private readonly templateModel: Model<Template>,
        @InjectModel(MessageSchema) private readonly messageModel: Model<Message>,
        @InjectModel(ContactSchema) private readonly contactModel: Model<Contact>,
        @InjectModel(CompanySchema) private readonly companyModel: Model<Company>,
        @InjectModel(LinkSchema) private readonly LinkModel: Model<Link>,
    ) {
    }

    async updateTemplate(id, template): Promise<any> {
        return this.templateModel.findByIdAndUpdate({ _id: id }, { $set: template }).exec();
    }

    async createContact(contact: Contact): Promise<any> {
        const createdContact = new this.contactModel(contact);
        return await createdContact.save();
    }

    async updateContact(id, contact): Promise<any> {
        return this.contactModel.findByIdAndUpdate({ _id: id }, { $set: contact }).exec();
    }

    async findAllContact(): Promise<Contact[]> {
        return await this.contactModel.find().exec();
    }

    async createCampaign(campaign, idCompany): Promise<any> {
        const template = await this.templateModel.findById(campaign.template).exec();

        let AddTrackerResponse : any= await this.addTrackerLinkToEmail(template.content);

        campaign.links = AddTrackerResponse.links ; 

        console.log(campaign);

        const messages = [];
        campaign['messages'] = [];
        await campaign.emails.forEach(async (email) => {

            const message = {
                template: template['_id'],
                subject: campaign.subject,
                EmailTo: email,
                content: AddTrackerResponse.newHtmlContent,
                fromEmail: 'mailer4@mailer4.fivepoints.fr',
                fromName: campaign['fromName'],
                replyToName: campaign['replyToName'],
                replyToEmail: campaign['replyToEmail'],
                sendDate: Date.now().toString(),
                uuid: uuid(),
                links: [],
            };

            messages.push(message);
        });

        campaign['sendDate'] = Date.now().toString();
        campaign['status'] = 'sent';

        const createdCampaign = new this.campaignModel(campaign);
        const company = await this.companyModel.findById({ _id: idCompany }).populate({ path: 'campaigns' }).exec();
        const newCampaign = await createdCampaign.save();

        if (company.campaigns) {
            await this.companyModel.findByIdAndUpdate(idCompany, { $push: { campaigns: newCampaign._id } }).exec();
            this.sendmail(messages, newCampaign['_id']);
            return newCampaign;
        }
        else {
            company.campaigns.push(newCampaign._id);
            await this.companyModel.findByIdAndUpdate(idCompany, { $set: company });
            this.sendmail(messages, newCampaign['_id']);
            return newCampaign;
        }
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

        let messages = [];

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
            // console.log("Transporter on");
            // console.log("messages length " + messages.length);
            while (this.transporter.isIdle() && messages.length) {
                await this.transporter.sendMail(messages.shift(), (error, info) => {
                    console.log("send mail");
                    if (error) {
                        return console.log(error);
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

        // });
    }

    addTrackerToMail(message) {
        let indexBody = message.content.indexOf('</div>');
        return message.content.substr(0, indexBody) + '<img src=\"http://backend.camail.fivepoints.fr/api/mailing/track/' + message.uuid + '\"/>' + message.content.substr(indexBody);
    }

    async addTrackerLinkToEmail(htmlContent ) {
        const regex = /href\s*=\s*(['"])(https?:\/\/.+?)\1/ig;
        let link :any;
        let links: any[] = [];
        let newHtmlContent = htmlContent;
        while ((link = regex.exec(htmlContent)) !== null) {

            //    let newLink = await this.saveLink(link[2]);
            const Link = { url: link[2], openedTimes: 0 }
            const createdLink = new this.LinkModel(Link);
            let newLink = await createdLink.save();

            links.push(newLink._id);
            newHtmlContent = newHtmlContent.replace(link[2], 'http://backend.camail.fivepoints.fr/api/mailing/trackLink/'+ newLink._id);
            
        }
        
        return {
            newHtmlContent : newHtmlContent ,
            links : links 
        }
    }


    async trackEmailByUid(uuid) {
        return await this.messageModel.findOneAndUpdate({ uuid }, { $set: { opened: true } }).exec();
    }

    async saveLink(url) {
        const link = { url: url, openedTimes: 0 }
        const createdLink = new this.LinkModel(link);
        return await createdLink.save();

    }

    async addContact(contact: any, id: any) {
        const createdContact = new this.contactModel(contact);
        const company = await this.companyModel.findById({ _id: id }).populate({ path: 'contacts' }).exec();

        if (company.contacts) {
            for (let i = 0; i < company.contacts.length; i++) {
                if (company.contacts[i]['email'] === contact.email) {
                    return { message: 'already exist' };
                }
            }
            const newContact = await createdContact.save();
            await this.companyModel.findByIdAndUpdate(id, { $push: { contacts: newContact._id } }).exec();
            return newContact;
        }
        else {
            const newContact = await createdContact.save();
            company.contacts.push(createdContact._id);
            await this.companyModel.findByIdAndUpdate(id, { $set: company });
            return newContact;
        }
    }

    async deleteContact(id, idCompany) {
        await this.companyModel.findByIdAndUpdate(idCompany, { $pull: { contacts: id } });
        return await this.contactModel.remove({ _id: id }).exec();
    }

    async createTemplate(template: Template, id: any): Promise<any> {
        const createdTemplate = new this.templateModel(template);
        const company = await this.companyModel.findById({ _id: id }).populate({ path: 'templates' }).exec();
        const templates = await this.templateModel.find().exec();
        if (company.templates) {
            const newTemplate = await createdTemplate.save();
            await this.companyModel.findByIdAndUpdate(id, { $push: { templates: newTemplate._id } }).exec();
            return newTemplate;
        }
        else {
            const newTemplate = await createdTemplate.save();
            company.templates.push(createdTemplate._id);
            await this.companyModel.findByIdAndUpdate(id, { $set: company });
            return newTemplate;
        }
    }

    async deleteTemplate(id, idCompany) {
        await this.companyModel.findByIdAndUpdate(idCompany, { $pull: { templates: id } });
        return await this.templateModel.remove({ _id: id }).exec();
    }

    async updateOpenedTimesLink(idLink){
        return await this.LinkModel.findByIdAndUpdate({ _id:idLink }, { $inc: {  openedTimes : 1 } });   
    }

    async deleteLink(idLink, idCampaign) {
        await this.LinkModel.remove({ _id: idLink }).exec();
        return await this.campaignModel.findByIdAndUpdate(idCampaign, { $pull: { links: idLink } }).populate({ path: 'links' }).exec();
    }


}
