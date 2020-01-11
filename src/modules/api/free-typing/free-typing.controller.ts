import { Controller, Get, Post, Body, } from '@nestjs/common';
import { FreeTypingService } from './free-typing.service'
import { FreeTyping } from './interfaces/free-typing.interface'


@Controller('free-typing')
export class FreeTypingController {

    constructor(private readonly freeTypingService: FreeTypingService) { }

    @Post()
    async create(@Body() freeTyping: FreeTyping[]) {
        
        console.log(freeTyping);

        

            await  this.freeTypingService.create(freeTyping);
    
    }

    


    @Get()
    async getAll(): Promise<FreeTyping[]> {
        return this.freeTypingService.findAll();
    }

}
