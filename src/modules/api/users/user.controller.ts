import { Controller, Get, Post, Body, UseInterceptors, UnauthorizedException, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UsersService } from './user.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { UsersModule } from './users.module';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() user: User) {
    this.usersService.create(user);
  }

  @Post('register')
  async register(@Body() user: User) {
    this.usersService.create(user);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


}
