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
const common_1 = require("@nestjs/common");
const pool_service_1 = require("./pool.service");
const logging_interceptor_1 = require("../common/interceptors/logging.interceptor");
const auth_guard_1 = require("../common/passport/auth.guard");
const transform_interceptor_1 = require("../common/interceptors/transform.interceptor");
let PoolsController = class PoolsController {
    constructor(poolsService) {
        this.poolsService = poolsService;
    }
    create(pool) {
        return __awaiter(this, void 0, void 0, function* () {
            this.poolsService.create(pool);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.poolsService.findAll();
        });
    }
    findAllLanding() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.poolsService.findAllLanding();
        });
    }
    findByIdLanding(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.poolsService.findByIdLanding(id);
        });
    }
    findone(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.poolsService.findOne(id);
        });
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoolsController.prototype, "create", null);
__decorate([
    common_1.UseGuards(auth_guard_1.AuthGuard('jwt')),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoolsController.prototype, "findAll", null);
__decorate([
    common_1.Get('landing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PoolsController.prototype, "findAllLanding", null);
__decorate([
    common_1.Get('landing/:id'),
    __param(0, common_1.Param('id', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoolsController.prototype, "findByIdLanding", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PoolsController.prototype, "findone", null);
PoolsController = __decorate([
    common_1.Controller('pools'),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [pool_service_1.PoolsService])
], PoolsController);
exports.PoolsController = PoolsController;
//# sourceMappingURL=pool.controller.js.map