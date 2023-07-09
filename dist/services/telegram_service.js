"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tl_1 = require("telegram/tl");
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const random_bigint_1 = __importDefault(require("random-bigint"));
const config_1 = __importDefault(require("../config"));
const node_cache_1 = __importDefault(require("node-cache"));
const delay_1 = __importDefault(require("../helper/delay"));
const cache = new node_cache_1.default({ stdTTL: 600, useClones: false });
class TelegramService {
    constructor() {
        this.auth = async () => {
            const stringSession = new sessions_1.StringSession(this.tgSession);
            console.log("Loading interactive example...");
            const client = new telegram_1.TelegramClient(stringSession, this.apiId, this.apiHash, {
                connectionRetries: 5,
            });
            await client.start({
                phoneNumber: async () => await this.phoneNumber,
                phoneCode: async () => await this.waitInputPhoneCode(),
                onError: (err) => console.log(err),
            });
            console.log("You should now be connected.");
            const successSession = client.session.save();
            this.tgSession = String(successSession);
            this.connected = true;
            return client;
        };
        // public waitInputPhoneNumber = async () => {
        //   if (this.phoneNumber) {
        //     return this.phoneNumber;
        //   }
        //   await delay(300);
        //   return await this.waitInputPhoneNumber();
        // };
        this.waitInputPhoneCode = async () => {
            if (this.phoneCode) {
                return this.phoneCode;
            }
            await (0, delay_1.default)(300);
            return await this.waitInputPhoneCode();
        };
        // public setPhoneNumber = (value: string) => {
        //   this.phoneNumber = `${config.COUNTRY_PHONE_CODE}${value}`;
        // };
        this.setPhoneCode = (value) => {
            this.phoneCode = value;
        };
        this.listen = async (client) => {
            if (!client) {
                client = await this.auth();
            }
            client.addEventHandler(async (event) => {
                const { message } = event;
                if (!message)
                    return;
                const { message: msgObject } = event;
                if (!msgObject)
                    return;
                if (!msgObject.message)
                    return;
                const cacheKey = "sended_msg_" + msgObject.id;
                if (cache.get(cacheKey))
                    return;
                const r = new RegExp(config_1.default.LEADS.join("|"), "gmi");
                const hasLeads = r.test(msgObject.message);
                hasLeads &&
                    console.log("%j", "\x1b[33m HAS LEADS! \x1b[0m", msgObject.message);
                if (!hasLeads)
                    return;
                let result;
                try {
                    result = await client.invoke(new tl_1.Api.channels.ExportMessageLink({
                        channel: msgObject.peerId,
                        id: msgObject.id,
                        thread: true,
                    }));
                }
                catch (error) {
                    result = { link: `Error No Link for: ${msgObject.message}` };
                    console.log("%j", "ExportMessageLink error", error);
                    console.log("%j", "ExportMessageLink msgObject", msgObject);
                    const channel = await client.invoke(new tl_1.Api.channels.GetFullChannel({
                        channel: msgObject.peerId,
                    }));
                    console.log("%j", "Error channel", channel);
                }
                if (!result)
                    return;
                const sendMessagesResult = await client.invoke(new tl_1.Api.messages.SendMessage({
                    peer: config_1.default.USERNAME,
                    message: result.link,
                    randomId: (0, random_bigint_1.default)(128),
                    noWebpage: false,
                }));
                cache.set(cacheKey, msgObject.id);
            });
        };
        this.apiId = config_1.default.API_ID;
        this.apiHash = config_1.default.API_HASH;
        this.tgSession = "";
        this.phoneNumber = config_1.default.PHONE_NUMBER;
        this.phoneCode = "";
        this.connected = false;
    }
}
const telegramService = new TelegramService();
exports.default = telegramService;
//# sourceMappingURL=telegram_service.js.map