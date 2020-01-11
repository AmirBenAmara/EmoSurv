import { Document } from 'mongoose';

export interface TextTyping extends Document {
    userId: String;
    emotionIndex: String;
    index: Number;
    keyCode: String;
    keyDown: String;
    keyUp: String;
    D1U1: String;
    D1U2: String;
    D1D2: String;
    U1D2: String;
    U1U2: String;
    D1U3: String;
    D1D3: String;
    answer : String;
}
