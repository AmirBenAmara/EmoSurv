import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';
import { ProfileSchema } from './schemas/profile.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import * as passport from 'passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { CompanySchema } from '../companies/schemas/company.schema';
import { EvaluationService } from '../evaluation/evaluation.service';
import { EvaluationModule } from '../evaluation/evaluation.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }, {name: 'Company', schema: CompanySchema }])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {

  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
