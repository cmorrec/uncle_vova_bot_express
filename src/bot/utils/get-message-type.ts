import { MessageType } from "@repo/index";
import { Message } from "@types";


export const getMessageType = (message: Message): MessageType => {
  if (message.text) {
    return MessageType.Text;
  }

  if (message.photo) {
    return message.caption ? MessageType.PhotoCaption : MessageType.Photo;
  }

  if (message.document) {
    return message.caption ? MessageType.DocumentCaption : MessageType.Document;
  }

  if (message.voice) {
    return MessageType.Voice;
  }

  if (message.poll) {
    return MessageType.Poll;
  }

  if (message.location) {
    return MessageType.Location;
  }

  if (message.sticker) {
    return MessageType.Sticker;
  }

  return MessageType.Unknown;
};
