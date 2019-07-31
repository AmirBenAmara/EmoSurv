import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';
import { json } from 'body-parser';

dotenv.config();
declare const module: any;

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/fivepoints.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/fivepoints.fr/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions,  bodyParser: false });
  app.enableCors();
  app.use(json({ limit: '50mb' }));

  await app.listen(3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
