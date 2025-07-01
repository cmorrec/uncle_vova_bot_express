import { From, Message } from "@types";
import { IMessage as DBMessage } from '@repo/index';
import { getDateTime } from "./get-date-time";
import { getMessageType } from "./get-message-type";


export const contextMessageToDb = ({
  message,
  isMainBot,
  isFormal,
  now,
}: {
  message: Message;
  now: Date;
  isMainBot: boolean;
  isFormal?: boolean;
}): DBMessage => ({
  chatId: String(message.chat.id),
  date: getDateTime(message.date)?.toJSDate() ?? now,
  messageId: String(message.message_id),
  from: message.from,
  text: message.text,
  caption: message.caption,
  userId: message.from?.id?.toString(),
  messageThreadId: message.message_thread_id?.toString(),
  replyToMessageId: message.reply_to_message?.message_id.toString(),
  photo: message.photo,
  voice: message.voice,
  poll: message.poll,
  location: message.location as any,
  document: message.document as any,
  forwardDate: getDateTime(message.forward_date)?.toJSDate(),
  forwardFromChat: message.forward_from_chat,
  forwardFromMessageId: message.forward_from_message_id?.toString(),
  entities: message.entities,
  captionEntities: message.caption_entities,
  sticker: message.sticker,
  messageType: getMessageType(message),
  isMainBotMessage: isMainBot,
  isFormalMessage: isFormal,
});

export const contextUserToDb = (
  from: Pick<From, 'id' | 'first_name' | 'last_name' | 'username' | 'is_bot'>,
  now: Date,
) => ({
  createdAt: now,
  updatedAt: now,
  userId: from.id.toString(),
  firstName: from.first_name,
  lastName: from.last_name,
  username: from.username,
  isBot: from.is_bot,
});
