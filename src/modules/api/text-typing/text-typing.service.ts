import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextTyping } from './interfaces/text-typing.interface';
import { TextTypingSchema } from './schemas/text-typing.schema';

@Injectable()
export class TextTypingService {
    constructor(@InjectModel(TextTypingSchema) private readonly textTypingModel: Model<TextTyping>) { }

    async create(textTyping: TextTyping[]): Promise<TextTyping[]> {
        var listElements =[];
        var ind =0;
        try {
            var lastElement: any = await this.textTypingModel.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
            
            if (lastElement.index) {
                ind = lastElement.index + 1;
            } else {
                ind = 1;
            }
           
        }
        catch (error) { 
            ind =1;
        }

        textTyping.forEach(tt => {
            tt.index = ind++;
        });
//mongoose
        textTyping.forEach(async tt => {
            
            const createdtextTyping = new this.textTypingModel(tt);
            listElements.push(await createdtextTyping.save()) ;
        }) ; 

        return listElements;
    }

    async findAll(): Promise<TextTyping[]> {
        return await this.textTypingModel.find().exec();
    }

}

