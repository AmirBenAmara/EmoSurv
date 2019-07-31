import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './company.controller';
import { CompaniesService } from './company.service';
import { CompanySchema } from './schemas/company.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import * as passport from 'passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { UserSchema } from '../users/schemas/user.schema';
import { SettingsSchema } from '../settings/schemas/settings.shema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
            MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
            MongooseModule.forFeature([{ name: 'Setting', schema: SettingsSchema }])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {

  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
