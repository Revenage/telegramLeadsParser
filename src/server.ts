import express from "express";
import bodyParser from "body-parser";

import router from "./router";

console.log("%j", "ENV", {
  NODE_ENV: process.env.NODE_ENV,
  TEST: process.env.TEST,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);

app.listen(process.env.PORT || 3000, () => console.log("server listen", 3000));

export default app;
