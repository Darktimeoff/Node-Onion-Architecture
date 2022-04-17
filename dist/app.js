"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
class App {
    constructor(logger, usersController, exceptionFilter) {
        this.logger = logger;
        this.usersController = usersController;
        this.exceptionFilter = exceptionFilter;
        this.port = 8000;
        this.host = '127.0.0.1';
        this.app = (0, express_1.default)();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddleware();
            this.useRoutes();
            this.useExceptionFilter();
            this.server = this.app.listen(this.port, this.host, () => {
                this.logger.log(`Server listen:http://${this.host}:${this.port}`);
            });
        });
    }
    useRoutes() {
        this.app.use('/users', this.usersController.router);
    }
    useMiddleware() {
    }
    useExceptionFilter() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }
}
exports.App = App;
