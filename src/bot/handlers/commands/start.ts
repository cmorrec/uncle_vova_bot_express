import i18n from "@i18n";
import { replyOnMessage, saveChatMiddleware } from "@middlewares";
import service from "@service";
import { BotContext, Message, TelegrafContext } from "@types";

function getStartMessage(): string {
  return i18n.t("start", {
    formalMentions: service
      .getFormalMentions()
      .map((e) => `${e}`)
      .join(", "),
    informalMentions: service
      .getInformalMentions()
      .map((e) => `${e}`)
      .join(", "),
  });
}

export default function registerStartCommand(bot: TelegrafContext) {
  bot.start(async (ctx) => {
    const chat = await saveChatMiddleware(ctx.update.message as Message);

    if (chat) {
      const startMessage = getStartMessage();
      await replyOnMessage({
        ctx: ctx as BotContext,
        text: startMessage,
        needSave: false,
      });
    }
  });
}
