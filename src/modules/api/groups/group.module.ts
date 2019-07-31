import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './schemas/group.schema';
import { GroupsService } from './group.service';
import { GroupsController } from './group.controller';
import { EvaluationSchema } from '../evaluation/schemas/evaluation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),
            MongooseModule.forFeature([{ name: 'Evaluation', schema: EvaluationSchema }])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {
  // configure(consumer: MiddlewaresConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  //   // consumer
  //   //   .apply(passport.authenticate('jwt', { session: false }))
  //   //   .forRoutes('*');
  // }
}
