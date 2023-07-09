"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const router_1 = __importDefault(require("./router"));
console.log("%j", "ENV", {
    NODE_ENV: process.env.NODE_ENV,
    TEST: process.env.TEST,
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/", router_1.default);
app.use("/.netlify/functions/server", router_1.default);
exports.handler = (0, serverless_http_1.default)(app);
exports.default = app;
//# sourceMappingURL=server.js.map