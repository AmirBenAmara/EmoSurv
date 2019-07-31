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

  @Post('login')
  async login(@Body() user: User) {
    return this.usersService.findUser(user);
  }

  @Post('register')
  async register(@Body() user: User) {
    this.usersService.create(user);
  }
  @Get('checkUserName/:username')
  async checkUserName(@Param('username') unsername) {
    return this.usersService.checkUsername(unsername);
  }

  
  @Post('updatePassword')
  async updatePassword(@Body() object) {
    return this.usersService.updatePassword(object);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findone(@Param('id', new ParseIntPipe()) id): Promise<User> {
    return this.usersService.findOne(id);
  }
}
