import { Document } from 'mongoose';

export interface Test extends Document {

  readonly title: string;
  readonly duration: number;
  readonly description: string;
  readonly testValue: string;
  readonly resultValue: string;
  readonly resultValueJavascript: string;
  readonly resultValueJava: string;
  readonly resultValuePython: string;
  createdDate: number;
  readonly resultValuePhp: string;
  readonly executeValue: string;
  readonly outputCode: string;
  readonly language: string;
  readonly tests: [object];
  readonly type: string;
  readonly languages: [string];
  readonly quizes: [object];
  readonly author: string;
  readonly owner: string;
  readonly hybrid: [object];
  readonly correctAnswer: [object];
  readonly algo: [object];
  readonly project: object;
  taken: string;
}
