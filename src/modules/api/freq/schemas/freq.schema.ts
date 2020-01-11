
import {  Schema , Model } from 'mongoose';


export const freqSchema: Schema = new Schema({
  userid: String,
  textIndex : String,
  emotionIndex: String,
  delFreq: Number,
  leftFreq: Number,
  time : Number,
 
});


export const FreqSchema = freqSchema;
