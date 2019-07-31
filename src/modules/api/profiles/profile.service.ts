import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { Model } from 'mongoose';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './interfaces/profile.interface';
import { ProfileSchema } from './schemas/profile.schema';
import { PoolSchema, poolSchema } from '../pools/schemas/pool.schema';
import { PoolsService } from '../pools/pool.service';
import { Pool } from '../pools/interfaces/pool.interface';
import { ModuleRef } from '@nestjs/core';
import multer = require('multer');
import pdf2Text = require('pdf2text');
import fs = require('fs');
import csv = require('csvtojson');
import xlsx = require('xlsx2json');
import { CompanySchema } from '../companies/schemas/company.schema';
import { Company } from '../companies/interfaces/company.interface';
import { EvaluationService } from '../evaluation/evaluation.service';
@Injectable()
export class ProfilesService implements OnModuleInit {
   private readonly poolModel: Model<Pool>;
  // tslint:disable-next-line:max-line-length
  rows = {};
  dataFile;
  constructor(@InjectModel(ProfileSchema) private readonly profileModel: Model<Profile>, @InjectModel(CompanySchema) private readonly companyModel: Model<Company>,
              private readonly moduleRef: ModuleRef) { }
  onModuleInit() {
    // this.poolService = this.moduleRef.get<PoolsService>(PoolsService);
   // this.evaluationService = this.moduleRef.get(EvaluationService);
  }
  async create(profile: Profile): Promise<Profile> {
    profile['createdDate'] = Number.parseInt(Date.now().toString());
    const createdProfile = new this.profileModel(profile);

    return await createdProfile.save();
  }

  // async createProfileInPool(profile: Profile): Promise<Profile> {
  //   const createdProfile = new this.profileModel(profile);
  //   const profileCreated = await createdProfile.save();
  //   this.poolModel.findByIdAndUpdate(profile.pools[0], { $addToSet: { profiles: profile.pools[0] } }).exec();
  //   return profileCreated;
  // }
  async findAllProfiles(): Promise<Profile[]> {
    return await this.profileModel.find().exec();
  }
  async register(profile: Profile, poolid: any): Promise<Profile> {
    const result = await this.profileModel.findOne({ email: profile.email });
    if (result) {
      // await this.poolModel.findOneAndUpdate({ _id: poolid }, { $push: { registred: profile._id } }).exec();

      // TODO:WE HAVE A PROB HERE !
      // await this.poolService.registerProfile(poolid, profile._id);
      return await this.profileModel.findOneAndUpdate({ email: profile.email }, { $push: { pools: poolid } }).exec();
    } else {
      // need to put the pool id in the profile Pools array
      const createdProfile = new this.profileModel(profile);
      createdProfile['createdDate'] = Number.parseInt(Date.now().toString());
      return await createdProfile.save();
    }
  }
 async addProfile(profile: any, id: any) {
  const createdProfile = new this.profileModel(profile);
  createdProfile['createdDate'] = Number.parseInt(Date.now().toString());
  const company = await this.companyModel.findById({_id: id}).populate({ path: 'profiles'}).exec();
  const profiles = await this.profileModel.find().exec();
  if (company.profiles) {
// tslint:disable-next-line:prefer-for-of
for (let i = 0; i < company.profiles.length; i++) {
  if (company.profiles[i]['email'] === profile.email) {
    return {message: 'already exist'};
  }
}
// tslint:disable-next-line:prefer-for-of
for (let i = 0; i < profiles.length; i++) {
  if (profiles[i]['email'] === profile.email) {
   await this.companyModel.findByIdAndUpdate(id, { $push: { profiles: profiles[i]._id } }).exec();
   return profiles[i];
  }
}
const profileNew = await createdProfile.save();
await this.companyModel.findByIdAndUpdate(id, { $push: { profiles: profileNew._id } }).exec();
return profileNew;
  } else {
    const profileNew = await createdProfile.save();
    company.profiles.push(profileNew._id);
    await this.companyModel.findByIdAndUpdate(id, { $set : company });
    return profileNew;
  }
 }
  async addProfileByCvEmail(file) {
    let cvtext = '';
    await pdf2Text(fs.readFileSync('./' + file)).then(async pages => {
      // console.log(pages);
      let email: string;
      pages.forEach(page => {
        page.forEach(line => {
          if (line.includes('@')) {
            email = line;
            email = email.replace(/\s/g, '');
          }
          cvtext += line + ' ';
        });
      });
      if (email) {
        const resultprofile = await this.profileModel.findOne({ email }).exec();
        if (!resultprofile) {
          const profile = { email, cvData: cvtext, cvFile: file };
          const createdProfile = new this.profileModel(profile);
          await createdProfile.save().catch();
        }
      }
    });
    return cvtext;
  }

  async profilePic(file, id) {
    return await this.profileModel.findOneAndUpdate({ _id: id }, { $set: { picFile: file } }).exec();
  }
  async UpdateProfile(profile) {
      await this.profileModel.findOneAndUpdate({ _id: profile._id }, { $set: profile }).exec();
  }
  async UpdateProfiles(id, profilesUpdated) {
    await this.companyModel.findOneAndUpdate({ _id: id }, { $set: {profiles: profilesUpdated }}).exec();
}
  async UpdateProfileCvById(file, id) {
    await pdf2Text(fs.readFileSync(file)).then(async pages => {
      const skills = [];
      let cvtext = '';
      pages.forEach(page => {
        page.forEach(line => {
          cvtext += line + ' ';
          if (this.skillsChecker(line)) {
            skills.push(this.skillsChecker(line));
          }
        });
      });
      await this.profileModel.findOneAndUpdate({ _id: id }, { $set: { cvFile: file, cvData: cvtext, skills: skills } }).exec();
    });
  }

