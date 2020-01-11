import { Controller, Get, Post, Body, } from '@nestjs/common';
import { FreqService } from './freq.service'
import { Freq } from './interfaces/freq.interface'

@Controller('freq')
export class FreqController {

    constructor(private readonly freqService: FreqService) { }

    @Post()
    async create(@Body() freq: Freq) {

        await this.freqService.create(freq);
    }

    @Get()
    async getAll(): Promise<Freq[]> {
        return this.freqService.findAll();
    }

}
