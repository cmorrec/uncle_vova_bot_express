import { model, Schema } from "mongoose";

import { IMessage, MessageType } from "./interfaces";
import { Photo } from "@types";

const MessageSchema = new Schema<IMessage>({
  date: { type: Date, required: true },
  chatId: { type: String, required: true },
  userId: { type: String, required: true },
  from: { type: Schema.Types.Mixed, required: true },
  messageId: { type: String, required: true },
  text: { type: String },
  caption: { type: String },
  replyToMessageId: { type: String },
  messageThreadId: { type: String },
  photo: [{ type: Array<Photo> }],
  voice: { type: Schema.Types.Mixed },
  poll: { type: Schema.Types.Mixed },
  location: { type: Schema.Types.Mixed },
  document: { type: Schema.Types.Mixed },
  forwardFromChat: { type: Schema.Types.Mixed },
  forwardFromMessageId: { type: String },
  forwardDate: { type: Date },
  entities: [{ type: Schema.Types.Mixed }],
  captionEntities: [{ type: Schema.Types.Mixed }],
  sticker: { type: Schema.Types.Mixed },
  messageType: {
    type: String,
    enum: Object.values(MessageType),
    required: true,
  },
  isMainBotMessage: { type: Boolean, required: true },
  isFormalMessage: { type: Boolean },
});

const MessageModel = model<IMessage>("Message", MessageSchema);

export default MessageModel;
