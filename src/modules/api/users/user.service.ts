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

  async findUser(user: User): Promise<any> {
    const res = await this.userModel.findOne({ userName: user.userName }).exec();
    if (!res) {
      return {message: 'User not found'};
    }
    const res2 = await res.comparePassword(user.password, res.password);
    // const res = await user.comparePassword(user.password);
    if (!res2) {
      return {message: 'Wrong Password'};
    }
    return this.createToken(res);
  }
  async checkUsername(userName) {
    const res = await this.userModel.findOne({userName}).exec();
    if (res) {
      return {message: true};
    }
    return {message: false};
  }

  async createToken(user: User) {
    const expiresIn = 3600;

    return {
      message: 'OK',
      accessToken: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, 'secretKey'),

    };
  }
  async updatePassword(obj) {
    const res = await this.userModel.findOne({ email: obj.email }).exec();
    if (!res) {
      return { message: 'User not found' };
    }
    /*const ValidatePassword = await res.comparePassword(obj.oldPassword, res.password);
    if (!ValidatePassword) {
      return { message: 'Wrong Password' };
    }*/
    const test = await res.comparePassword(obj.oldPassword, res.password);
    if (test)
    {
      res.password = await bcrypt.hashSync(obj.newPassword, 10);

      const res2 = await this.userModel.findByIdAndUpdate({ _id: res._id }, { $set: res });
      return this.createToken(res);
    } else {
     return { message: 'your password is wrong'};
    }
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
