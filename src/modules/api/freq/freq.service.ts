import { Injectable } from '@nestjs/common';
import { Freq } from './interfaces/freq.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FreqSchema } from './schemas/freq.schema';



@Injectable()
export class FreqService {
    constructor(@InjectModel(FreqSchema) private readonly freqModel: Model<Freq>) { }

    async create(freq: Freq): Promise<Freq> {
        const createdFreq = new this.freqModel(freq);
        return await createdFreq.save();


    }

    async findAll(): Promise<Freq[]> {
        return await this.freqModel.find().exec();
    }

}

