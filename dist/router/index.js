"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const base_auth_1 = __importDefault(require("../middlewares/base_auth"));
const router = (0, express_1.Router)();
router.use(base_auth_1.default);
const telegram_service_1 = __importDefault(require("../services/telegram_service"));
const delay_1 = __importDefault(require("../helper/delay"));
router.get("/", (req, res) => res.send(`
<h2>Hello in Telegram leads parser App</h2>
<br>
${telegram_service_1.default.connected
    ? "<span>You are connected</span>"
    : '<a href="/auth">Auth to your telegram</a>'}
`));
router.get("/auth", (req, res) => {
    telegram_service_1.default.auth().then(async (client) => {
        await telegram_service_1.default.listen(client);
    });
    res.send(`
  <form action="/code" method="post">
  <label for="code">Enter code from telegram:</label><br><br>
    <input type="tel" id="code" name="code" placeholder="XXXXX" pattern="[0-9]{5}" required><br><br>
    <input type="submit" value="OK">
  </form>`);
});
// router.get("/code", (req, res) =>
//   res.send(`
// <form action="/code" method="post">
// <label for="code">Enter code from telegram:</label><br><br>
//   <input type="tel" id="code" name="code" placeholder="XXXXX" pattern="[0-9]{5}" required><br><br>
//   <input type="submit" value="OK">
// </form>`)
// );
// router.post("/phone", (req, res) => {
//   console.log("%j", "phone", req.body.phone);
//   telegramService.setPhoneNumber(req.body.phone);
//   res.redirect("/code");
// });
router.post("/code", async (req, res) => {
    console.log("%j", "code", req.body.code);
    telegram_service_1.default.setPhoneCode(req.body.code);
    await (0, delay_1.default)(1000);
    res.redirect("/");
});
exports.default = router;
//# sourceMappingURL=index.js.map