import { config } from "@config";
import { IChat } from "@repo/index";
import chatRepo from "@repo/chat.repo";
import userRepo from "@repo/user.repo";
import { Message } from "@types";

export async function saveChatMiddleware(
  message: Message
): Promise<IChat | undefined> {
  const now = new Date();
  const ctxMessage = message;
  const ctxChat = ctxMessage.chat;
  const ctxFrom = ctxMessage.from;

  const chatId = String(ctxChat.id);
  const userId = String(ctxFrom.id);
  let chat = await chatRepo.getById(chatId);

  if (!chat) {
    // TODO delete if for all users used
    const ownerIds = config.ownerIds;
    if (
      ctxMessage.text === "/start" &&
      (!ownerIds || ownerIds.split(",").includes(userId))
    ) {
      chat = {
        chatId: chatId,
        chatMemberIds: [userId],
        botDescription: undefined,
        botQuotes: [],
        title: ctxChat.title,
        createdAt: now,
        updatedAt: now,
        chatType: ctxChat.type,
        wakeUp: true,
        botIsRude: true,
        active: false,
      };
      await chatRepo.create(chat);
      await userRepo.upsertUsers(now, [ctxFrom]);
    } else {
      return;
    }
  }

  return chat;
}
