import { uniqBy } from "@utils";
import chatModel from "./schemas/chat.schema";
import { IChat } from "./schemas/interfaces";

class ChatRepo {
  async create(chat: IChat): Promise<IChat> {
    const newChat = new chatModel(chat);

    return newChat.save();
  }

  async update(chat: IChat) {
    return chatModel.findOneAndUpdate({ chatId: chat.chatId }, chat);
  }

  async getById(
    chatId: string,
    where: { active?: boolean } = {}
  ): Promise<IChat | null> {
    return chatModel.findOne({ chatId, ...where }).lean();
  }

  async getWakedUp(): Promise<IChat[]> {
    return chatModel.find({ wakeUp: true, active: true }).lean();
  }

  async upsertChatMembers(
    chat: IChat,
    userIds: (string | number | undefined)[]
  ) {
    const filtered = userIds
      .map((e) => e?.toString())
      .filter((e): e is string => Boolean(e));
    const newUserIds = uniqBy(filtered, (e) => e).filter(
      (e) => !chat.chatMemberIds?.includes(e)
    );

    if (newUserIds.length) {
      chat.chatMemberIds = newUserIds.concat(chat.chatMemberIds ?? []);
      chat.updatedAt = new Date();

      await this.update(chat);
    }
  }
}

export default new ChatRepo();
