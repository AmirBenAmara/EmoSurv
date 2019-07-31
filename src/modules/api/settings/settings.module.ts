import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsSchema } from './schemas/settings.shema';
import { SettingsService } from './settings.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Setting', schema: SettingsSchema }])],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {

}
