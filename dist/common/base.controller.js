"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const express_1 = require("express");
class BaseController {
    constructor(logger) {
        this.logger = logger;
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    send(res, code, message) {
        res.type('application/json');
        return res.status(code).json(message);
    }
    ok(res, message) {
        this.send(res, 200, message);
    }
    created(res) {
        return res.sendStatus(201);
    }
    bindRoutes(routes) {
        routes.forEach(r => {
            this.logger.log(`[${r.method}]:${r.path}`);
            this.router[r.method](r.path, r.handler.bind(this));
        });
    }
}
exports.BaseController = BaseController;
