import chatRepo from "@repo/chat.repo";
import messageRepo from "@repo/message.repo";
import userRepo from "@repo/user.repo";
import { Message } from "@types";
import { contextMessageToDb, contextUserToDb } from "@utils";

export async function saveReplyMessage({
  newMessage,
  needSave,
  isFormal,
}: {
  newMessage: Message;
  isFormal?: boolean;
  needSave: boolean;
}) {
  const bot = newMessage.from;
  const botId = bot?.id.toString();
  const now = new Date();
  const chat = (await chatRepo.getById(newMessage.chat.id.toString()))!;
  const botUser = await userRepo.getById(botId);

  await Promise.all([
    needSave
      ? messageRepo.create(
          contextMessageToDb({
            message: newMessage,
            now,
            isMainBot: true,
            isFormal,
          })
        )
      : undefined,
    botId && !chat.chatMemberIds?.includes(botId)
      ? chat.chatMemberIds?.push(botId)
      : undefined,
    bot && !botUser ? userRepo.create(contextUserToDb(bot, now)) : undefined,
  ]);
}
