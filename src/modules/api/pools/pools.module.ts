import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoolsController } from './pool.controller';
import { PoolsService } from './pool.service';
import { PoolSchema } from './schemas/pool.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import * as passport from 'passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Pool', schema: PoolSchema }])],
  controllers: [PoolsController],
  providers: [PoolsService],
})
export class PoolsModule {
  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
