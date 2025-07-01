import { IMessage } from "@repo/index";
import chatRepo from "@repo/chat.repo";
import messageRepo from "@repo/message.repo";
import userRepo from "@repo/user.repo";
import { Message, UpdateDBInfo } from "@types";
import { contextMessageToDb, handleError } from "@utils";

export async function saveMessageMiddleware(
  inputMessage: Message
): Promise<UpdateDBInfo | undefined> {
  try {
    console.info(JSON.stringify(inputMessage, null, 3), "\n");
    const now = new Date();
    const ctxMessage = inputMessage;
    const ctxRepliedMessage = ctxMessage.reply_to_message;
    const ctxChat = ctxMessage.chat;
    const ctxFrom = ctxMessage.from;

    const chatId = String(ctxChat.id);
    const userId = String(ctxFrom.id);

    let chat = await chatRepo.getById(chatId);
    if (!chat || !chat.active) {
      return undefined;
    }

    await chatRepo.upsertChatMembers(chat, [
      userId,
      ctxRepliedMessage?.from.id,
    ]);
    await userRepo.upsertUsers(now, [ctxFrom, ctxRepliedMessage?.from]);

    let repliedMessage: IMessage | null = null;
    try {
      if (ctxRepliedMessage) {
        repliedMessage = await messageRepo.getByChatAndId({
          chatId: chat?.chatId,
          messageId: ctxRepliedMessage?.message_id.toString(),
        });
        if (!repliedMessage) {
          repliedMessage = contextMessageToDb({
            message: ctxRepliedMessage,
            now,
            isMainBot: false,
          });

          await messageRepo.create(repliedMessage);
        }
      }
    } catch (e) {
      handleError(e);
    }

    const newMessage = contextMessageToDb({
      message: ctxMessage,
      now,
      isMainBot: false,
    });
    await messageRepo.create(newMessage);

    return {
      chat,
      message: newMessage,
      repliedMessage: repliedMessage,
    };
  } catch (error) {
    handleError(error);

    return undefined;
  }
}
