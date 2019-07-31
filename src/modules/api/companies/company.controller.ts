import { HttpStatus } from '@nestjs/common/enums';
import { Res, Req, HttpCode } from '@nestjs/common/decorators/http';
// tslint:disable-next-line:max-line-length
import { Controller, Get, Post, Body, UseInterceptors, UnauthorizedException, UseGuards, ParseIntPipe, Param, FileInterceptor, UploadedFile, Response, Request } from '@nestjs/common';
import { Company } from './interfaces/company.interface';
import { CompaniesService } from './company.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { identity } from 'rxjs';

@Controller('api/companies')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CompaniesController {

  constructor(private readonly companiesService: CompaniesService) { }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post()
  async create(@Body() company: Company) {
    this.companiesService.create(company);
  }
  @Get('checkEmail/:email')
  async checkEmail(@Param() email) {
   return  this.companiesService.checkEmail(email);
  }
  @Post('updateRoleUser/:idUser/:role')
  async updateRoleUser(@Param('idUser') idUser, @Param('role') role) {
   return  this.companiesService.updateRoleUser(idUser, role);
  }
  @Get('approveAccount/:random/:user')
  async verify(@Param('random') randonId, @Param('user') idUser) {
      const result = await this.companiesService.checkKey(randonId, idUser);
      if (result) {
          return { msg: 'success' };
      }
      return { msg: 'fail' };

  }
  @Get('resendEmail/:email')
  async resendEmail(@Param('email') email) {
      const result = await this.companiesService.resendEmail(email);
      if (result) {
          return { msg: 'success' };
      }
      return { msg: 'fail' };

  }
  @Get('checkCompanyName/:companyName')
  async checkCompanyName(@Param() companyName) {
    return this.companiesService.checkCompanyName(companyName);
  }

  @Post('addNewUser')
  async createUser(@Body() user) {
   return this.companiesService.createUser(user);
  }
  @Post('updateCompany/:id')
  async updateCompany(@Param('id') id, @Body() company) {
    this.companiesService.updateOne(id, company);
  }
  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get()
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }
  @Get('findAllAdmin')
  async findAllAdmin(): Promise<Company[]> {
    return this.companiesService.findAllAdmin();
  }
  @Get('/:country')
  async findAllByCountry(@Param('country') country): Promise<Company[]> {
    return this.companiesService.findAllByCountry(country);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get('getConnected/:id')
  async findone(@Param('id') id): Promise<Company> {
    return this.companiesService.findOne(id);
  }
  @Get('usersComapny/:id')
  async usersComapny(@Param('id') id): Promise<Company> {
    return this.companiesService.usersComapny(id);
  }
  @Post('deleteUserComapny/:idUser/:idCompany')
  async deleteUserComapny(@Param('idUser') idUser, @Param('idCompany') idCompany): Promise<Company> {
    return this.companiesService.deleteUserComapny(idUser, idCompany);
  }

}
