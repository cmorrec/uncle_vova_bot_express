import { DateTime } from "luxon";
import { config } from "@config";
import chatRepo from "@repo/chat.repo";
import messageRepo from "@repo/message.repo";
import userRepo from "@repo/user.repo";
import {
  availableTextTypes,
  DEFAULT_MINUS_MINUTES,
  EVERY_NTH_MESSAGE,
  keyBy,
  MESSAGES_LIMIT,
  MIN_MESSAGE_LENGTH,
  takeRight,
  uniqBy,
  getDateTime,
} from "@utils";
import { Message, UpdateDBInfo } from "@types";
import getChatGPT from "@chat-gpt";
import { Telegraf } from "telegraf";
import { saveReplyMessage } from "@middlewares";
import { IChat, IMessage, IUser } from "@repo/index";

type ResultType = { answer: string; isFormal: boolean };

class AppService {
  private username = config.botUsername;
  private FORMAL_MENTIONS = [`@${this.username}`, "Темин бот", "бот Темы"];
  private INFORMAL_MENTIONS = [
    config.botName,
    "Дядя Вов",
    "Дядь Вов",
    "Тятя Вов",
    "Тять Вов",
    "ДядяВов",
    "ДядьВов",
    "ТятяВов",
    "ТятьВов",
  ];

  // @Cron('0 0 17 * * *')
  // since we use lambda + api gateway
  async wakeUpChat() {
    const initDate = DateTime.local().minus({ days: 3 }).toJSDate();
    const chats = await chatRepo.getWakedUp();

    const messageDict: { [p: string]: Message } = (await Promise.all(
      chats.map(async (c) => messageRepo.getLastMessage(c.chatId))
    ).then((res) => keyBy(res, (m) => m?.chatId))) as any;

    const sleepingChats = chats.filter(
      (c) =>
        messageDict[c.chatId] &&
        getDateTime(messageDict[c.chatId].date)! < getDateTime(initDate)!
    );

    for (const chat of sleepingChats) {
      const answer = await getChatGPT({
        messages: [],
        character: chat,
        mode: "wakeup",
      });

      if (answer) {
        const bot = new Telegraf(config.botToken);
        const newMessage = await bot.telegram.sendMessage(
          Number(chat.chatId),
          answer
        );
        await saveReplyMessage({
          needSave: true,
          newMessage: newMessage as any,
          isFormal: false,
        });
      }
    }
  }

  async getAnswer(updateDBInfo: UpdateDBInfo): Promise<ResultType | undefined> {
    const { message } = updateDBInfo;
    const text = message?.text ?? message?.caption;
    if (!message || !text || !availableTextTypes.includes(message.messageType)) {
      return undefined;
    }

    let result: ResultType | undefined = undefined;

    if (this.isRepliedBotMessage(updateDBInfo)) {
      result = await this.getAnswerOnReply(updateDBInfo);
    } else if (this.hasMention(text)) {
      result = await this.getAnswerOnMention(updateDBInfo);
    } else {
      result = await this.getDefaultAnswer(updateDBInfo);
    }

    return result;
  }

  private async getAnswerOnReply({
    chat,
    message,
    repliedMessage,
  }: Required<UpdateDBInfo>): Promise<ResultType | undefined> {
    const firstMessage =
      (await messageRepo.getByChatAndId({
        messageId: message.messageThreadId,
        chatId: chat.chatId,
      })) ??
      repliedMessage ??
      message;
    if (!firstMessage) {
      return undefined;
    }

    const messages = await this.getMessagesForChatGPTRequest({
      chatId: chat.chatId,
      date: firstMessage.date,
      // TODO can't reply on old messages, fix it
      limit: MESSAGES_LIMIT * 2,
    });
    const isInformal = this.isInformalChatGPTRequest(messages, chat);
    const answer = await getChatGPT({
      messages: messages,
      mode: "answer",
      character: isInformal ? chat : undefined,
    });

    return answer ? { answer, isFormal: !isInformal } : undefined;
  }

