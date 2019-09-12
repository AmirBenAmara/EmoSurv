import { Controller, Get, Post, Put, Body, UseInterceptors, UseGuards, Param, Delete, Res } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Campaign } from './interfaces/campaign.interface';
import { Template } from './interfaces/template.interface';
import * as fs from 'fs';
import { Contact } from './interfaces/contact.interface';
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

  @Get('contact')
  async findAllContacts(): Promise<Contact[]> {
    return this.mailingService.findAllContact();
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post('campaign/:id')
  async createCampaign(@Body() campaign: Campaign, @Param('id') idCompany) {
    return this.mailingService.createCampaign(campaign, idCompany);
  }

  @Post('template/:id')
  async createTemplate(@Body() template: Template, @Param('id') idCompany) {
    return this.mailingService.createTemplate(template, idCompany);
  }

  @Post('contact/:id')
  async createContact(@Body() contact: Contact, @Param('id') idCompany) {
    return this.mailingService.addContact(contact, idCompany);
  }

  @Put('template/:id')
  async updateTemplate(@Body() template: Template, @Param('id') id) {
    return this.mailingService.updateTemplate(id, template);
  }

  @Put('campaign/:id')
  async updateCampaign(@Body() campaign: Campaign, @Param('id') id) {
    return this.mailingService.updateCampaign(id, campaign);
  }

  @Put('contact/:id')
  async updateContact(@Body() contact: Contact, @Param('id') id) {
    return this.mailingService.updateContact(id, contact);
  }

  @Delete('template/:id/:idCompany')
  async deleteTemplate(@Param('id') id, @Param('idCompany') idCompany) {
    return this.mailingService.deleteTemplate(id, idCompany);
  }

  @Delete('campaign/:id')
  async deleteCampaign(@Param('id') id) {
    return this.mailingService.deleteCampaign(id);
  }

  @Delete('contact/:id/:idCompany')
  async deleteContact(@Param('id') id, @Param('idCompany') idCompany) {
    return this.mailingService.deleteContact(id, idCompany);
  }


  @Get('track/:uuid')
  async trackEmailByPixel(@Res() res, @Param('uuid') uuid) {
    const stream = await fs.createReadStream('/root/camail/mailingplateformebackend/uploads/pixel.png');
    // const stream = fs.createReadStream('/Users/mac/Desktop/5./eval/portal-eval-backend/uploads/' + name);
    await this.mailingService.trackEmailByUid(uuid);
    res.type('image/ief').send(stream);
  }

  @Get('trackLink/:idLink')
  async trackEmailByLink(@Res() res, @Param('idLink') idLink) {
    // const stream = await fs.createReadStream('mailingplateformebackend/uploads/pixel.png');
    // const stream = fs.createReadStream('/Users/mac/Desktop/5./eval/portal-eval-backend/uploads/' + name);
    //await this.mailingService.trackEmailByUid(uuid);

    const Link = await this.mailingService.updateOpenedTimesLink(idLink);

    //const redirectUrl = new URL(url);

    res.redirect(Link.url.toString());

  }

}
