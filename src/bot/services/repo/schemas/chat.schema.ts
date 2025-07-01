import { model, Schema } from "mongoose";
import { ChatTypeEnum } from "@types";
import { IChat } from "./interfaces";

const ChatSchema = new Schema<IChat>({
  chatId: { type: String, required: true },
  title: { type: String, required: false },
  chatMemberIds: { type: Schema.Types.Mixed, required: true },
  botDescription: { type: String, required: false },
  botQuotes: { type: [String], required: false },
  botIsRude: { type: Boolean, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  chatType: { type: String, required: true, enum: Object.values(ChatTypeEnum) },
  wakeUp: { type: Boolean, required: true },
  active: { type: Boolean, required: true },
});

const ChatModel = model<IChat>("Chat", ChatSchema);

export default ChatModel;
