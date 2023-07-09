import express from "express";
import bodyParser from "body-parser";
import serverless from "serverless-http";
import router from "./router";

console.log("%j", "ENV", {
  NODE_ENV: process.env.NODE_ENV,
  TEST: process.env.TEST,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);
app.use("/.netlify/functions/server", router);

export const handler = serverless(app);

export default app;
