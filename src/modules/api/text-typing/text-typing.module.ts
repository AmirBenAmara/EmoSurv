import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TextTypingController } from './text-typing.controller';
import { TextTypingService } from './text-typing.service';
import { TextTypingSchema } from './schemas/text-typing.schema';



@Module({
    imports: [MongooseModule.forFeature([{ name: 'TextTyping', schema: TextTypingSchema }])],
    controllers: [TextTypingController],
    providers: [TextTypingService],
  })
export class TextTypingModule {}

