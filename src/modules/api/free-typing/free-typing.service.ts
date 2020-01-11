import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FreeTyping } from './interfaces/free-typing.interface';
import { FreeTypingSchema } from './schemas/free-typing.schema';

@Injectable()
export class FreeTypingService {
  constructor(@InjectModel(FreeTypingSchema) private readonly freeTypingModel: Model<FreeTyping>) { }

  async create(freeTyping: FreeTyping[]): Promise<FreeTyping[]> {

    var listElements =[];
    var ind = 0;
    try {
        var lastElement: any = await this.freeTypingModel.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
        
        if (lastElement.index) {
            ind = lastElement.index + 1 ;
        } else {
            ind = 1;
        }
       
    }
    catch (error) { 
        ind =1;
    }

    freeTyping.forEach(tt => {
        tt.index = ind++;
    });

    freeTyping.forEach(async tt => {
        
        const createdfreeTyping = new this.freeTypingModel(tt);
        listElements.push(await createdfreeTyping.save()) ;
    }) ; 

    return listElements;
}

  async findAll(): Promise<FreeTyping[]> {
    return await this.freeTypingModel.find().exec();
  }

}

