import { Controller, Get, Post, Body, } from '@nestjs/common';
import { TextTypingService } from './text-typing.service'
import { TextTyping } from './interfaces/text-typing.interface'


@Controller('text-typing')
export class TextTypingController {

    constructor(private readonly textTypingService: TextTypingService) { }

    @Post()
    async create(@Body() textTyping: TextTyping[]) {
       console.log(textTyping);
        this.textTypingService.create(textTyping);   

    }

    @Get()
    async getAll() {
        return this.textTypingService.findAll();
    }

}
