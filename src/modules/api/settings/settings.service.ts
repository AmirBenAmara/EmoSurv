import { Injectable } from '@nestjs/common';
import { Setting } from './interfaces/settings.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
    constructor() { }

}
