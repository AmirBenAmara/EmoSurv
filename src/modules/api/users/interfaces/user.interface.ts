import { Document } from 'mongoose';

export interface User extends Document {
  userId : string;
  typeWith: string;
  typistType: string;
  pcTimeAverage: string;
  ageRange : string;
  gender : string;
  status :string;
  degree :string;
  country : string;
 
}
