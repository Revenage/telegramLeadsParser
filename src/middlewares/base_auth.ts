import express, { Express, Request, Response, NextFunction } from "express";

function decodeBase64(str: string) {
  return Buffer.from(str, "base64").toString();
}

function baseAuth(req: Request, res: Response, next: NextFunction) {
  let { authorization } = req.headers;
  if (authorization) {
    authorization = String(authorization).replace("Basic ", "");
    const [username, password] = decodeBase64(authorization).split(":");

    if (
      username == process.env.AUTH_USERNAME &&
      password == process.env.AUTH_PASSWORD
    ) {
      return next();
    }
  }

  return res
    .setHeader("WWW-Authenticate", 'Basic realm="example"')
    .status(401)
    .end("Authorization Required");
}

export default baseAuth;
