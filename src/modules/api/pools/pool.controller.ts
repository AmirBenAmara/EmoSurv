import { Controller, Get, Post, Body, UseInterceptors, UnauthorizedException, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { Pool } from './interfaces/pool.interface';
import { PoolsService } from './pool.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('pools')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class PoolsController {

  constructor(private readonly poolsService: PoolsService) { }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post()
  async create(@Body() pool: Pool) {
    this.poolsService.create(pool);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Pool[]> {
    return this.poolsService.findAll();
  }

  @Get('landing')
  async findAllLanding(): Promise<Pool[]> {
    return this.poolsService.findAllLanding();
  }

  @Get('landing/:id')
  async findByIdLanding(@Param('id', new ParseIntPipe()) id): Promise<Pool> {
    return this.poolsService.findByIdLanding(id);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get(':id')
  async findone(@Param('id', new ParseIntPipe()) id): Promise<Pool> {
    return this.poolsService.findOne(id);
  }
}