  skillsChecker(skill: string) {
    // tslint:disable-next-line:max-line-length
    const skills = ['html', 'html5', 'css', 'css3', 'js', 'javascript', 'ts', 'typescript', 'node', 'nodejs',
      'node.js', 'mongo', 'mongodb', 'angularjs', 'angular1', 'angular', 'angular2', 'angular4', 'angular5',
      'angular6', 'express', 'expressjs', 'wp', 'wordpress', 'php', 'php5', 'php7', 'java', 'j2ee', 'jee',
      'spring', 'jpa', 'jsf', 'python', 'py', 'arduino', 'android', 'mobile', 'web', 'iot', 'jwt',
      'jsonwebtoken', 'laravel', 'symphony', 'codeigniter', 'cakephp', 'c#', 'asp', 'asp.net',
      '.net', 'wpf', 'xamarin', 'jquery', 'bootstrap', 'react', 'vue.js', 'unity', 'ue4',
      'unrealengine4', 'unreal', 'ios', 'es6', 'es5', 'es7', 'es8', 'libgdx', 'devops',
      'flow', 'rxjs', 'ajax', 'sql', 'mysql', 'postgresql', 'vscode', 'tensorflow',
      'oop', '2d', '3d', 'react', 'maven', 'rest', 'restful', 'core', 'chatbot',
      'aws', 'azure', 'docker', 'virtualisation', 'firebase', 'unity5', 'redux',
      'ecma6', 'ecma7', 'ecma8', 'ecma5', 'automatisation', 'jira', 'agile',
      'scrum', 'jira', 'prestashop', 'msproject', 'tfs', 'vsts',
      'woocommerce', 'cms', 'seo', 'flow', 'electronjs',
      'react-native', 'native', 'unix', 'linux',
      'ubuntu', 'terminal', 'bash', 'shell',
      'postgre', 'virtualisation', 'android-studio',
      'git', 'github', 'smo', 'django', 'webpack', 'medium',
      'jenkins', 'teamcity', 'gitlab', 'w3', 'github-pages', 'joomla',
      'wix', 'phpmyadmin', 'phppgadmin', 'kubernates', 'odoo', 'muse', 'excel',
      'word', 'powerpoint', 'cpanel', 'plesk', 'ember', 'knockout', 'modernizr', 'meteror',
      'mean', 'mean.io', 'meanjs', 'mustache', 'socket', 'socketio', 'socket-io', 'websocket',
      'underscore', 'backbone', 'reddit', 'vbulletin', 'phpbb', 'pdf.js', 'owncloud', 'revslider', 'centos',
      'debian', 'redhat', 'raspberrypi', 'darwin', 'suse', 'sunos', 'freebsd', 'fedora', 'raspbian', 'erlang',
      'go', 'c++', 'ruby', 'scala', 'perl', 'lua', 'yoast', 'cowboy', 'materialize', 'material', 'sails', 'sailsjs',
      'sails.js', 'nest', 'nestjs', 'nest.js', 'roundcube', 'squirrelmail', 'openssl', 'amber', 'apache', 'nginx', 'wampp',
      'xampp', 'lampp', 'flask', 'iis', 'next.js', 'nextjs'];
    skill = skill.toLocaleLowerCase();
    skill = skill.trim();
    return skills[skills.indexOf(skill)];
  }

  async skillanalyse() {
    let skills = [];
    return await this.profileModel.find().exec(async (err, res: Profile[]) => {
      await res.forEach(async profile => {
        skills = [];
        await profile.cvData.split(' ').forEach(word => {
          if (this.skillsChecker(word)) {
            skills.push(this.skillsChecker(word));
          }
        });
        if (skills) {
          this.profileModel.findByIdAndUpdate(profile['_id'], { $set: { skills: skills } }).exec();
        }
      });

    });
  }

  async searchProfile(keywords) {
    let skills = '';
    keywords.skills.forEach(skill => {
      skills += skill + ' ';
    });
    return await this.profileModel.find({ $text: { $search: skills, $caseSensitive: false } }).exec();
  }

  //   async upload() {
  //     const storageFile = multer.diskStorage({
  //         destination(req, file, cb) {
  //             cb(null, './upload');
  //         },
  //         filename(req, file, cb) {

  //             cb(null, `${file.fieldname}-${Date.now()}`);
  //         }
  //     });
  //     console.log(storageFile);
  //     const diskUpload = multer({ storage: storageFile });
  //     diskUpload.any();
  // }

  async findAll(id): Promise<any[]> {
    return await this.companyModel.find({_id: id}).populate({path: 'profiles'}).exec();
  }

  async findOne(id): Promise<Profile> {
    return await this.profileModel.findById({ _id: id });
  }

  async getCvFile(id): Promise<any> {

  }

  async update(id, profile: Profile): Promise<Profile> {
    return this.profileModel.findByIdAndUpdate({ _id: id }, { $set: profile }).exec();
  }
  async profileCSV(id, file): Promise<any> {
    if (file.filename.slice(file.filename.lastIndexOf('.')) === '.csv') {
      const _filePath = file.destination + file.filename;
      const jsonArray = await csv().fromFile(_filePath);
      const res = await this.profileModel.insertMany(jsonArray);
      await this.companyModel.findByIdAndUpdate(id, {$push:  {profiles: res}});
      return jsonArray;
    }
    if (file.filename.slice(file.filename.lastIndexOf('.')) === '.xlsx') {
      const _filePath = file.destination + file.filename;
      xlsx(_filePath,
        {
            dataStartingRow: 4,
            mapping: {
                'name': 'A',
                'firstname': 'B',
                'email': 'C',
            },
        }).then(jsonArray => {
        return jsonArray;
      });
    }
  }
}
