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
const http_1 = require("@nestjs/common/decorators/http");
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const logging_interceptor_1 = require("../common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("../common/interceptors/transform.interceptor");
const multer = require("multer");
let ProfilesController = class ProfilesController {
    constructor(profilesService) {
        this.profilesService = profilesService;
    }
    create(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profilesService.create(profile);
        });
    }
    UpdateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profilesService.UpdateProfile(profile);
        });
    }
    UpdateProfiles(id, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profilesService.UpdateProfiles(id, profile);
        });
    }
    addProfile(id, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profilesService.addProfile(profile, id);
        });
    }
    modify(profile, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.profilesService.update(id, profile);
        });
    }
    uploadpic(res, file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.profilesService.profilePic(`${file.destination}${file.filename}`, id);
            yield res.json(file);
        });
    }
    upload(res, file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.profilesService.UpdateProfileCvById(`${file.destination}${file.filename}`, id);
            yield res.json(file);
        });
    }
    uploadMany(res, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const cvtxt = yield this.profilesService.addProfileByCvEmail(`${file.destination}${file.filename}`);
            yield res.json({ file, cv: cvtxt });
        });
    }
    search(keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.profilesService.searchProfile(keywords);
        });
    }
    findAll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profilesService.findAll(id);
        });
    }
    findAllProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profilesService.findAllProfiles();
        });
    }
    findone(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profilesService.findOne(id);
        });
    }
    register(poolid, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profilesService.register(profile, poolid);
        });
    }
    getCv(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profilesService.getCvFile(id);
        });
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "create", null);
__decorate([
    common_1.Post('updateProfile'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "UpdateProfile", null);
__decorate([
    common_1.Post('updateProfiles/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "UpdateProfiles", null);
__decorate([
    common_1.Post('addProfile/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "addProfile", null);
__decorate([
    http_1.Put(':id'),
    __param(0, common_1.Body()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "modify", null);
__decorate([
    common_1.Post(':id/pic'),
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
    __param(0, http_1.Res()), __param(1, common_1.UploadedFile()), __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "uploadpic", null);
__decorate([
    common_1.Post(':id/cv'),
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
    __param(0, http_1.Res()), __param(1, common_1.UploadedFile()), __param(2, common_1.Param('id', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "upload", null);
__decorate([
    common_1.Post('cvs'),
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
    __param(0, http_1.Res()), __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "uploadMany", null);
__decorate([
    common_1.Post('search'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "search", null);
__decorate([
    common_1.Get('profiles/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "findAll", null);
__decorate([
    common_1.Get('allProfiles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "findAllProfiles", null);
__decorate([
    common_1.Get('oneProfile/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "findone", null);
__decorate([
    common_1.Post(':pool'),
    __param(0, common_1.Param('pool')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "register", null);
__decorate([
    common_1.Get('cv/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getCv", null);
ProfilesController = __decorate([
    common_1.Controller('api/profiles'),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [profile_service_1.ProfilesService])
], ProfilesController);
exports.ProfilesController = ProfilesController;
//# sourceMappingURL=profile.controller.js.map