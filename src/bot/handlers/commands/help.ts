import { replyOnMessage, saveChatMiddleware } from "@middlewares";
import { BotContext, Message, TelegrafContext } from "@types";
import i18n from "@i18n";

function getHelpMessage(): string {
  return i18n.t("help", {});
}

export default function registerHelpCommand(bot: TelegrafContext) {
  bot.help(async (ctx) => {
    const chat = await saveChatMiddleware(ctx.update.message as Message);

    if (chat) {
      const helpMessage = getHelpMessage();
      await replyOnMessage({
        ctx: ctx as BotContext,
        text: helpMessage,
        needSave: false,
      });
    }
  });
}
