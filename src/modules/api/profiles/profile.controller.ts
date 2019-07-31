import { HttpStatus } from '@nestjs/common/enums';
import { Res, Req, HttpCode, Put } from '@nestjs/common/decorators/http';
// tslint:disable-next-line:max-line-length
import { Controller, Get, Post, Body, UseInterceptors, UnauthorizedException, ParseIntPipe, Param, FileInterceptor, UploadedFile, Response, Request } from '@nestjs/common';
import { Profile } from './interfaces/profile.interface';
import { ProfilesService } from './profile.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthGuard } from '../common/passport/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { identity } from 'rxjs';

@Controller('api/profiles')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class ProfilesController {

  constructor(private readonly profilesService: ProfilesService) { }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Post()
  async create(@Body() profile: Profile) {
    return await this.profilesService.create(profile);
  }
  @Post('uploadCSV/:idCompany')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination(req, file, cb) {
        // cb(null, '/home/adminubuntu/five-portal/back/uploads/cv/');
        cb(null, 'C:/Users/Mohamed Akoum/OneDrive/Desktop/v-1/back/portal%20main%20backend/src/modules/uploads/');
      },
      filename(req, file, cb) {
        cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));
      },
    }),

  }))
  async uploadCSV(@UploadedFile() file, @Param('idCompany') idCompany): Promise<any> {
    return await this.profilesService.profileCSV(idCompany, file);
  }
  @Post('updateProfile')
  async UpdateProfile(@Body() profile: Profile) {
    return await this.profilesService.UpdateProfile(profile);
  }
  @Post('updateProfiles/:id')
  async UpdateProfiles(@Param('id') id, @Body() profile: Profile) {
    return await this.profilesService.UpdateProfiles(id, profile);
  }
  @Post('addProfile/:id')
  async addProfile(@Param('id') id, @Body() profile: Profile) {
    return await this.profilesService.addProfile(profile, id);
  }
  // @Post('addtopool')
  // async createProfileInPool(@Body() profile: Profile) {
  //   return await this.profilesService.createProfileInPool(profile);
  // }

  @Put(':id')
  async modify(@Body() profile: Profile, @Param('id') id) {
    this.profilesService.update(id, profile);
  }

  @Post(':id/pic')
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

  async uploadpic(@Res() res, @UploadedFile() file, @Param('id') id): Promise<any> {
    this.profilesService.profilePic(`${file.destination}${file.filename}`, id);
    await res.json(file);
  }

  // @Post('cv')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: multer.diskStorage({
  //     destination(req, file, cb) {
  //       cb(null, 'src/upload');
  //     },
  //     filename(req, file, cb) {
  //       cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));
  //     }
  //   })
  // }))
  // async upload(@UploadedFile() file) {
  //   console.log(file);

  // }

  // @Post('file')
  // async uploadOne(@Req() req: any, @Res() res: any) {
  //   const avatar: any = req.file;
  //     // this.filesService.createOne(avatar) :
  //     // new HttpException('no file', HttpStatus.UNPROCESSABLE_ENTITY);
  //   return avatar;
  // }

  // @Post('cv')
  // // async handleUploadedCSV(@Req() req: Request, @Res() res: Response): Promise<any> {
  //   public async addDocument( @Request() req): Promise<any> {
  //   // const doc = req.files.document[0];
  //   // console.log(req);
  //   return {};
  //   // return doc;
  // }

  @Post(':id/cv')
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
  async upload(@Res() res, @UploadedFile() file, @Param('id', new ParseIntPipe()) id): Promise<any> {
    this.profilesService.UpdateProfileCvById(`${file.destination}${file.filename}`, id);
    await res.json(file);
  }

  @Post('cvs')
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
  async uploadMany(@Res() res, @UploadedFile() file): Promise<any> {
    const cvtxt = await this.profilesService.addProfileByCvEmail(`${file.destination}${file.filename}`);
    await res.json({ file, cv: cvtxt });

  }

  // tslint:disable-next-line:no-commented-code
  // {skills:['node','angular']}
  @Post('search')
  async search(@Body() keywords) {
    return await this.profilesService.searchProfile(keywords);
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get('profiles/:id')
  async findAll(@Param('id') id): Promise<Profile[]> {
    return this.profilesService.findAll(id);
  }
  @Get('allProfiles')
  async findAllProfiles(): Promise<Profile[]> {
    return this.profilesService.findAllProfiles();
  }

  // @UseGuards(AuthGuard('jwt', 'admin'))
  @Get('oneProfile/:id')
  async findone(@Param('id') id): Promise<Profile> {
    return this.profilesService.findOne(id);
  }
  @Post(':pool')
  async register(@Param('pool') poolid, @Body() profile: Profile) {
    return this.profilesService.register(profile, poolid);
  }

  @Get('cv/:id')
  async getCv(@Param('id') id) {
    return this.profilesService.getCvFile(id);
  }
}
