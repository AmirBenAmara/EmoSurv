import { Controller, Get, Post, Body, UseInterceptors, UnauthorizedException, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { GroupsService } from './group.service';

@Controller('groups')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class GroupsController {

  constructor(private readonly groupsService: GroupsService) { }

}
