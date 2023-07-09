import express, { Router } from "express";
import baseAuth from "./middlewares/baseAuth";
import bodyParser from "body-parser";

console.log("%j", 'ENV', {
    NODE_ENV: process.env.NODE_ENV
    TEST: process.env.TEST
})
// const router = Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(baseAuth);

// app.use("/api/", router);

app.get("/", (req, res) =>
  res.send(`
<h2>Hello in Telegram leads parser App</h2>
<br>
<a href="/auth">Auth to your telegram</a>
`)
);

app.get("/auth", (req, res) =>
  res.send(`
<form action="/phone" method="post">
<label for="phone">Enter a phone number:</label><br><br>
  <input type="tel" id="phone" name="phone" placeholder="0XXXXXXXXX" pattern="[0-9]{10}" required><br><br>
  <input type="submit" value="OK">
</form>`)
);

app.get("/code", (req, res) =>
  res.send(`
<form action="/code" method="post">
<label for="code">Enter code from telegram:</label><br><br>
  <input type="tel" id="code" name="code" placeholder="XXXXX" pattern="[0-9]{5}" required><br><br>
  <input type="submit" value="OK">
</form>`)
);

app.post("/phone", (req, res) => {
  console.log("%j", "phone", req.body.phone);
  res.redirect("/code");
});

app.post("/code", (req, res) => {
  console.log("%j", "code", req.body.code);
  res.redirect("/");
});

app.listen(3000, () => console.log("server listen", 3000));

export default app;
