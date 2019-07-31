import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { EvaluationSchema } from './schemas/evaluation.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import * as passport from 'passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { TestSchema } from './schemas/test.schema';
import { ProfileSchema } from '../profiles/schemas/profile.schema';
import { PoolSchema } from '../pools/schemas/pool.schema';
import { ProfilesService } from '../profiles/profile.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { CompanySchema } from '../companies/schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Evaluation', schema: EvaluationSchema }]),
    MongooseModule.forFeature([{ name: 'Test', schema: TestSchema }]),
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: 'Pool', schema: PoolSchema }]),
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {

  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
