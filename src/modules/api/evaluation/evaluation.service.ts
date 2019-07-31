import { OnModuleInit } from '@nestjs/common/interfaces/modules';
import { Model } from 'mongoose';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './interfaces/evaluation.interface';
import { EvaluationSchema } from './schemas/evaluation.schema';
import * as childP from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { Test } from './interfaces/test.interface';
import { TestSchema } from './schemas/test.schema';
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';
import { Profile } from '../profiles/interfaces/profile.interface';
import { ProfileSchema } from '../profiles/schemas/profile.schema';
import { PoolSchema } from '../pools/schemas/pool.schema';
import { Pool } from '../pools/interfaces/pool.interface';
import { HtmlContent } from './htmlContent';
import parallel from 'async';
import { async } from 'rxjs/internal/scheduler/async';
import { ProfilesService } from '../profiles/profile.service';
import { ModuleRef } from '@nestjs/core';
import { CompanySchema } from '../companies/schemas/company.schema';
import { Company } from '../companies/interfaces/company.interface';
@Injectable()
export class EvaluationService {
    private service: ProfilesService;
    transporter;
    constructor(
        @InjectModel(EvaluationSchema) private readonly evaluationModel: Model<Evaluation>,
        @InjectModel(TestSchema) private readonly testModel: Model<Test>,
        @InjectModel(ProfileSchema) private readonly profileModel: Model<Profile>,
        @InjectModel(PoolSchema) private readonly poolModel: Model<Pool>,
        @InjectModel(CompanySchema) private readonly companyModel: Model<Company>,
    ) {
    }
    async findAllTestsByCompany(id): Promise<Test[]> {
        return await this.testModel.find({owner: id}).exec();
    }
    async getStatsprofiles(id, idCompany) {
          const evals = [];
          const evaluations =  await this.evaluationModel.find().populate('test Test').exec();
          evaluations.forEach(evaluation => {
            if ( evaluation.profile.toString() === id && evaluation.companySchema.toString() === idCompany) {
                evals.push(evaluation);
            }
          });
          return evals;
    }
    async getStatsprofilesAdmin(id) {
          const evals = [];
          const evaluations =  await this.evaluationModel.find().populate('test Test companySchema Company').exec();
          evaluations.forEach(evaluation => {
            if ( evaluation.profile.toString() === id) {
                evals.push(evaluation);
            }
          });
          return evals;
    }
    async getStatsOtherprofiles(id) {
          const evals = [];
          const evaluations =  await this.evaluationModel.find().populate('test Test companySchema Company').exec();
          evaluations.forEach(evaluation => {
            if ( evaluation.profile.toString() === id) {
                evals.push(evaluation);
            }
          });
          return evals;
    }
    async createEvaluation(evaluations: Evaluation[]): Promise<any> {
        if (!Array.isArray(evaluations)) {
            return { message: 'missing params' };
        }
        // let poolObj: object = null;
        // if (evaluations && evaluations[0].pool) {
        //     poolObj = this.poolModel.create(evaluations[0].pool).then();
        // }
        // console.log(evaluations);
        // create only the new profiles
        const NewProfiles = evaluations.filter(ev => ev.profile['_id'] === undefined);
        const messages = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < evaluations.length; i++) {
            if (NewProfiles.filter(pr => pr.profile['email'] === evaluations[i].profile['email']).length !== 0) {
                // evaluations[i]['profile'] = this.evaluationService.addProfile(evaluations[i].profile, evaluations[i]['owner']);
            }
            evaluations[i]['status'] = 'not started';
            evaluations[i]['uuid'] = uuid();
            evaluations[i]['createdDate'] = Number.parseInt(Date.now().toString());
            // if (poolObj !== null) {
            //     evaluations[i].pool = poolObj['_id'];
            // }
            evaluations[i]['startedDate'] = null;
            evaluations[i] = await this.evaluationModel.create(evaluations[i]);
            if (evaluations[i].profile['email'] === undefined) {
                evaluations[i].profile = await this.profileModel.findById(evaluations[i].profile).exec();
            }
            evaluations[i]['test'] = await this.testModel.findById(evaluations[i]['test']).exec();
            const message = {
                from: 'fivepoints@mailer4.fivepoints.fr',
                replyTo: 'contact@fivepoints.fr',
                to: evaluations[i].profile['email'],
                subject: `FivePoints: Evaluation test (${evaluations[i]['test']['title']})`,
                html: HtmlContent.EvalInvitation(evaluations[i]['test']['title']
                    , 'https://fivepoints.fr/test/' + evaluations[i]['uuid'], `${evaluations[i].profile['name']} ${evaluations[i].profile['lastname']}`),
            };
            messages.push(message);
        }
        this.sendEmailsEvalInvitations(messages);
        evaluations = await this.evaluationModel.find().populate('pool Pool').populate('profile Profiles').sort('-createdDate').populate('test Test').exec();
        return evaluations;
    }

    async createTest(test: Test): Promise<Test> {
        test['createdDate'] = Number.parseInt(Date.now().toString());
        const createdTest = new this.testModel(test);
        return await createdTest.save();
    }
    async takeTest(test: Test, id): Promise<Test> {
        await this.testModel.findByIdAndUpdate({ _id: id }, { $set: {taken: 'Taken'} }).exec();
        test['createdDate'] = Number.parseInt(Date.now().toString());
        const createdTest = new this.testModel(test);
        return await createdTest.save();
    }
    async takeProfile(id, idCompany) {
        return await this.companyModel.findByIdAndUpdate({ _id: idCompany }, { $push: {profiles: id} }).exec();
    }
    async updateTest(id, test): Promise<any> {
        return this.testModel.findByIdAndUpdate({ _id: id }, { $set: test }).exec();
    }

    async deleteTest(id): Promise<any> {
        return this.testModel.findByIdAndUpdate({ _id: id }, { $set: { status: 'deleted' } }).exec();
    }

    async sendmail(emails, sub, content) {

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

        emails.forEach(email => {
            messages.push(
                {
                    from: 'fivepoints@mailer4.fivepoints.fr',
                    replyTo: 'contact@fivepoints.fr',
                    to: email,
                    subject: sub,
                    html: `${content}`,
                },
            );
        });

        await this.transporter.on('idle', async () => {
            while (this.transporter.isIdle() && messages.length) {
                // console.log(messages.shift());
                await this.transporter.sendMail(messages.shift(), (error, info) => {
                    if (error) { }
                });
            }
        });
    }

    async findAllEvaluations(): Promise<Evaluation[]> {
        return await this.evaluationModel.find().populate('pool Pool').populate('profile Profiles').sort('-createdDate').populate('test Test').exec();
    }

    async findAllTests(): Promise<Test[]> {
        return await this.testModel.find().exec();
    }
    async findOtherTests(id): Promise<Test[]> {
        return await this.testModel.find({owner : {$ne: id}}).populate('owner Company').exec();
    }

    async findOne(id): Promise<Evaluation> {
        return await this.evaluationModel.findById({ _id: id });
    }

    async findOneByCode(code): Promise<any> {
        const result = await this.evaluationModel.findOne({ uuid: code }, { pool: 0 }).populate({ path: 'profile', select: ['email', 'name', 'lastname'] }).populate({ path: 'test', select: ['title', 'duration', 'description', 'algo', 'project', 'testValue', 'algo', 'project', 'resultValue', 'resultValueJavascript', 'resultValueJava', 'resultValuePhp', 'resultValuePython', 'languages', 'quizes', 'hybrid', 'type'] }).exec();
        if (result) {
            return result;
        }
        else {
            return { message: 'NOTFOUND' };
        }
    }
    async findOneByCodeToSubmitProject(code, testObj): Promise<any> {
        const endDate = Number.parseInt(Date.now().toString());
        testObj['submitDate'] = endDate;
        const result = await this.evaluationModel.findOne({ uuid: code }).populate({ path: 'test' }).exec();
        if (result.status === 'started') {
            if (result.test['type'] === 'project') {
                console.log(testObj);
                testObj['status'] = 'finished';
                const result2 = await this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
                return result2;
            }
        } else {
            return { message: 'error' };
        }
    }
    async findOneByCodeToStart(code): Promise<any> {
        const strdDate = Number.parseInt(Date.now().toString());
        const resultVerif = await this.evaluationModel.findOne({ uuid: code }, { pool: 0 }).populate({ path: 'profile', select: ['email', 'name', 'lastname'] }).populate({ path: 'test', select: ['title', 'duration', 'description', 'type'] }).exec();
        if ((resultVerif.startedDate === null || resultVerif.startedDate) && resultVerif.status === 'not started') {
            // tslint:disable-next-line:max-line-length
            const result = await this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: { startedDate: strdDate, status: 'started' } })
                .populate({ path: 'profile', select: ['email', 'name', 'lastname'] })
                .populate({ path: 'test', select: ['title', 'duration', 'description', 'testValue', 'resultValue', 'resultValueJavascript', 'resultValueJava', 'resultValuePhp', 'resultValuePython', 'languages', 'type'] }).exec();
            const codeObj = result;
            if (codeObj) {
                // result['status'] = true;
                // TODO: make startedDate readonly in interface, and find a way to add strDate to result
                codeObj['startedDate'] = strdDate;
                codeObj['status'] = 'started';
                return codeObj;
            }
            else {
                return { message: 'NOTFOUND' };
            }
        } else {
            return resultVerif;
        }
    }

    async findOneByCodeToSubmit(code, testObj): Promise<any> {
        const endDate = Number.parseInt(Date.now().toString());
        testObj['submitDate'] = endDate;
        const result1 = await this.evaluationModel.findOne({ uuid: code }).populate({ path: 'test' }).exec();
        const result3 = await this.runCode(testObj);
        let resultCode;
        if (testObj.language === 'JAVA') {
            if (await result3.includes(result1.test['resultValueJava'])) {
                resultCode = 'true';
                testObj['resultPercent'] = 100;
            } else {
                testObj['resultPercent'] = 0;
                resultCode = 'false';
            }
        }
        if (testObj.language === 'PHP') {
            if (await result3.includes(result1.test['resultValuePhp'])) {
                testObj['resultPercent'] = 100;
                resultCode = 'true';
            } else {
                testObj['resultPercent'] = 0;
                resultCode = 'false';
            }
        }
        if (testObj.language === 'Python') {
            if (await result3.includes(result1.test['resultValuePython'])) {
                testObj['resultPercent'] = 100;
                resultCode = 'true';
            } else {
                testObj['resultPercent'] = 0;
                resultCode = 'false';
            }
        }
        if (testObj.language === 'javascript') {
            if (await result3.includes(result1.test['resultValueJavascript'])) {
                testObj['resultPercent'] = 100;
                resultCode = 'true';
            } else {
                testObj['resultPercent'] = 0;
                resultCode = 'false';
            }
        }
        testObj['resultCode'] = resultCode;
        const result = await this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
        return result;
    }

    async findOneByCodeToSubmitAlgo(code, testObj): Promise<any> {
        const endDate = Number.parseInt(Date.now().toString());
        testObj['submitDate'] = endDate;
        const result = await this.evaluationModel.findOne({ uuid: code })
            .populate({ path: 'test' }).populate({ path: 'profile' }).exec();
        if (result.status === 'started') {
            if (result.test['type'] === 'algo') {
                testObj['status'] = 'finished';
                const result2 = await this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
                return result2;
            }
        } else {
            return { message: 'error' };
        }
    }
    async findOneByCodeToSubmitQuiz(code, testObj): Promise<any> {
        const endDate = Number.parseInt(Date.now().toString());
        testObj['submitDate'] = endDate;
        const result = await this.evaluationModel.findOne({ uuid: code })
            .populate({ path: 'test' }).populate({ path: 'profile' }).exec();
        if (result.status === 'started') {
            if (result.test['type'] === 'quiz') {
                const profileAnswers = testObj['answers'];
                const as = result.test['quizAnswers'];
                let profileTotalAnswersCounter = 0;
                let profileCorrectAnswersCounter = 0;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < Object.keys(as).length; i++) {
                    const a = as[i];
                    if (profileAnswers[i] === 0 || profileAnswers[i]) {
                        profileTotalAnswersCounter++;
                        if (profileAnswers[i] === a) {
                            // console.log('correct answer ', profileAnswers[i], as[i] ,  i);
                            profileCorrectAnswersCounter++;
                        } else {
                            // console.log('wrong answer ', profileAnswers[i], as[i], i);

                        }
                    }
                }
                testObj['status'] = 'finished';
                testObj['resultPercent'] = Math.round(profileCorrectAnswersCounter * 100 / as.length);
                testObj['correctAnswers'] = profileCorrectAnswersCounter;
                testObj['ProfileAnswers'] = profileAnswers;
                testObj['profileTotalAnswers'] = profileTotalAnswersCounter;
                const result2 = await this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
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
                    html: HtmlContent.evalResult(result['test']['title'], `${testObj['resultPercent']} %`, `${result['profile']['name']} ${result['profile']['lastname']}`),
                });
                // console.log(emailsToSend);
                this.sendEmailsEvalInvitations(emailsToSend);

                return result2;
            }
        } else {
            return { message: 'error' };
        }
    }
    async findOneByCodeToSubmitHybrid(code, testObj): Promise<any> {
        const endDate = Number.parseInt(Date.now().toString());
        testObj['submitDate'] = endDate;
        const result = await this.evaluationModel.findOne({ uuid: code })
            .populate({ path: 'test' }).populate({ path: 'profile' }).exec();
        if (result.status === 'started') {
            if (result.test['type'] === 'hybrid') {
                const profileAnswers = testObj['answers'];
                const as = result.test['correctAnswer'];
                let profileTotalAnswersCounter = 0;
                let profileCorrectAnswersCounter = 0;
                const correctCode = [];
                if (as) {
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < result.test['hybrid'].length; i++) {
                        if (result.test['hybrid'][i].typeQuestion === 'quiz') {
                            const a = as[i];
                            if (profileAnswers[i] === 0 || profileAnswers[i]) {
                                profileTotalAnswersCounter++;
                                if (profileAnswers[i].toString() === a) {
                                    profileCorrectAnswersCounter++;
                                }
                            }
                        } else {
                            profileTotalAnswersCounter++;
                            const result3 = await this.runCode(profileAnswers[i]);
                            if (await result3.includes(result.test['hybrid'][i].resultValue)) {
                                profileCorrectAnswersCounter++;
                                correctCode[i] = 'true';
                            } else {
                                correctCode[i] = 'false';
                            }
                        }
                    }
                } else {
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < result.test['hybrid'].length; i++) {
                        profileTotalAnswersCounter++;
                        const result3 = await this.runCode(profileAnswers[i]);
                        if (await result3.includes(result.test['hybrid'][i].resultValue)) {
                            profileCorrectAnswersCounter++;
                            correctCode[i] = 'true';
                        } else {
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
                const result2 = await this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();
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
                    html: HtmlContent.evalResult(result['test']['title'], `${testObj['resultPercent']} %`, `${result['profile']['name']} ${result['profile']['lastname']}`),
                });
                // console.log(emailsToSend);
                this.sendEmailsEvalInvitations(emailsToSend);

                return result2;
            }
        } else {
            return { message: 'error' };
        }
    }
    async runCode(text: Evaluation): Promise<any> {
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
        /*--------------------------------DEMON-KILLER-BEGIN----------------------------------------*/
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
        /*--------------------------------DEMON-KILLER-END----------------------------------------*/
        await fs.mkdirp(path.dirname(file));
        switch (text.language) {
            case 'javascript':
                content = `var start = +new Date();

${text.text}
var end = +new Date();
console.log("Process took " + (end-start) + " milliseconds");
`;
                parallel.parallel({
                    one: async (callback) => {
                        await fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                        child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, `${Tfile}.js`]);
                        callback(null, child3.stdout.toString());
                    },
                    two: async (callback) => {
                        await fs.writeFile(file, content);
                        child = childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name`, `${timestamp}`, `--cpus=.08`, '-v', `${temporaryDir}:/usr/src/app`, '-w', '/usr/src/app', 'node:8', 'node', `${temporaryFile}`, 'hello']);
                        if (child.stdout.toString().length === 0) {
                            callback(null, 'error in your code');
                        }
                    },
                }, (err, results) => {
                    if (err) throw err;
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
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
                parallel.parallel({
                    one: async (callback) => {
                        await fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                        child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, 'node', `${Tfile}.js`, '-i', 'max']);
                        callback(null, child3.stdout.toString());
                    },
                    two: async (callback) => {
                        await fs.writeFile(file, content);
                        child = childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name=${timestamp}`, '-v', `${temporaryDir}:/home`, 'php:cli', 'php', `/home/${temporaryFile}`, 'hello']);
                        if (child.stdout.toString().length === 0) {
                            callback(null, 'error in your code');
                        }
                    },
                }, (err, results) => {
                    if (err) throw err;
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                    consoleOut = results.two;
                    console.log(results.two);
                });

                break;
            case 'JAVA':
                content = `${text.text}`;
                parallel.parallel({
                    one: async (callback) => {
                        await fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                        child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, 'node', `${Tfile}.js`, '-i', 'max']);
                        callback(null, child3.stdout.toString());
                    },
                    two: async (callback) => {
                        const filejava = path.join(temporaryDir, 'Main.java');
                        await fs.writeFile(filejava, content);
                        child2 = await childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name=java${timestamp}`, '-v', `${temporaryDir}:/usr/src/hello-docker`, '-w', `/usr/src/hello-docker`, 'openjdk:8', 'javac', `Main.java`]);
                        child = await childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/usr/src/hello-docker`, '-w', `/usr/src/hello-docker`, 'openjdk:8', 'java', `Main`]);
                        if (child.stdout.toString().length === 0 || child2.stdout.toString() === 0) {
                            callback(null, 'error in your code');
                        }
                    },
                }, (err, results) => {
                    if (err) throw err;
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                    consoleOut = results.two;
                    console.log(results.two);
                });
                // docker run --rm -v "$PWD":/usr/src/hello-docker -w /usr/src/hello-docker openjdk:8 javac HelloDocker.java
                // docker run --rm -v "$PWD":/usr/src/hello-docker -w /usr/src/hello-docker openjdk:8 java HelloDocker
                break;
            case 'Python':
                content = `import os
from datetime import datetime
start_time = datetime.now()
${text.text}
time_elapsed = datetime.now() - start_time
print('Process took {}'.format(time_elapsed))
        `;
                parallel.parallel({
                    one: async (callback) => {
                        await fs.writeFileSync(`${Tfile}.js`, DemonKiller);
                        child3 = childP.spawnSync('sudo', ['pm2', 'start', '--no-autorestart', `--name=${timestamp}`, 'node', `${Tfile}.js`, '-i', 'max']);
                        callback(null, child3.stdout.toString());
                    },
                    two: async (callback) => {
                        await fs.writeFile(file, content);
                        child = childP.spawnSync('sudo', ['docker', 'run', '--rm', `--name=${timestamp}`, '-v', `${temporaryDir}:/app`, '-w', '/app', 'iron/python:2', 'python', `${temporaryFile}`]);
                        if (child.stdout.toString().length === 0) {
                            callback(null, 'error in your code');
                        }
                    },
                }, (err, results) => {
                    if (err) throw err;
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                    consoleOut = results.two;
                    console.log(results.two);
                });
                break;
            default:
                return 'error';
            // child = childP.spawnSync('node', [temporaryDir + temporaryFile]);
            // break;
        }
        await fs.remove(path.join('/home/adminubuntu/portal/back' + `/${timestamp}`));

        if (child2) {

            if (child2.stdout !== undefined) { consoleOut += child2.stdout.toString(); }
            if (child2.error !== undefined) { consoleOut += child2.error.toString(); }
            if (child2.stderr !== undefined) { consoleOut += child2.stderr.toString(); }
        }
        if (child.stdout !== undefined) { consoleOut += child.stdout.toString(); }
        if (child.error !== undefined) { consoleOut += child.error.toString(); }
        if (child.stderr !== undefined) { consoleOut += child.stderr.toString(); }
        return consoleOut;

    }

    async createResultEmail(emails) {
        const messages = [];
        emails.forEach(emailReq => {
            const message = {
                from: 'fivepoints@mailer4.fivepoints.fr',
                replyTo: 'contact@fivepoints.fr',
                to: emailReq.email,
                subject: emailReq.title,
                html: HtmlContent.EvalInvitation(emailReq.title, emailReq.link, emailReq.profilename),
            };
            messages.push(message);
        });
        // console.log(messages.length);
        this.sendEmailsEvalInvitations(messages);
    }
    async sendEmailsEvalInvitations(messages) {
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
        this.transporter = await nodemailer.createTransport(smtpMyMailConfig, {
            pool: true,
        });
        await this.transporter.on('idle', async () => {
            while (this.transporter.isIdle() && messages.length) {
                await this.transporter.sendMail(messages.shift(), (error, info) => {
                    if (error) {
                       console.log(error);
                    }
                    console.log(info);
                });
            }
        });
    }

}
