import { Document } from 'mongoose';
import { Pool } from '../../pools/interfaces/pool.interface';

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
  newsLetter: boolean;
}
