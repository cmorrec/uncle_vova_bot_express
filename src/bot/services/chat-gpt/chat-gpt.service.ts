import { config } from "@config";
import { MESSAGES_LIMIT, handleError, availableTextTypes } from "../../utils";
import messageRepo from "@repo/message.repo";
import requestRepo from "@repo/request.repo";
import {
  IMessage,
  IUser,
  IChat,
  ChatGPTRequestType,
} from "@repo/index";
import userRepo from "@repo/user.repo";
import {
  ChatCompletionRequestMessage,
  getChat,
  getCompletion,
} from "./chat-gpt.provider";
import i18n from "@i18n";

type TextGenerationInput = {
  messages: (IMessage & { user: IUser })[];
  character?: IChat;
  mode: "answer" | "interrupt" | "wakeup";
};
type MessageType = {
  name: string;
  role: "assistant" | "user";
  content: string;
};

const MESSAGE_LENGTH_LIMIT = 836;

export default async function getChatGPT(
  input: TextGenerationInput
): Promise<string | undefined> {
  /**
   * Дядя Вова - вредный глупый старик-алкоголик, который много матерится.
   *
   * Options:
   *  1) text-davinchi vs chat-gpt3.5-turbo vs gpt-4o
   *  2) completion vs chat vs fine-tune
   *
   * temperature = , top-p = , best of =
   *            | text-davinci-003 | gpt-3.5-turbo | gpt-4o
   * completion |                  |               |
   * chat       |                  |               |
   * fine-tune  |                  |               |
   */

  const now = new Date();

  // Users should be able to ignore character by calling him a special way
  const isFormal = isBotFormal(input);
  const botName = getBotName(isFormal);
  const description = getDescription({ input, isFormal });
  const userMessages = handleMessages(input.messages, isFormal);
  const assistantMessages: MessageType[] = isFormal
    ? []
    : [{ content: description, name: botName, role: "assistant" }];
  const promptMessages = [...assistantMessages, ...userMessages];
  const type = getRequestType(input);

  try {
    const { chatRequest, completionRequest, response } = await requestChatGPT({
      type,
      messages: promptMessages,
      character: input.character,
      isFormal,
    });

    await requestRepo.create({
      chatRequest,
      completionRequest,
      response,
      date: now,
      type: type!,
    });

    return response?.text;
  } catch (e) {
    handleError(e);

    await requestRepo.create({
      chatRequest: promptMessages,
      date: now,
      type: type!,
      error: e,
    });
  }

  return undefined;
}

async function requestChatGPT(input: {
  type: ChatGPTRequestType;
  messages: MessageType[];
  isFormal: boolean;
  character: TextGenerationInput["character"];
}) {
  if (input.type === ChatGPTRequestType.Chat) {
    const chatRequest = input.messages as ChatCompletionRequestMessage[];
    const response = await getChat(chatRequest);

    return { chatRequest, response };
  }

  if (input.type === ChatGPTRequestType.Completion) {
    const description = getDescription({
      input,
      isFormal: input.isFormal,
    });
    const completionRequest = await getWakeupInput({
      character: input.character,
      description,
      isFormal: input.isFormal,
    });
    const response = await getCompletion(completionRequest);

    return { completionRequest, response };
  }

  return {
    completionRequest: undefined,
    chatRequest: undefined,
    response: undefined,
  };
}

async function getWakeupInput(input: {
  character?: IChat;
  description: string;
  isFormal: boolean;
}): Promise<string> {
  const rudeRequirements = getRudeRequirements({
    isFormal: input.isFormal,
    isRude: input.character?.botIsRude,
  });
  const option = randomInteger(0, 4);
  const userDescription = await getRandomUserDescription(input.character);

  const req =
    option === 0 && userDescription
      ? "questionForUser"
      : option === 1
      ? "rememberJoke"
      : option === 2
      ? "createFunFact"
      : option === 3
      ? "questionForAll"
      : ("createJoke" as const);

  return i18n.t(`wakeup.${req}`, {
    args: {
      description: input.description,
      formal: !input.isFormal ? i18n.t("wakeup.informalRef") : "",
      rude: rudeRequirements,
      userDescription: userDescription,
    },
  });
}

