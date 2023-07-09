"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const baseAuth_1 = __importDefault(require("../middlewares/baseAuth"));
const router = (0, express_1.Router)();
router.use(baseAuth_1.default);
router.get("/", (req, res) => res.send(`
<h2>Hello in Telegram leads parser App</h2>
<br>
<a href="/auth">Auth to your telegram</a>
<hr>
${process.env.TEST}
`));
router.get("/auth", (req, res) => res.send(`
<form action="/phone" method="post">
<label for="phone">Enter a phone number:</label><br><br>
  <input type="tel" id="phone" name="phone" placeholder="0XXXXXXXXX" pattern="[0-9]{10}" required><br><br>
  <input type="submit" value="OK">
</form>`));
router.get("/code", (req, res) => res.send(`
<form action="/code" method="post">
<label for="code">Enter code from telegram:</label><br><br>
  <input type="tel" id="code" name="code" placeholder="XXXXX" pattern="[0-9]{5}" required><br><br>
  <input type="submit" value="OK">
</form>`));
router.post("/phone", (req, res) => {
    console.log("%j", "phone", req.body.phone);
    res.redirect("/code");
});
router.post("/code", (req, res) => {
    console.log("%j", "code", req.body.code);
    res.redirect("/");
});
exports.default = router;
//# sourceMappingURL=index.js.map