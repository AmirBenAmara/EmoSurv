import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

import { FreeTypingModule } from './free-typing/free-typing.module';
import { TextTypingModule } from './text-typing/text-typing.module';
import { FreqController } from './freq/freq.controller';
import { FreqModule } from './freq/freq.module';


@Module({
  // tslint:disable-next-line:max-line-length
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/emosurv'), UsersModule, FreeTypingModule, TextTypingModule, FreqModule],
  
})
export class ApiModule { }
