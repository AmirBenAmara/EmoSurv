import { Schema } from 'mongoose';

export const linkSchema: Schema = new Schema({
  url: String,
  openedTimes: {type:Number,default:0},
  

});

export const LinkSchema = linkSchema;