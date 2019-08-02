import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './interfaces/group.interface';
import { GroupSchema } from './schemas/group.schema';
import { Evaluation } from '../evaluation/interfaces/evaluation.interface';
import { EvaluationSchema } from '../evaluation/schemas/evaluation.schema';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(GroupSchema) private readonly groupModel: Model<Group>,
              @InjectModel(EvaluationSchema) private readonly evalModel: Model<Evaluation>) { }

   async getGroupsById(id) {
        return this.groupModel.find({company: id}).populate('tests Test profiles Profile evaluations Evaluation').exec();
   }
   async addProfileToGroup(idProfile, idGroup) {
       return this.groupModel.findByIdAndUpdate(idGroup, {$push: {profiles: idProfile}}).exec();
   }
   async addTestToGroup(idTest, idGroup) {
    return this.groupModel.findByIdAndUpdate(idGroup, {$push: {tests: idTest}}).exec();
   }
   async createEvalInGroup(evaluation, idGroup) {
    return this.groupModel.findByIdAndUpdate(idGroup, {$push: {tests: evaluation.test}}).exec();
   }
}
