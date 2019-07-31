import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pool } from './interfaces/pool.interface';
import { PoolSchema } from './schemas/pool.schema';


@Injectable()
export class PoolsService {
  constructor(@InjectModel(PoolSchema) private readonly poolModel: Model<Pool>) { }

  async create(pool: Pool): Promise<Pool> {
    const createdPool = new this.poolModel(pool);
    return await createdPool.save();
  }

  async findAll(): Promise<Pool[]> {
    return await this.poolModel.find().populate('profiles profile').exec();
  }

  async findAllLanding(): Promise<Pool[]> {
    return await this.poolModel.find({}, { title: 1, uniqueName: 1, startDate: 1, endDate: 1, Nhours: 1 }).exec();
  }

  async registerProfile(poolid: any, profileid: string): Promise<Pool> {
    return await this.poolModel.findOneAndUpdate({ _id: poolid }, { $push: { registred: profileid } }).exec();
  }

  async findByIdLanding(id): Promise<Pool> {
    return await this.poolModel.findById({ _id: id }, { title: 1, uniqueName: 1, startDate: 1, endDate: 1, Nhours: 1 }).exec();
  }

  async findOne(id): Promise<Pool> {
    return await this.poolModel.findById({ _id: id });
  }

  // async findPool(pool: Pool): Promise<any> {
  //   console.log(pool);
  //   const res = await this.poolModel.findOne({ email: pool.email }).exec();
  //   const res2 = await res.comparePassword(pool.password, res.password);
  //    if (!res2) { return; }
  //   return this.createToken(res);
  // }

  // async createToken(pool: Pool) {
  //   const expiresIn = 3600;
  //   console.log(expiresIn);

  //   return {

  //     accessToken: jwt.sign({ data: pool, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, 'secretKey'),

  //   };
  // }

  // async validatePool(payload: any): Promise<any> {
  //    return await this.poolModel.findOne({ email: payload.data.email, pass: payload.data.pass }).exec();
  //   // if (!res) { return false; }
  //   // return true;
  //   // return this.createToken(payload);
  //   // put some validation logic here
  //   // for example query pool by id/email/poolname

  // }
}
