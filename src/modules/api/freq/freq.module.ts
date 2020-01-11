import { Module } from '@nestjs/common';


import { MongooseModule } from '@nestjs/mongoose';
import { FreqController } from './freq.controller';
import { FreqService } from './freq.service';
import { FreqSchema } from './schemas/freq.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Freq', schema: FreqSchema }])],
    controllers: [FreqController],
    providers: [FreqService],
  })
export class FreqModule {}



