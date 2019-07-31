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
const profile_schema_1 = require("./schemas/profile.schema");
const core_1 = require("@nestjs/core");
const pdf2Text = require("pdf2text");
const fs = require("fs");
const company_schema_1 = require("../companies/schemas/company.schema");
let ProfilesService = class ProfilesService {
    constructor(profileModel, companyModel, moduleRef) {
        this.profileModel = profileModel;
        this.companyModel = companyModel;
        this.moduleRef = moduleRef;
        this.rows = {};
    }
    onModuleInit() {
    }
    create(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            profile['createdDate'] = Number.parseInt(Date.now().toString());
            const createdProfile = new this.profileModel(profile);
            return yield createdProfile.save();
        });
    }
    findAllProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profileModel.find().exec();
        });
    }
    register(profile, poolid) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.profileModel.findOne({ email: profile.email });
            if (result) {
                return yield this.profileModel.findOneAndUpdate({ email: profile.email }, { $push: { pools: poolid } }).exec();
            }
            else {
                const createdProfile = new this.profileModel(profile);
                createdProfile['createdDate'] = Number.parseInt(Date.now().toString());
                return yield createdProfile.save();
            }
        });
    }
    addProfile(profile, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdProfile = new this.profileModel(profile);
            createdProfile['createdDate'] = Number.parseInt(Date.now().toString());
            const company = yield this.companyModel.findById({ _id: id }).populate({ path: 'profiles' }).exec();
            const profiles = yield this.profileModel.find().exec();
            if (company.profiles) {
                for (let i = 0; i < company.profiles.length; i++) {
                    if (company.profiles[i]['email'] === profile.email) {
                        return { message: 'already exist' };
                    }
                }
                for (let i = 0; i < profiles.length; i++) {
                    if (profiles[i]['email'] === profile.email) {
                        yield this.companyModel.findByIdAndUpdate(id, { $push: { profiles: profiles[i]._id } }).exec();
                        return profiles[i];
                    }
                }
                const profileNew = yield createdProfile.save();
                yield this.companyModel.findByIdAndUpdate(id, { $push: { profiles: profileNew._id } }).exec();
                return profileNew;
            }
            else {
                const profileNew = yield createdProfile.save();
                company.profiles.push(profileNew._id);
                yield this.companyModel.findByIdAndUpdate(id, { $set: company });
                return profileNew;
            }
        });
    }
    addProfileByCvEmail(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let cvtext = '';
            yield pdf2Text(fs.readFileSync('./' + file)).then((pages) => __awaiter(this, void 0, void 0, function* () {
                let email;
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
                    const resultprofile = yield this.profileModel.findOne({ email }).exec();
                    if (!resultprofile) {
                        const profile = { email, cvData: cvtext, cvFile: file };
                        const createdProfile = new this.profileModel(profile);
                        yield createdProfile.save().catch();
                    }
                }
            }));
            return cvtext;
        });
    }
    profilePic(file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profileModel.findOneAndUpdate({ _id: id }, { $set: { picFile: file } }).exec();
        });
    }
    UpdateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.profileModel.findOneAndUpdate({ _id: profile._id }, { $set: profile }).exec();
        });
    }
    UpdateProfiles(id, profilesUpdated) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.companyModel.findOneAndUpdate({ _id: id }, { $set: { profiles: profilesUpdated } }).exec();
        });
    }
    UpdateProfileCvById(file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield pdf2Text(fs.readFileSync(file)).then((pages) => __awaiter(this, void 0, void 0, function* () {
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
                yield this.profileModel.findOneAndUpdate({ _id: id }, { $set: { cvFile: file, cvData: cvtext, skills: skills } }).exec();
            }));
        });
    }
    skillsChecker(skill) {
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
    skillanalyse() {
        return __awaiter(this, void 0, void 0, function* () {
            let skills = [];
            return yield this.profileModel.find().exec((err, res) => __awaiter(this, void 0, void 0, function* () {
                yield res.forEach((profile) => __awaiter(this, void 0, void 0, function* () {
                    skills = [];
                    yield profile.cvData.split(' ').forEach(word => {
                        if (this.skillsChecker(word)) {
                            skills.push(this.skillsChecker(word));
                        }
                    });
                    if (skills) {
                        this.profileModel.findByIdAndUpdate(profile['_id'], { $set: { skills: skills } }).exec();
                    }
                }));
            }));
        });
    }
    searchProfile(keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            let skills = '';
            keywords.skills.forEach(skill => {
                skills += skill + ' ';
            });
            return yield this.profileModel.find({ $text: { $search: skills, $caseSensitive: false } }).exec();
        });
    }
    findAll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.find({ _id: id }).populate({ path: 'profiles' }).exec();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profileModel.findById({ _id: id });
        });
    }
    getCvFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    update(id, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profileModel.findByIdAndUpdate({ _id: id }, { $set: profile }).exec();
        });
    }
};
ProfilesService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(profile_schema_1.ProfileSchema)), __param(1, mongoose_2.InjectModel(company_schema_1.CompanySchema)),
    __metadata("design:paramtypes", [mongoose_1.Model, mongoose_1.Model,
        core_1.ModuleRef])
], ProfilesService);
exports.ProfilesService = ProfilesService;
//# sourceMappingURL=profile.service.js.map