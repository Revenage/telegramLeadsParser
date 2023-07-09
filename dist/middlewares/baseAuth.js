"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function decodeBase64(str) {
    return Buffer.from(str, "base64").toString();
}
function baseAuth(req, res, next) {
    let { authorization } = req.headers;
    if (authorization) {
        authorization = String(authorization).replace("Basic ", "");
        const [username, password] = decodeBase64(authorization).split(":");
        if (username == "admin" && password == "password") {
            return next();
        }
    }
    return res
        .setHeader("WWW-Authenticate", 'Basic realm="example"')
        .status(401)
        .end("Authorization Required");
}
exports.default = baseAuth;
//# sourceMappingURL=baseAuth.js.map