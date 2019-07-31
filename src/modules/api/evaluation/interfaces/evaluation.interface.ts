import { Document } from 'mongoose';

export interface Evaluation extends Document {
  readonly language: string;
  readonly text: string;
  readonly outputCode: string;
  profile: object;
  test: object;
  pool: object;
  readonly submitDate: number;
  // TODO: return this to a readonly
  startedDate: number;
  readonly resultCode: string;
  readonly timeOutOfTabPerQuestion: object;
  readonly timeSpentPerQuestion: object;
  createdDate: number;
  readonly profileTotalAnswers: number;
  readonly profileAnswers: object;
  readonly outOfTab: string;
  readonly consoleOutput: string;
  readonly testOutput: string;
  companySchema: object;
  algo: [object];
  candidateDescription: string;
  link_github: string;
  uuid: string;
  status: string;
  createdBy: string;
}
