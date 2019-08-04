import { Controller, Get, Post, Put, Body, UseInterceptors, UseGuards, Param, Delete, Res } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Campaign } from './interfaces/campaign.interface';
import { Template } from './interfaces/template.interface';
import * as fs from 'fs';
@Controller('api/mailing')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class MailingController {

  constructor(private readonly mailingService: MailingService) { }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get('campaign')
  async findAllCampaigns(): Promise<Campaign[]> {
    return this.mailingService.findAllCampaigns();
  }

  @Get('template')
  async findAllTemplates(): Promise<Template[]> {
    return this.mailingService.findAllTemplates();
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post('campaign')
  async createCampaign(@Body() campaign: Campaign) {
    return this.mailingService.createCampaign(campaign);
  }

  @Post('template')
  async createTemplate(@Body() template: Template) {
    return this.mailingService.createTemplate(template);
  }

  @Put('template/:id')
  async updateTemplate(@Body() template: Template, @Param('id') id) {
    return this.mailingService.updateTemplate(id, template);
  }

  @Put('campaign/:id')
  async updateCampaign(@Body() campaign: Campaign, @Param('id') id) {
    return this.mailingService.updateCampaign(id, campaign);
  }

  @Delete('template/:id')
  async deleteTemplate(@Param('id') id) {
    return this.mailingService.deleteTemplate(id);
  }

  @Delete('campaign/:id')
  async deleteCampaign(@Param('id') id) {
    return this.mailingService.deleteCampaign(id);
  }


  @Get('track/:uuid')
  async trackEmailEvalByCompanyPic(@Res() res,@Param('uuid') uuid) {
    const stream = await fs.createReadStream('/app/uploads/pixel.png');
    // const stream = fs.createReadStream('/Users/mac/Desktop/5./eval/portal-eval-backend/uploads/' + name);
    await this.mailingService.trackEmailByUid(uuid);
    res.type('image/ief').send(stream);
  }

}
