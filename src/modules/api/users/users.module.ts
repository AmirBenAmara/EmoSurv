import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserSchema } from './schemas/user.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import * as passport from 'passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {
  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
