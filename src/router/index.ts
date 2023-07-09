import { Router } from "express";
import baseAuth from "../middlewares/base_auth";

const router = Router();

router.use(baseAuth);

import telegramService from "../services/telegram_service";
import delay from "../helper/delay";

router.get("/", (req, res) =>
  res.send(`
<h2>Hello in Telegram leads parser App</h2>
<br>
${
  telegramService.connected
    ? "<span>You are connected</span>"
    : '<a href="/auth">Auth to your telegram</a>'
}
`)
);

router.get("/auth", (req, res) => {
  telegramService.auth().then(async (client) => {
    await telegramService.listen(client);
  });
  res.send(`
<form action="/phone" method="post">
<label for="phone">Enter a phone number:</label><br><br>
  <input type="tel" id="phone" name="phone" placeholder="0XXXXXXXXX" pattern="[0-9]{10}" required><br><br>
  <input type="submit" value="OK">
</form>`);
});

router.get("/code", (req, res) =>
  res.send(`
<form action="/code" method="post">
<label for="code">Enter code from telegram:</label><br><br>
  <input type="tel" id="code" name="code" placeholder="XXXXX" pattern="[0-9]{5}" required><br><br>
  <input type="submit" value="OK">
</form>`)
);

router.post("/phone", (req, res) => {
  console.log("%j", "phone", req.body.phone);
  telegramService.setPhoneNumber(req.body.phone);
  res.redirect("/code");
});

router.post("/code", async (req, res) => {
  console.log("%j", "code", req.body.code);
  telegramService.setPhoneCode(req.body.code);
  await delay(1000);
  res.redirect("/");
});

export default router;
