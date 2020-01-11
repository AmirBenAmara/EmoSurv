import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserSchema) private readonly userModel: Model<User>) { }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id): Promise<User> {
    return await this.userModel.findById({ _id: id });
  }

  
  async createToken(user: User) {
    const expiresIn = 3600;

    return {
      message: 'OK',
      accessToken: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, 'secretKey'),

    };
  }
 
  async validateUser(payload: any): Promise<any> {
    // console.log(payload);
    // return true;
    return await this.userModel.findOne({ email: payload.data.email, pass: payload.data.pass }).exec();
    // if (!res) { return false; }
    // return true;
    // return this.createToken(payload);
    // put some validation logic here
    // for example query user by id/email/username

  }
}