function getDescription({
  isFormal,
  input,
}: {
  input: Pick<TextGenerationInput, "character">;
  isFormal: boolean;
}): string {
  const hasQuotes = hasBotQuotes(input);

  return !isFormal
    ? `${config.botName} - ${input.character!.botDescription}.${
        hasQuotes
          ? ` ${i18n.t("hisQuotesTransition")}:\n\n${input
              .character!.botQuotes!.map((q) => `"${q}"`)
              .join("\n")}`
          : ""
      }\n\n`
    : "";
}

function getUserName(user: IUser): string {
  return getRealUserName(user) ?? getDefaultUserName(user);
}

function getRealUserName(user: IUser): string | undefined {
  return user.firstName && user.lastName
    ? `${user.lastName} ${user.firstName}`
    : user.username ?? user.firstName ?? user.lastName;
}

function getDefaultUserName(user: IUser): string {
  const lastDigits = Number(user.userId.slice(-1, 0));
  const defaultNames = i18n.t("defaultNames");

  return lastDigits % 3 === 0
    ? defaultNames[0]
    : lastDigits % 2 === 0
    ? defaultNames[1]
    : lastDigits % 5 === 0
    ? defaultNames[2]
    : defaultNames[3];
}

function randomInteger(min: number, max: number) {
  const rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
}

function getRudeRequirements({
  isFormal,
  isRude,
}: {
  isFormal: boolean;
  isRude?: boolean;
}) {
  return !isFormal && isRude
    ? `(${i18n.t("rudeRequirements")})`
    : "";
}

async function getRandomUserDescription(
  chat?: IChat
): Promise<string | undefined> {
  if (!chat || !chat.chatMemberIds?.length) {
    return undefined;
  }

  const users = await userRepo
    .getByIds(chat.chatMemberIds)
    .then((res) => res.filter((u) => !u.isBot));
  if (!users?.length) {
    return undefined;
  }

  const randomUser = users[randomInteger(0, users.length)];
  if (!randomUser) {
    return undefined;
  }

  const username = getRealUserName(randomUser);
  if (!username) {
    return undefined;
  }

  const userMessages = await messageRepo.getLastMessages({
    chatId: chat.chatId,
    limit: MESSAGES_LIMIT,
    types: availableTextTypes,
    userId: randomUser.userId,
  });
  if (!userMessages?.length) {
    return undefined;
  }

  const userDescription = `${username}. ${i18n.t(
    "wakeup.userQuotesTransition"
  )} ${username}:\n\n ${userMessages
    .map((m) => `"${m.text ?? m.caption}"`)
    .join("\n")}`;

  return userDescription;
}

function getRole(isMainBotMessage: boolean): "assistant" | "user" {
  return isMainBotMessage ? "assistant" : "user";
}

function handleMessages(
  messages: TextGenerationInput["messages"],
  isFormal: boolean
): MessageType[] {
  const botUsername = config.botUsername;
  const botName = getBotName(isFormal);

  return messages
    .map((m) => {
      if (m.text) {
        m.text = m.text.replace(`@${botUsername}`, botName);
      } else if (m.caption) {
        m.caption = m.caption.replace(`@${botUsername}`, botName);
      }

      return m;
    })
    .map((m) => ({
      role: getRole(m.isMainBotMessage),
      name: m.isMainBotMessage ? botName : getUserName(m.user),
      content: (m.text ?? m.caption)?.slice(0, MESSAGE_LENGTH_LIMIT) ?? "",
    }))
    .filter((e) => Boolean(e.content));
}

function getBotName(isFormal: boolean) {
  return isFormal ? i18n.t("aiFormalName") : config.botName;
}

function isBotFormal(input: Pick<TextGenerationInput, "character">): boolean {
  return Boolean(!input.character || !input.character.botDescription);
}

function hasBotQuotes(input: Pick<TextGenerationInput, "character">): boolean {
  return Boolean(input.character?.botQuotes?.length);
}

function getRequestType(
  input: Pick<TextGenerationInput, "mode">
): ChatGPTRequestType {
  return input.mode === "wakeup"
    ? ChatGPTRequestType.Completion
    : ChatGPTRequestType.Chat;
}
