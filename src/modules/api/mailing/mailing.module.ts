import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { CampaignSchema } from './schemas/campaign.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import * as passport from 'passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { TemplateSchema } from './schemas/template.schema';
import { MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Campaign', schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
   ],
  controllers: [MailingController],
  providers: [MailingService],
})
export class MailingModule {

  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
