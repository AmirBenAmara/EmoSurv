import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';
import { Request } from '@nestjs/common';

export const testSchema: Schema = new Schema({

  title: String,
  duration: Number,
  description: String,
  testValue: String,
  resultValue: String,
  createdDate: Number,
  resultValueJavascript:  String,
  resultValueJava:  String,
  resultValuePython:  String,
  resultValuePhp:  String,
  executeValue: String,
  outputCode: String,
  algo: [{exercice: String, resultCandidate: {type: String, default: ''}}],
  project: {
    projectContent: String,
    candidateDescription: String,
    link_github: { type: String},
  },
  taken: {type: String, enum: ['Taken', 'Not taken'], default: 'Not taken'},
  languages: [{
    type: String,
    enum: ['javascript', 'PHP', 'Python', 'JAVA'],
  }],
  language: String,
  tests: [{
    input: String,
    output: String,
  }],
  type: { type: String, enum: ['quiz', 'code', 'hybrid', 'project', 'algo'] },
  quizes: [{ question: String, answers: [String] }],
  quizAnswers: [Number],
  hybrid: [{
        question: String,
        answers: [String],
        description: String,
        language: String,
        outputCode: String,
        testValue: String,
        resultValue: String,
        executeValue: String,
        typeQuestion: String,
      }],
  correctAnswer: Object,
  status: {type: String, enum: ['created', 'deleted'], default: 'created'},
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  owner: { type: Schema.Types.ObjectId, ref: 'Company' },
});

export const TestSchema = testSchema;
