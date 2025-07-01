import { DateTime } from "luxon";
import { saveReplyMessage } from "./save-reply-message.middleware";
import { BotContext } from "@types";

export async function replyOnMessage({
  ctx,
  isFormal,
  needSave,
  text,
}: {
  ctx: BotContext;
  text: string;
  isFormal?: boolean;
  needSave: boolean;
}) {
  const newMessage = await ctx.reply(text, {
    reply_parameters: { message_id: ctx.update.message.message_id },
  });
  newMessage.date = DateTime.local().toSeconds();

  console.info(
    "Replied Message: ",
    JSON.stringify(newMessage, null, 3),
    "\n\n\n"
  );

  await saveReplyMessage({
    isFormal,
    needSave,
    newMessage: newMessage as any,
  });
}
