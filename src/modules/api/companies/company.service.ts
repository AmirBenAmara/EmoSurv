import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './interfaces/company.interface';
import { CompanySchema } from './schemas/company.schema';
import { User } from '../users/interfaces/user.interface';
import { UserSchema } from '../users/schemas/user.schema';
import * as smtpPool from 'nodemailer-smtp-pool';
import * as nodemailer from 'nodemailer';
import { SettingsSchema } from '../settings/schemas/settings.shema';
import { Setting } from '../settings/interfaces/settings.interface';
@Injectable()
export class CompaniesService {
  smtpMyMailConfig = {};
  transporter: any;
  constructor(@InjectModel(CompanySchema) private readonly companyModel: Model<Company>,
              @InjectModel(UserSchema) private readonly userModel: Model<User>,
              @InjectModel(SettingsSchema) private readonly settingModel: Model<Setting>) { }
  async create(company: Company): Promise<Company> {
    const createdCompany = new this.companyModel(company);
    const companyCreated =  await createdCompany.save();
    const createduser = new this.userModel(company);
    createduser['company'] = companyCreated._id;
    const userCreated = await createduser.save();
    const random = await this.sendEmailVerif(company.email, userCreated._id);
    await this.createKey(userCreated._id, random);

    return companyCreated;

  }
  async resendEmail(email): Promise<any> {
    const companyFound =  await this.companyModel.findOne({email}).exec();
    if (companyFound) {
      const userFound = await this.userModel.findOne({company: companyFound._id}).exec();
      const random = await this.sendEmailVerif(companyFound.email, userFound._id);
      await this.createKey(userFound._id, random);
      return true;
    }
    return false;
  }
  async sendEmailVerif(email, userId): Promise<any> {
    const random = Math.floor((Math.random() * 100) + 54);
    const link = 'http://localhost:4200/login/' + random + '/' + userId;
    const htmlMsg = 'Hello,<br> Please Click on the link to verify your email.<br><a href="' + link + '">Click here to verify</a>';
    const message = {
      from: 'fivepoints@mailer4.fivepoints.fr',
      replyTo: 'contact@fivepoints.fr',
      to: email,
      subject: 'confirm email',
      html: htmlMsg,
    };

    const smtpMyMailConfig = smtpPool({
      host: 'mailer4.fivepoints.fr',
      port: 465,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: 'mailer4  ',
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
    await this.transporter.on('idle', async () => {
      if (this.transporter.isIdle()) {
    this.transporter.sendMail(message, (error, info) => {
      if (error) {
        return link;
      }
      console.log('email sent');
      return link;
    });
  }
});
    // tslint:disable-next-line:no-console
    console.log(link, 'link');
    return random;

  }
  async createKey(idUser: any, randomId: any): Promise<Setting> {
    // tslint:disable-next-line:no-console
    console.log(idUser);
    const confirmRegisterUser = {
      userId: idUser,
      verifCode: randomId,
    };
    // tslint:disable-next-line:no-console
    console.log(confirmRegisterUser);

    const result = await this.settingModel.create(confirmRegisterUser).catch(err => err);
    return result;
  }
  async checkKey(randomId: any, idUser: string) {
    // tslint:disable-next-line:no-console
    console.log(randomId, 'randomId', idUser, 'idUser');
    const setting = await this.settingModel.findOne({ userId: idUser, verifCode: randomId }).exec();
    // tslint:disable-next-line:no-console
    console.log(setting, 'dfsdf');
    if (setting && setting.userId === idUser && setting.verifCode === randomId) {
      this.settingModel.remove({ _id: setting._id }).exec(); // findOneAndDelete(setting).exec();
      this.userModel.findOneAndUpdate({ _id: idUser }, { $set: { accountStatus: 'Activated' } }).exec();
      return true;
    }

    return false;
  }
  async checkCompanyName(name) {
    const res = await this.companyModel.findOne({name: name.companyName} ).exec();
    if (res) {
      return {message: true};
    }
    return {message: false};
  }
  async checkEmail(email) {
    const res = await this.companyModel.findOne(email ).exec();
    const res2 = await this.userModel.findOne({emailContact: email.email}).exec();
    if (res || res2) {
      return {message: true};
    }
    return {message: false};
  }
  async findAll(): Promise<Company[]> {
    return await this.companyModel.find().exec();
  }
  async findAllAdmin(): Promise<Company[]> {
    return await this.companyModel.find().populate('profiles Profile').exec();
  }
  async findAllByCountry(countries): Promise<Company[]> {
    return await this.companyModel.find({'address.country': countries}).exec();
  }

  async findOne(id): Promise<Company> {
    return await this.companyModel.findById({ _id: id }).populate({path: 'profiles'}).exec();
  }
  async updateOne(id, company): Promise<Company> {
    return await this.companyModel.findByIdAndUpdate({ _id: id }, {$set: company}).exec();
  }
  async createUser(user): Promise<any> {
    const createduser = new this.userModel(user);
    const userCreated =  await createduser.save();
    await this.userModel.findOneAndUpdate({company: userCreated['company']}, {$push: {attachedUsers: userCreated}});
    this.sendEmailToNewUser(userCreated['emailContact']);
    return true;
  }
  async updateRoleUser(idUser, newRole): Promise<any> {
    return await this.userModel.findByIdAndUpdate(idUser, { $set: {role: newRole}});
  }
  async usersComapny(idCompany): Promise<any> {
    return await this.userModel.findOne({company: idCompany}).populate('attachedUsers User');
  }
  async deleteUserComapny(idUser, idCompany): Promise<any> {
     await this.userModel.findOneAndUpdate({company: idCompany}, {$pull: {attachedUsers: idUser}});
     return await this.userModel.findByIdAndRemove(idUser);
  }
  async sendEmailToNewUser(email): Promise<any> {
    const link = 'http://localhost:4200/login';
    const htmlMsg = 'Hello,<br> Please Click on the link to go to the platform.<br><a href="' + link + '">Click here to go</a>';
    const message = {
      from: 'fivepoints@mailer4.fivepoints.fr',
      replyTo: 'contact@fivepoints.fr',
      to: email,
      subject: 'confirm email',
      html: htmlMsg,
    };

    const smtpMyMailConfig = smtpPool({
      host: 'mailer4.fivepoints.fr',
      port: 465,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: 'mailer4  ',
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
    await this.transporter.on('idle', async () => {
      if (this.transporter.isIdle()) {
    this.transporter.sendMail(message, (error, info) => {
      if (error) {
        return link;
      }
      console.log('email sent');
      return link;
    });
  }
});
    // tslint:disable-next-line:no-console
    console.log(link, 'link');
    return link;

  }
}
