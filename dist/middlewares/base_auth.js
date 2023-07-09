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
        if (username == process.env.AUTH_USERNAME &&
            password == process.env.AUTH_PASSWORD) {
            return next();
        }
    }
    return res
        .setHeader("WWW-Authenticate", 'Basic realm="example"')
        .status(401)
        .end("Authorization Required");
}
exports.default = baseAuth;
//# sourceMappingURL=base_auth.js.map