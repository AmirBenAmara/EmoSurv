import { Document } from 'mongoose';

export interface Setting extends Document {

     readonly userId: string;
     readonly verifCode: string;
}