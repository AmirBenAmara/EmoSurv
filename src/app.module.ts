import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules/api/api.module';
import { StaticModule } from './modules/static/static.module';
import { EventsGateway } from './events.gateway.';

@Module({
  imports: [ApiModule, StaticModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule { }
