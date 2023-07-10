import dotenv from "dotenv";
dotenv.config();
import { Api } from "telegram/tl";

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

import random from "random-bigint";
import config from "../config";
import Cache from "node-cache";
import delay from "../helper/delay";
const cache = new Cache({ stdTTL: 600, useClones: false });

class TelegramService {
  apiId: number;
  apiHash: string;
  tgSession: string;
  phoneNumber: string;
  phoneCode: string;

  connected: boolean;

  client: TelegramClient | undefined;

  constructor() {
    this.apiId = config.API_ID;
    this.apiHash = config.API_HASH;
    this.tgSession = "";
    this.phoneNumber = "";
    this.phoneCode = "";
    this.connected = false;
  }

  public auth = async () => {
    const stringSession = new StringSession(this.tgSession);
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
      connectionRetries: 5,
    });
    await client.start({
      phoneNumber: async () => await this.waitInputPhoneNumber(),
      phoneCode: async () => await this.waitInputPhoneCode(),
      onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    const successSession = client.session.save();
    this.tgSession = String(successSession);
    this.connected = true;
    return client;
  };

  public waitInputPhoneNumber = async () => {
    if (this.phoneNumber) {
      return this.phoneNumber;
    }
    await delay(300);
    return await this.waitInputPhoneNumber();
  };

  public waitInputPhoneCode = async () => {
    if (this.phoneCode) {
      return this.phoneCode;
    }
    await delay(300);
    return await this.waitInputPhoneCode();
  };

  public setPhoneNumber = (value: string) => {
    this.phoneNumber = `${config.COUNTRY_PHONE_CODE}${value}`;
  };

  public setPhoneCode = (value: string) => {
    this.phoneCode = value;
  };

  public listen = async (client: TelegramClient) => {
    if (!client) {
      client = await this.auth();
    }

    client.addEventHandler(async (event) => {
      const { message } = event;

      if (!message) return;

      const { message: msgObject } = event;

      if (!msgObject) return;
      if (!msgObject.message) return;

      const cacheKey = "sended_msg_" + msgObject.id;

      if (cache.get(cacheKey)) return;

      const r = new RegExp(config.LEADS.join("|"), "gmi");
      const hasLeads = r.test(msgObject.message);

      hasLeads &&
        console.log("%j", "\x1b[33m HAS LEADS! \x1b[0m", msgObject.message);

      if (!hasLeads) return;

      let result;
      try {
        result = await client.invoke(
          new Api.channels.ExportMessageLink({
            channel: msgObject.peerId,
            id: msgObject.id,
            thread: true,
          })
        );
      } catch (error) {
        result = { link: `Error No Link for: ${msgObject.message}` };
        console.log("%j", "ExportMessageLink error", error);
        console.log("%j", "ExportMessageLink msgObject", msgObject);

        const channel = await client.invoke(
          new Api.channels.GetFullChannel({
            channel: msgObject.peerId,
          })
        );
        console.log("%j", "Error channel", channel);
      }

      if (!result) return;

      const sendMessagesResult = await client.invoke(
        new Api.messages.SendMessage({
          peer: config.USERNAME,
          message: result.link,
          randomId: random(128),
          noWebpage: false,
        })
      );

      cache.set(cacheKey, msgObject.id);
    });
  };
}

const telegramService = new TelegramService();

export default telegramService;