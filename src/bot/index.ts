import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "@config";
import registerCommandHandlers from './handlers/commands';
import registerOnText from "./handlers/updates/on-text";

export function createBot() {
  const bot = new Telegraf(config.botToken);

  bot.use(session());

  registerCommandHandlers(bot);

  registerOnText(bot);

  return bot;
}
