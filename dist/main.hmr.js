"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs-extra");
const dotenv = require("dotenv");
const body_parser_1 = require("body-parser");
dotenv.config();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const httpsOptions = {
            key: fs.readFileSync('/etc/letsencrypt/live/fivepoints.fr/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/fivepoints.fr/fullchain.pem'),
        };
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions, bodyParser: false });
        app.enableCors();
        app.use(body_parser_1.json({ limit: '50mb' }));
        yield app.listen(3001);
        if (module.hot) {
            module.hot.accept();
            module.hot.dispose(() => app.close());
        }
    });
}
bootstrap();
//# sourceMappingURL=main.hmr.js.map