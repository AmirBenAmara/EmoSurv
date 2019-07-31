import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PoolsModule } from './pools/pools.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UploadModule } from './upload/upload.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { MailingModule } from './mailing/mailing.module';
import { CompaniesModule } from './companies/companies.module';
import { GroupsModule } from './groups/group.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  // tslint:disable-next-line:max-line-length
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nestdb'), UsersModule, SettingsModule, GroupsModule, CompaniesModule, PoolsModule, ProfilesModule, UploadModule, EvaluationModule, MailingModule],
  controllers: [],
  providers: [],
})
export class ApiModule { }
