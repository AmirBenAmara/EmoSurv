"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const common_1 = require("@nestjs/common");
const multer = require("multer");
const transform_interceptor_1 = require("../common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("../common/interceptors/logging.interceptor");
let UploadController = class UploadController {
    getfiles(res, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = process.env.APP_PATH + '/' + name;
            res.sendFile(name, { root: path.join(process.env.APP_PATH, '/') });
        });
    }
    upload(res, file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield res.json(file);
        });
    }
};
__decorate([
    common_1.Get(':name'),
    __param(0, common_1.Res()), __param(1, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getfiles", null);
__decorate([
    common_1.Post('file'),
    common_1.UseInterceptors(common_1.FileInterceptor('file', {
        storage: multer.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));
            },
        }),
    })),
    __param(0, common_1.Res()), __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "upload", null);
UploadController = __decorate([
    common_1.Controller('uploads'),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor)
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map