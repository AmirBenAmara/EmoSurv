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
import { ContactSchema } from './schemas/contact.schema';
import { CompanySchema } from '../companies/schemas/company.schema';
import { LinkSchema } from './schemas/link.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Campaign', schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'Contacts', schema: ContactSchema }]),    
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }]),
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
