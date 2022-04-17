"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const base_controller_1 = require("../common/base.controller");
const http_error_class_1 = require("../errors/http-error.class");
class UsersController extends base_controller_1.BaseController {
    constructor(logger) {
        super(logger);
        this.bindRoutes([
            {
                path: '/login',
                method: 'post',
                handler: this.login,
            },
            {
                path: '/register',
                method: 'post',
                handler: this.register
            }
        ]);
    }
    login(req, res) {
        this.ok(res, 'Loggin');
    }
    register(req, res, next) {
        next(new http_error_class_1.HTTPError(401, 'User unauthorized', 'register'));
        // this.ok(res, 'Register')
    }
}
exports.UsersController = UsersController;
