
import {  Schema , Model } from 'mongoose';


export const freeTypingSchema: Schema = new Schema({
  userid: String,
  emotionIndex: String,
  index: Number,
  keyCode: String,
  keyDown: String,
  keyUp: String,
  D1U1: String,
  D1U2: String,
  D1D2: String,
  U1D2: String,
  U1U2: String,
  D1U3: String,
  D1D3: String,
  answer : String,
});


export const FreeTypingSchema = freeTypingSchema;
