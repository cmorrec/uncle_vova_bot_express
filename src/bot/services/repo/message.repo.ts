import { DateTime } from "luxon";
import { IMessage } from "./schemas/interfaces";
import messageModel from "./schemas/message.schema";

class MessageRepo {
  async create(message: IMessage): Promise<IMessage> {
    const newMessage = new messageModel(message);

    return newMessage.save();
  }

  async getByChatAndId({
    chatId,
    messageId,
  }: {
    chatId: string;
    messageId?: string;
  }): Promise<IMessage | null> {
    return messageModel.findOne({ messageId, chatId }).lean();
  }

  async getLastBotMessage(chatId: string) {
    return this.getLastMessageByCondition({ chatId, isMainBotMessage: true });
  }

  async getLastMessage(chatId: string) {
    return this.getLastMessageByCondition({ chatId });
  }

  async getLastMessages({
    chatId,
    date,
    types,
    limit,
    userId,
  }: {
    chatId: string;
    date?: Date;
    types: string[];
    limit: number;
    userId?: string;
  }) {
    return messageModel
      .find({
        chatId,
        ...(date ? { date: { $gte: date } } : {}),
        messageType: { $in: types },
        ...(userId ? { userId } : {}),
      })
      .sort({ date: -1 })
      .limit(limit)
      .lean()
      .then((res) => res.sort((a, b) => (a.date > b.date ? 1 : -1)));
  }

  async getLastMessageByCondition(
    where: Partial<Pick<IMessage, "chatId" | "isMainBotMessage">>
  ) {
    return messageModel
      .find(where)
      .sort({ date: -1 })
      .limit(1)
      .lean()
      .then((res) => res?.[0] ?? null);
  }

  async removeOldMessages(sentBefore: DateTime) {
    return await messageModel.deleteMany({
      date: { $lt: sentBefore.toJSDate() },
    });
  }
}

export default new MessageRepo();
