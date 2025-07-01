import { message } from "telegraf/filters";
import { BotContext, Message, TelegrafContext } from "@types";
import service from "@service";
import { replyOnMessage, saveMessageMiddleware } from "@middlewares";

export default function registerOnText(bot: TelegrafContext) {
  bot.on(message("text"), async (ctx) => {
    const updateDBInfo = await saveMessageMiddleware(
      ctx.update.message as Message
    );
    const result = updateDBInfo
      ? await service.getAnswer(updateDBInfo)
      : undefined;

    if (result) {
      await replyOnMessage({
        ctx: ctx as BotContext,
        text: result.answer,
        isFormal: result.isFormal,
        needSave: true,
      });
    }
  });
}