  private async getAnswerOnMention({
    chat,
    message,
  }: UpdateDBInfo): Promise<ResultType | undefined> {
    const messages = await this.getMessagesForChatGPTRequest({
      chatId: chat.chatId,
      date: message.date,
    });
    const isInformal =
      this.hasInformalMention((message.text ?? message.caption)!) ||
      (this.isInformalChatGPTRequest(messages, chat) &&
        !this.hasFormalMention((message.text ?? message.caption)!));
    const answer = await getChatGPT({
      messages: messages,
      mode: "answer",
      character: isInformal ? chat : undefined,
    });

    return answer ? { answer, isFormal: !isInformal } : undefined;
  }

  private async getDefaultAnswer({
    chat,
  }: UpdateDBInfo): Promise<ResultType | undefined> {
    const lastMessage =
      (await messageRepo.getLastBotMessage(chat.chatId)) ??
      (await messageRepo.getLastMessage(chat.chatId))!;

    const messages = await this.getMessagesForChatGPTRequest({
      chatId: chat.chatId,
      date: lastMessage.date,
      minusMinutes: 0,
      // if less than a half big messages, maybe don't need to interrupt
      limit: EVERY_NTH_MESSAGE * 2,
    });

    if (
      messages.filter(
        (e) =>
          (e.text?.length ?? 0) > MIN_MESSAGE_LENGTH ||
          (e.caption?.length ?? 0) > MIN_MESSAGE_LENGTH
      ).length < EVERY_NTH_MESSAGE
    ) {
      return undefined;
    }

    const answer = await getChatGPT({
      messages: takeRight(messages, MESSAGES_LIMIT),
      mode: "interrupt",
      character: chat,
    });

    return answer ? { answer, isFormal: false } : undefined;
  }

  private hasMention(text: string): boolean {
    return this.getAllMentions().some((e) =>
      text.toLowerCase().includes(e.toLowerCase())
    );
  }

  private hasInformalMention(text: string): boolean {
    return this.getInformalMentions().some((e) =>
      text.toLowerCase().includes(e.toLowerCase())
    );
  }

  private hasFormalMention(text: string): boolean {
    return this.getFormalMentions().some((e) =>
      text.toLowerCase().includes(e.toLowerCase())
    );
  }

  private isRepliedBotMessage(
    updateDBInfo: UpdateDBInfo
  ): updateDBInfo is Required<UpdateDBInfo> {
    return (
      updateDBInfo.repliedMessage !== null &&
      updateDBInfo.repliedMessage.from.username === this.username
    );
  }

  private async getMessagesForChatGPTRequest({
    chatId,
    date,
    minusMinutes = DEFAULT_MINUS_MINUTES,
    limit = MESSAGES_LIMIT,
  }: {
    chatId: string;
    date: Date;
    minusMinutes?: number;
    limit?: number;
  }): Promise<(IMessage & { user: IUser })[]> {
    const initDate = getDateTime(date)!
      .minus({ minutes: minusMinutes })
      .toJSDate();

    const messages = await messageRepo.getLastMessages({
      chatId: chatId,
      date: initDate,
      limit: limit,
      types: availableTextTypes,
    });

    // TODO change for join
    const userIds = uniqBy(messages, (e) => e.userId).map((e) => e.userId);
    // chain()
    //   .map((e) => e.userId)
    //   .uniq()
    //   .value();
    const users = await userRepo.getByIds(userIds);

    return messages.map((m) => ({
      ...m,
      user: users.find((u) => u.userId === m.userId)!,
    }));
  }

  private isInformalChatGPTRequest(messages: IMessage[], chat: IChat): boolean {
    // nothing -> character, formal -> undefined, informal -> character
    return (
      Boolean(chat.botDescription || chat.botQuotes?.length) &&
      (messages.some(
        (e) => e.isMainBotMessage && e.isFormalMessage === false
      ) ||
        messages.every((e) => !e.isMainBotMessage))
    );
  }

  private getAllMentions() {
    return this.getFormalMentions().concat(this.getInformalMentions());
  }

  public getFormalMentions() {
    return this.FORMAL_MENTIONS;
  }

  public getInformalMentions() {
    return this.INFORMAL_MENTIONS;
  }
}

export default new AppService();
