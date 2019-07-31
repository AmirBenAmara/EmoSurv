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
const evaluation_schema_1 = require("./schemas/evaluation.schema");
const childP = require("child_process");
const path = require("path");
const fs = require("fs-extra");
const uuid_1 = require("uuid");
const test_schema_1 = require("./schemas/test.schema");
const nodemailer = require("nodemailer");
const smtpPool = require("nodemailer-smtp-pool");
const profile_schema_1 = require("../profiles/schemas/profile.schema");
const pool_schema_1 = require("../pools/schemas/pool.schema");
const htmlContent_1 = require("./htmlContent");
const async_1 = require("async");
const company_schema_1 = require("../companies/schemas/company.schema");
let EvaluationService = class EvaluationService {
    constructor(evaluationModel, testModel, profileModel, poolModel, companyModel) {
        this.evaluationModel = evaluationModel;
        this.testModel = testModel;
        this.profileModel = profileModel;
        this.poolModel = poolModel;
        this.companyModel = companyModel;
    }
    findAllTestsByCompany(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.testModel.find({ owner: id }).exec();
        });
    }
    getStatsprofiles(id, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const evals = [];
            const evaluations = yield this.evaluationModel.find().populate('test Test').exec();
            evaluations.forEach(evaluation => {
                if (evaluation.profile.toString() === id && evaluation.companySchema.toString() === idCompany) {
                    evals.push(evaluation);
                }
            });
            return evals;
        });
    }
    getStatsprofilesAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evals = [];
            const evaluations = yield this.evaluationModel.find().populate('test Test companySchema Company').exec();
            evaluations.forEach(evaluation => {
                if (evaluation.profile.toString() === id) {
                    evals.push(evaluation);
                }
            });
            return evals;
        });
    }
    getStatsOtherprofiles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evals = [];
            const evaluations = yield this.evaluationModel.find().populate('test Test companySchema Company').exec();
            evaluations.forEach(evaluation => {
                if (evaluation.profile.toString() === id) {
                    evals.push(evaluation);
                }
            });
            return evals;
        });
    }
    createEvaluation(evaluations) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(evaluations)) {
                return { message: 'missing params' };
            }
            const NewProfiles = evaluations.filter(ev => ev.profile['_id'] === undefined);
            const messages = [];
            for (let i = 0; i < evaluations.length; i++) {
                if (NewProfiles.filter(pr => pr.profile['email'] === evaluations[i].profile['email']).length !== 0) {
                }
                evaluations[i]['status'] = 'not started';
                evaluations[i]['uuid'] = uuid_1.v4();
                evaluations[i]['createdDate'] = Number.parseInt(Date.now().toString());
                evaluations[i]['startedDate'] = null;
                evaluations[i] = yield this.evaluationModel.create(evaluations[i]);
                if (evaluations[i].profile['email'] === undefined) {
                    evaluations[i].profile = yield this.profileModel.findById(evaluations[i].profile).exec();
                }
                evaluations[i]['test'] = yield this.testModel.findById(evaluations[i]['test']).exec();
                const message = {
                    from: 'fivepoints@mailer4.fivepoints.fr',
                    replyTo: 'contact@fivepoints.fr',
                    to: evaluations[i].profile['email'],
                    subject: `FivePoints: Evaluation test (${evaluations[i]['test']['title']})`,
                    html: htmlContent_1.HtmlContent.EvalInvitation(evaluations[i]['test']['title'], 'https://fivepoints.fr/test/' + evaluations[i]['uuid'], `${evaluations[i].profile['name']} ${evaluations[i].profile['lastname']}`),
                };
                messages.push(message);
            }
            this.sendEmailsEvalInvitations(messages);
            evaluations = yield this.evaluationModel.find().populate('pool Pool').populate('profile Profiles').sort('-createdDate').populate('test Test').exec();
            return evaluations;
        });
    }
    createTest(test) {
        return __awaiter(this, void 0, void 0, function* () {
            test['createdDate'] = Number.parseInt(Date.now().toString());
            const createdTest = new this.testModel(test);
            return yield createdTest.save();
        });
    }
    takeTest(test, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.testModel.findByIdAndUpdate({ _id: id }, { $set: { taken: 'Taken' } }).exec();
            test['createdDate'] = Number.parseInt(Date.now().toString());
            const createdTest = new this.testModel(test);
            return yield createdTest.save();
        });
    }
    takeProfile(id, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.companyModel.findByIdAndUpdate({ _id: idCompany }, { $push: { profiles: id } }).exec();
        });
    }
    updateTest(id, test) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.testModel.findByIdAndUpdate({ _id: id }, { $set: test }).exec();
        });
    }
    deleteTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.testModel.findByIdAndUpdate({ _id: id }, { $set: { status: 'deleted' } }).exec();
        });
    }
    sendmail(emails, sub, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const smtpMyMailConfig = smtpPool({
                host: 'mailer4.fivepoints.fr',
                port: 465,
                secure: true,
                auth: {
                    user: 'mailer4',
                    pass: 'Aaaa0000',
                },
                maxConnections: 5,
                maxMessages: 10,
                rateLimit: 5,
                tls: {
                    rejectUnauthorized: false,
                },
            });
            this.transporter = yield nodemailer.createTransport(smtpMyMailConfig, {
                pool: true,
            });
            const messages = [];
            emails.forEach(email => {
                messages.push({
                    from: 'fivepoints@mailer4.fivepoints.fr',
                    replyTo: 'contact@fivepoints.fr',
                    to: email,
                    subject: sub,
                    html: `${content}`,
                });
            });
            yield this.transporter.on('idle', () => __awaiter(this, void 0, void 0, function* () {
                while (this.transporter.isIdle() && messages.length) {
                    yield this.transporter.sendMail(messages.shift(), (error, info) => {
                        if (error) { }
                    });
                }
            }));
        });
    }
    findAllEvaluations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluationModel.find().populate('pool Pool').populate('profile Profiles').sort('-createdDate').populate('test Test').exec();
        });
    }
    findAllTests() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.testModel.find().exec();
        });
    }
    findOtherTests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.testModel.find({ owner: { $ne: id } }).populate('owner Company').exec();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluationModel.findById({ _id: id });
        });
    }
    findOneByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.evaluationModel.findOne({ uuid: code }, { pool: 0 }).populate({ path: 'profile', select: ['email', 'name', 'lastname'] }).populate({ path: 'test', select: ['title', 'duration', 'description', 'algo', 'project', 'testValue', 'algo', 'project', 'resultValue', 'resultValueJavascript', 'resultValueJava', 'resultValuePhp', 'resultValuePython', 'languages', 'quizes', 'hybrid', 'type'] }).exec();
            if (result) {
                return result;
            }
            else {
                return { message: 'NOTFOUND' };
            }
        });
    }
    findOneByCodeToSubmitProject(code, testObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = Number.parseInt(Date.now().toString());
            testObj['submitDate'] = endDate;
            const result = yield this.evaluationModel.findOne({ uuid: code }).populate({ path: 'test' }).exec();
            if (result.status === 'started') {
                if (result.test['type'] === 'project') {
                    console.log(testObj);
                    testObj['status'] = 'finished';
                    const result2 = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
                    return result2;
                }
            }
            else {
                return { message: 'error' };
            }
        });
    }
    findOneByCodeToStart(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const strdDate = Number.parseInt(Date.now().toString());
            const resultVerif = yield this.evaluationModel.findOne({ uuid: code }, { pool: 0 }).populate({ path: 'profile', select: ['email', 'name', 'lastname'] }).populate({ path: 'test', select: ['title', 'duration', 'description', 'type'] }).exec();
            if ((resultVerif.startedDate === null || resultVerif.startedDate) && resultVerif.status === 'not started') {
                const result = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: { startedDate: strdDate, status: 'started' } })
                    .populate({ path: 'profile', select: ['email', 'name', 'lastname'] })
                    .populate({ path: 'test', select: ['title', 'duration', 'description', 'testValue', 'resultValue', 'resultValueJavascript', 'resultValueJava', 'resultValuePhp', 'resultValuePython', 'languages', 'type'] }).exec();
                const codeObj = result;
                if (codeObj) {
                    codeObj['startedDate'] = strdDate;
                    codeObj['status'] = 'started';
                    return codeObj;
                }
                else {
                    return { message: 'NOTFOUND' };
                }
            }
            else {
                return resultVerif;
            }
        });
    }
    findOneByCodeToSubmit(code, testObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = Number.parseInt(Date.now().toString());
            testObj['submitDate'] = endDate;
            const result1 = yield this.evaluationModel.findOne({ uuid: code }).populate({ path: 'test' }).exec();
            const result3 = yield this.runCode(testObj);
            let resultCode;
            if (testObj.language === 'JAVA') {
                if (yield result3.includes(result1.test['resultValueJava'])) {
                    resultCode = 'true';
                    testObj['resultPercent'] = 100;
                }
                else {
                    testObj['resultPercent'] = 0;
                    resultCode = 'false';
                }
            }
            if (testObj.language === 'PHP') {
                if (yield result3.includes(result1.test['resultValuePhp'])) {
                    testObj['resultPercent'] = 100;
                    resultCode = 'true';
                }
                else {
                    testObj['resultPercent'] = 0;
                    resultCode = 'false';
                }
            }
            if (testObj.language === 'Python') {
                if (yield result3.includes(result1.test['resultValuePython'])) {
                    testObj['resultPercent'] = 100;
                    resultCode = 'true';
                }
                else {
                    testObj['resultPercent'] = 0;
                    resultCode = 'false';
                }
            }
            if (testObj.language === 'javascript') {
                if (yield result3.includes(result1.test['resultValueJavascript'])) {
                    testObj['resultPercent'] = 100;
                    resultCode = 'true';
                }
                else {
                    testObj['resultPercent'] = 0;
                    resultCode = 'false';
                }
            }
            testObj['resultCode'] = resultCode;
            const result = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
            return result;
        });
    }
    findOneByCodeToSubmitAlgo(code, testObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = Number.parseInt(Date.now().toString());
            testObj['submitDate'] = endDate;
            const result = yield this.evaluationModel.findOne({ uuid: code })
                .populate({ path: 'test' }).populate({ path: 'profile' }).exec();
            if (result.status === 'started') {
                if (result.test['type'] === 'algo') {
                    testObj['status'] = 'finished';
                    const result2 = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
                    return result2;
                }
            }
            else {
                return { message: 'error' };
            }
        });
    }
    findOneByCodeToSubmitQuiz(code, testObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = Number.parseInt(Date.now().toString());
            testObj['submitDate'] = endDate;
            const result = yield this.evaluationModel.findOne({ uuid: code })
                .populate({ path: 'test' }).populate({ path: 'profile' }).exec();
            if (result.status === 'started') {
                if (result.test['type'] === 'quiz') {
                    const profileAnswers = testObj['answers'];
                    const as = result.test['quizAnswers'];
                    let profileTotalAnswersCounter = 0;
                    let profileCorrectAnswersCounter = 0;
                    for (let i = 0; i < Object.keys(as).length; i++) {
                        const a = as[i];
                        if (profileAnswers[i] === 0 || profileAnswers[i]) {
                            profileTotalAnswersCounter++;
                            if (profileAnswers[i] === a) {
                                profileCorrectAnswersCounter++;
                            }
                            else {
                            }
                        }
                    }
                    testObj['status'] = 'finished';
                    testObj['resultPercent'] = Math.round(profileCorrectAnswersCounter * 100 / as.length);
                    testObj['correctAnswers'] = profileCorrectAnswersCounter;
                    testObj['ProfileAnswers'] = profileAnswers;
                    testObj['profileTotalAnswers'] = profileTotalAnswersCounter;
                    const result2 = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
                    const emailsToSend = [];
                    const message = {};
                    message['email'] = result.profile['email'];
                    message['title'] = `FivePoints: Evaluation results (${result.test['title']})`;
                    message['profilename'] = `${result['profile']['name']} ${result['profile']['lastname']}`;
                    emailsToSend.push({
                        from: 'fivepoints@mailer4.fivepoints.fr',
                        replyTo: 'contact@fivepoints.fr',
                        to: result['profile']['email'],
                        subject: `FivePoints: Evaluation results (${result.test['title']})`,
                        html: htmlContent_1.HtmlContent.evalResult(result['test']['title'], `${testObj['resultPercent']} %`, `${result['profile']['name']} ${result['profile']['lastname']}`),
                    });
                    this.sendEmailsEvalInvitations(emailsToSend);
                    return result2;
                }
            }
            else {
                return { message: 'error' };
            }
        });
    }
    findOneByCodeToSubmitHybrid(code, testObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = Number.parseInt(Date.now().toString());
            testObj['submitDate'] = endDate;
            const result = yield this.evaluationModel.findOne({ uuid: code })
                .populate({ path: 'test' }).populate({ path: 'profile' }).exec();
            if (result.status === 'started') {
                if (result.test['type'] === 'hybrid') {
                    const profileAnswers = testObj['answers'];
                    const as = result.test['correctAnswer'];
                    let profileTotalAnswersCounter = 0;
                    let profileCorrectAnswersCounter = 0;
                    const correctCode = [];
                    if (as) {
                        for (let i = 0; i < result.test['hybrid'].length; i++) {
                            if (result.test['hybrid'][i].typeQuestion === 'quiz') {
                                const a = as[i];
                                if (profileAnswers[i] === 0 || profileAnswers[i]) {
                                    profileTotalAnswersCounter++;
                                    if (profileAnswers[i].toString() === a) {
                                        profileCorrectAnswersCounter++;
                                    }
                                }
                            }
                            else {
                                profileTotalAnswersCounter++;
                                const result3 = yield this.runCode(profileAnswers[i]);
                                if (yield result3.includes(result.test['hybrid'][i].resultValue)) {
                                    profileCorrectAnswersCounter++;
                                    correctCode[i] = 'true';
                                }
                                else {
                                    correctCode[i] = 'false';
                                }
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < result.test['hybrid'].length; i++) {
                            profileTotalAnswersCounter++;
                            const result3 = yield this.runCode(profileAnswers[i]);
                            if (yield result3.includes(result.test['hybrid'][i].resultValue)) {
                                profileCorrectAnswersCounter++;
                                correctCode[i] = 'true';
                            }
                            else {
                                correctCode[i] = 'false';
                            }
                        }
                    }
                    testObj['status'] = 'finished';
                    testObj['resultPercent'] = Math.round(profileCorrectAnswersCounter * 100 / profileTotalAnswersCounter);
                    testObj['correctAnswers'] = profileCorrectAnswersCounter;
                    testObj['ProfileAnswers'] = profileAnswers;
                    testObj['profileTotalAnswers'] = profileTotalAnswersCounter;
                    testObj['correctCode'] = correctCode;
                    const result2 = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
                    const emailsToSend = [];
                    const message = {};
                    message['email'] = result.profile['email'];
                    message['title'] = `FivePoints: Evaluation results (${result.test['title']})`;
                    message['profilename'] = `${result['profile']['name']} ${result['profile']['lastname']}`;
                    emailsToSend.push({
                        from: 'fivepoints@mailer4.fivepoints.fr',
                        replyTo: 'contact@fivepoints.fr',
                        to: result['profile']['email'],
                        subject: `FivePoints: Evaluation results (${result.test['title']})`,
                        html: htmlContent_1.HtmlContent.evalResult(result['test']['title'], `${testObj['resultPercent']} %`, `${result['profile']['name']} ${result['profile']['lastname']}`),
                    });
                    this.sendEmailsEvalInvitations(emailsToSend);
                    return result2;
                }
            }
            else {
                return { message: 'error' };
            }
        });
    }
    runCode(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            const temporaryFile = `${timestamp}`;
            const temporaryDir = `/home/adminubuntu/portal/back/${timestamp}/`;
            const TempDir = `/home/adminubuntu/temp/${timestamp}/`;
            const Tfile = path.join(TempDir, temporaryFile);
            fs.mkdirSync(path.dirname(Tfile));
            let child, child2, child3;
            let content;
            let DemonKiller;
            let DemonKiller2;
            const file = path.join(temporaryDir, temporaryFile);
            DemonKiller = `
const childPK = require('child_process')
const DropTime = Date.now();
setTimeout(function() {
var childK = childPK.spawnSync("sudo", [
"docker",
"kill",
"${timestamp.toString()}"
]);
console.log("Drop Time: " + DropTime);

}, 10000);
`;
            DemonKiller2 = `
const childPK = require('child_process')
const DropTime = Date.now();
const DemonKiller = async (callback) => {
var childK = childPK.spawnSync("sleep", ["10s"]);

var childK = childPK.spawnSync("sudo", [
"docker",
"kill",
"${timestamp.toString()}"
]);
var childK = childPK.spawnSync("sudo", [
"docker",
"kill",
"${timestamp.toString()}"
]);
console.log("Drop Time: " + DropTime);
}
DemonKiller();
`;
            let consoleOut = '';
            yield fs.mkdirp(path.dirname(file));
            switch (text.language) {
                case 'javascript':
                    content = `var start = +new Date();

${text.text}
var end = +new Date();
console.log("Process took " + (end-start) + " milliseconds");
`;
                    async_1.default.parallel({
                        one: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                            child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, `${Tfile}.js`]);
                            callback(null, child3.stdout.toString());
                        }),
                        two: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFile(file, content);
                            child = childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name`, `${timestamp}`, `--cpus=.08`, '-v', `${temporaryDir}:/usr/src/app`, '-w', '/usr/src/app', 'node:8', 'node', `${temporaryFile}`, 'hello']);
                            if (child.stdout.toString().length === 0) {
                                callback(null, 'error in your code');
                            }
                        }),
                    }, (err, results) => {
                        if (err)
                            throw err;
                        consoleOut = results.two;
                        console.log(results.two);
                    });
                    break;
                case 'PHP':
                    content = `
        <?php
      $time1 = microtime(true);
      ?>
      ${text.text}
      echo "\nProcess took ". number_format(microtime(true) - $time1, 6). " seconds.";
      `;
                    async_1.default.parallel({
                        one: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                            child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, 'node', `${Tfile}.js`, '-i', 'max']);
                            callback(null, child3.stdout.toString());
                        }),
                        two: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFile(file, content);
                            child = childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name=${timestamp}`, '-v', `${temporaryDir}:/home`, 'php:cli', 'php', `/home/${temporaryFile}`, 'hello']);
                            if (child.stdout.toString().length === 0) {
                                callback(null, 'error in your code');
                            }
                        }),
                    }, (err, results) => {
                        if (err)
                            throw err;
                        consoleOut = results.two;
                        console.log(results.two);
                    });
                    break;
                case 'JAVA':
                    content = `${text.text}`;
                    async_1.default.parallel({
                        one: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                            child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, 'node', `${Tfile}.js`, '-i', 'max']);
                            callback(null, child3.stdout.toString());
                        }),
                        two: (callback) => __awaiter(this, void 0, void 0, function* () {
                            const filejava = path.join(temporaryDir, 'Main.java');
                            yield fs.writeFile(filejava, content);
                            child2 = yield childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name=java${timestamp}`, '-v', `${temporaryDir}:/usr/src/hello-docker`, '-w', `/usr/src/hello-docker`, 'openjdk:8', 'javac', `Main.java`]);
                            child = yield childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/usr/src/hello-docker`, '-w', `/usr/src/hello-docker`, 'openjdk:8', 'java', `Main`]);
                            if (child.stdout.toString().length === 0 || child2.stdout.toString() === 0) {
                                callback(null, 'error in your code');
                            }
                        }),
                    }, (err, results) => {
                        if (err)
                            throw err;
                        consoleOut = results.two;
                        console.log(results.two);
                    });
                    break;
                case 'Python':
                    content = `import os
from datetime import datetime
start_time = datetime.now()
${text.text}
time_elapsed = datetime.now() - start_time
print('Process took {}'.format(time_elapsed))
        `;
                    async_1.default.parallel({
                        one: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                            child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, 'node', `${Tfile}.js`, '-i', 'max']);
                            callback(null, child3.stdout.toString());
                        }),
                        two: (callback) => __awaiter(this, void 0, void 0, function* () {
                            yield fs.writeFile(file, content);
                            child = childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name=${timestamp}`, '-v', `${temporaryDir}:/app`, '-w', '/app', 'iron/python:2', 'python', `${temporaryFile}`]);
                            if (child.stdout.toString().length === 0) {
                                callback(null, 'error in your code');
                            }
                        }),
                    }, (err, results) => {
                        if (err)
                            throw err;
                        consoleOut = results.two;
                        console.log(results.two);
                    });
                    break;
                default:
                    return 'error';
            }
            yield fs.remove(path.join('/home/adminubuntu/portal/back' + `/${timestamp}`));
            if (child2) {
                if (child2.stdout !== undefined) {
                    consoleOut += child2.stdout.toString();
                }
                if (child2.error !== undefined) {
                    consoleOut += child2.error.toString();
                }
                if (child2.stderr !== undefined) {
                    consoleOut += child2.stderr.toString();
                }
            }
            if (child.stdout !== undefined) {
                consoleOut += child.stdout.toString();
            }
            if (child.error !== undefined) {
                consoleOut += child.error.toString();
            }
            if (child.stderr !== undefined) {
                consoleOut += child.stderr.toString();
            }
            return consoleOut;
        });
    }
    createResultEmail(emails) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [];
            emails.forEach(emailReq => {
                const message = {
                    from: 'fivepoints@mailer4.fivepoints.fr',
                    replyTo: 'contact@fivepoints.fr',
                    to: emailReq.email,
                    subject: emailReq.title,
                    html: htmlContent_1.HtmlContent.EvalInvitation(emailReq.title, emailReq.link, emailReq.profilename),
                };
                messages.push(message);
            });
            this.sendEmailsEvalInvitations(messages);
        });
    }
    sendEmailsEvalInvitations(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(messages.length);
            const smtpMyMailConfig = smtpPool({
                host: 'mailer4.fivepoints.fr',
                port: 465,
                secure: true,
                auth: {
                    user: 'mailer4',
                    pass: 'Aaaa0000',
                },
                maxConnections: 5,
                maxMessages: 10,
                rateLimit: 5,
                tls: {
                    rejectUnauthorized: false,
                },
            });
            this.transporter = yield nodemailer.createTransport(smtpMyMailConfig, {
                pool: true,
            });
            yield this.transporter.on('idle', () => __awaiter(this, void 0, void 0, function* () {
                while (this.transporter.isIdle() && messages.length) {
                    yield this.transporter.sendMail(messages.shift(), (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log(info);
                    });
                }
            }));
        });
    }
};
EvaluationService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(evaluation_schema_1.EvaluationSchema)),
    __param(1, mongoose_2.InjectModel(test_schema_1.TestSchema)),
    __param(2, mongoose_2.InjectModel(profile_schema_1.ProfileSchema)),
    __param(3, mongoose_2.InjectModel(pool_schema_1.PoolSchema)),
    __param(4, mongoose_2.InjectModel(company_schema_1.CompanySchema)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], EvaluationService);
exports.EvaluationService = EvaluationService;
//# sourceMappingURL=evaluation.service.js.map