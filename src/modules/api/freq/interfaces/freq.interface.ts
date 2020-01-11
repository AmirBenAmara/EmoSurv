import { Document } from 'mongoose';

export interface Freq extends Document {
    userid: String;
    textIndex: String;
    emotionIndex: String;
    delFreq: Number;
    leftFreq: Number;
    time : Number;
}
