import { HttpStatus } from '@nestjs/common/enums';
import { Res, Req, HttpCode } from '@nestjs/common/decorators/http';
// tslint:disable-next-line:max-line-length
import { Controller, Get, Post, Put, Body, UseInterceptors, UnauthorizedException, UseGuards, ParseIntPipe, Param, FileInterceptor, UploadedFile, Response, Request } from '@nestjs/common';
import { Evaluation } from './interfaces/evaluation.interface';
import { EvaluationService } from './evaluation.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Test } from './interfaces/test.interface';

@Controller('api/evaluation')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class EvaluationController {

  constructor(private readonly evaluationService: EvaluationService) { }

  // @UseGuards(AuthGuard('jwt', ['admin', 'company', 'manager']))
  @Post()
  async createEvaluation(@Body() evaluation: Evaluation[]) {
    return this.evaluationService.createEvaluation(evaluation);
  }
  @Get('statProfile/:id/:idCompany')
  async getStatsprofiles(@Param('id') id, @Param('idCompany') idCompany) {
    return this.evaluationService.getStatsprofiles(id, idCompany);
  }
  @Get('statProfileAdmin/:id')
  async getStatsprofilesAdmin(@Param('id') id) {
    return this.evaluationService.getStatsprofilesAdmin(id);
  }
  @Get('findAllTestsByCompany/:id')
  async findAllTestsByCompany(@Param('id') id) {
    return this.evaluationService.findAllTestsByCompany(id);
  }
  @Get('statOtherProfile/:id')
  async getStatsOtherprofiles(@Param('id') id) {
    return this.evaluationService.getStatsOtherprofiles(id);
  }
  @Get('takeProfile/:id/:idCompany')
  async takeProfile(@Param('id') id, @Param('idCompany') idComapny) {
    return this.evaluationService.takeProfile(id, idComapny);
  }
  @Post('test')
  async createTest(@Body() test: Test) {
    this.evaluationService.createTest(test);
  }
  @Post('takeTest/:id')
  async takeTest(@Param('id') id, @Body() test: Test) {
    this.evaluationService.takeTest(test, id);
  }

  @Put('test/:id')
  async updateTest(@Body() test: Test, @Param('id') id) {
    return this.evaluationService.updateTest(id, test);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get()
  async findAllEvaluations(): Promise<Evaluation[]> {
    return this.evaluationService.findAllEvaluations();
  }

  @Get('test')
  async findAllTests(): Promise<Test[]> {
    return this.evaluationService.findAllTests();
  }
  @Get('otherTest/:id')
  async findOtherTests(@Param('id') id): Promise<Test[]> {
    return this.evaluationService.findOtherTests(id);
  }
  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get('pass/:code')
  async findOneEvaluationsByCode(@Param('code') code): Promise<Evaluation> {
    return this.evaluationService.findOneByCode(code);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get('start/:code')
  async findOneEvaluationsByCodeToStart(@Param('code') code): Promise<Evaluation> {
    return this.evaluationService.findOneByCodeToStart(code);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post('submit/:code')
  async findOneByCodeToSubmit(@Param('code') code, @Body() body): Promise<Evaluation> {
    return this.evaluationService.findOneByCodeToSubmit(code, body);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post('quiz/:code')
  async findOneByCodeToSubmitQuiz(@Param('code') code, @Body() body): Promise<Evaluation> {
    return this.evaluationService.findOneByCodeToSubmitQuiz(code, body);
  }
  @Post('algo/:code')
  async findOneByCodeToSubmitAlgo(@Param('code') code, @Body() body): Promise<Evaluation> {
    return this.evaluationService.findOneByCodeToSubmitAlgo(code, body);
  }
  @Post('hybrid/:code')
  async findOneByCodeToSubmitHybrid(@Param('code') code, @Body() body): Promise<Evaluation> {
    return this.evaluationService.findOneByCodeToSubmitHybrid(code, body);
  }
  @Post('project/:code')
  async findOneByCodeToSubmitProject(@Param('code') code, @Body() body): Promise<Evaluation> {
    return this.evaluationService.findOneByCodeToSubmitProject(code, body);
  }

  @Post('run')
  async run(@Body() code: Evaluation) {
    return await this.evaluationService.runCode(code);
  }

  @Post('deleteTest/:id')
  async deleteTest(@Param('id') id): Promise<any> {
    return await this.evaluationService.deleteTest(id);
  }

}
