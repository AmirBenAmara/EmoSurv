import * as path from 'path';
import * as fs from 'fs';
import { Controller, Post, UseInterceptors, FileInterceptor, UploadedFile, Res, Get, Param } from '@nestjs/common';
import * as multer from 'multer';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@Controller('uploads')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UploadController {

  @Get(':name')
  async getfiles(@Res() res, @Param('name') name) {
    const file = process.env.APP_PATH + '/' + name;
    res.sendFile(name, { root: path.join(process.env.APP_PATH, '/') });
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));
      },
    }),

  }))

  async upload(@Res() res, @UploadedFile() file): Promise<any> {
    await res.json(file);

  }

}
