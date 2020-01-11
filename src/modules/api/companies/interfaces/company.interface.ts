import { Document } from 'mongoose';

export interface Company extends Document {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address: object;
  readonly foundYear: string;
  readonly size: string;
  readonly website: string;
  readonly socials: [object];
  readonly requests: [object];
  readonly profiles: [object];
  readonly contacts: [object];
  readonly templates: [object];
  readonly campaigns: [object];
  newsLetter: boolean;
}
