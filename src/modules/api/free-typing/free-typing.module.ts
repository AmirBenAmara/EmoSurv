import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { FreeTypingController } from './free-typing.controller';
import { FreeTypingService } from './free-typing.service';
import { FreeTypingSchema } from './schemas/free-typing.schema';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'FreeTyping', schema: FreeTypingSchema }])],
    controllers: [FreeTypingController],
    providers: [FreeTypingService],
  })
export class FreeTypingModule {}



