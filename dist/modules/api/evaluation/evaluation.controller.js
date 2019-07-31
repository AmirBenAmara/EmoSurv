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
const evaluation_service_1 = require("./evaluation.service");
const logging_interceptor_1 = require("../common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("../common/interceptors/transform.interceptor");
let EvaluationController = class EvaluationController {
    constructor(evaluationService) {
        this.evaluationService = evaluationService;
    }
    createEvaluation(evaluation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.createEvaluation(evaluation);
        });
    }
    getStatsprofiles(id, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.getStatsprofiles(id, idCompany);
        });
    }
    getStatsprofilesAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.getStatsprofilesAdmin(id);
        });
    }
    findAllTestsByCompany(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findAllTestsByCompany(id);
        });
    }
    getStatsOtherprofiles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.getStatsOtherprofiles(id);
        });
    }
    takeProfile(id, idComapny) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.takeProfile(id, idComapny);
        });
    }
    createTest(test) {
        return __awaiter(this, void 0, void 0, function* () {
            this.evaluationService.createTest(test);
        });
    }
    takeTest(id, test) {
        return __awaiter(this, void 0, void 0, function* () {
            this.evaluationService.takeTest(test, id);
        });
    }
    updateTest(test, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.updateTest(id, test);
        });
    }
    findAllEvaluations() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findAllEvaluations();
        });
    }
    findAllTests() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findAllTests();
        });
    }
    findOtherTests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOtherTests(id);
        });
    }
    findOneEvaluationsByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCode(code);
        });
    }
    findOneEvaluationsByCodeToStart(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCodeToStart(code);
        });
    }
    findOneByCodeToSubmit(code, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCodeToSubmit(code, body);
        });
    }
    findOneByCodeToSubmitQuiz(code, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCodeToSubmitQuiz(code, body);
        });
    }
    findOneByCodeToSubmitAlgo(code, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCodeToSubmitAlgo(code, body);
        });
    }
    findOneByCodeToSubmitHybrid(code, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCodeToSubmitHybrid(code, body);
        });
    }
    findOneByCodeToSubmitProject(code, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.evaluationService.findOneByCodeToSubmitProject(code, body);
        });
    }
    run(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluationService.runCode(code);
        });
    }
    deleteTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluationService.deleteTest(id);
        });
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "createEvaluation", null);
__decorate([
    common_1.Get('statProfile/:id/:idCompany'),
    __param(0, common_1.Param('id')), __param(1, common_1.Param('idCompany')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getStatsprofiles", null);
__decorate([
    common_1.Get('statProfileAdmin/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getStatsprofilesAdmin", null);
__decorate([
    common_1.Get('findAllTestsByCompany/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findAllTestsByCompany", null);
__decorate([
    common_1.Get('statOtherProfile/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getStatsOtherprofiles", null);
__decorate([
    common_1.Get('takeProfile/:id/:idCompany'),
    __param(0, common_1.Param('id')), __param(1, common_1.Param('idCompany')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "takeProfile", null);
__decorate([
    common_1.Post('test'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "createTest", null);
__decorate([
    common_1.Post('takeTest/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "takeTest", null);
__decorate([
    common_1.Put('test/:id'),
    __param(0, common_1.Body()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "updateTest", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findAllEvaluations", null);
__decorate([
    common_1.Get('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findAllTests", null);
__decorate([
    common_1.Get('otherTest/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOtherTests", null);
__decorate([
    common_1.Get('pass/:code'),
    __param(0, common_1.Param('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneEvaluationsByCode", null);
__decorate([
    common_1.Get('start/:code'),
    __param(0, common_1.Param('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneEvaluationsByCodeToStart", null);
__decorate([
    common_1.Post('submit/:code'),
    __param(0, common_1.Param('code')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneByCodeToSubmit", null);
__decorate([
    common_1.Post('quiz/:code'),
    __param(0, common_1.Param('code')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneByCodeToSubmitQuiz", null);
__decorate([
    common_1.Post('algo/:code'),
    __param(0, common_1.Param('code')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneByCodeToSubmitAlgo", null);
__decorate([
    common_1.Post('hybrid/:code'),
    __param(0, common_1.Param('code')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneByCodeToSubmitHybrid", null);
__decorate([
    common_1.Post('project/:code'),
    __param(0, common_1.Param('code')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "findOneByCodeToSubmitProject", null);
__decorate([
    common_1.Post('run'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "run", null);
__decorate([
    common_1.Post('deleteTest/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "deleteTest", null);
EvaluationController = __decorate([
    common_1.Controller('api/evaluation'),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [evaluation_service_1.EvaluationService])
], EvaluationController);
exports.EvaluationController = EvaluationController;
//# sourceMappingURL=evaluation.controller.js.map