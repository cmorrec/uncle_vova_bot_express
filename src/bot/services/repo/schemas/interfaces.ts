import {
  ForwardFromChat,
  From,
  Photo,
  Poll,
  Voice,
  TextEntity,
  Sticker,
  Location,
  Document as MessageDocument,
  ChatTypeEnum,
} from "@types";

export interface IChat {
  chatId: string;
  title?: string;
  chatMemberIds: string[];
  botDescription?: string;
  botQuotes?: string[];
  botIsRude?: boolean;
  createdAt: Date;
  updatedAt: Date;
  wakeUp: boolean;
  active: boolean;
  chatType: ChatTypeEnum;
}

export enum MessageType {
  Text = "Text",
  Photo = "Photo",
  PhotoCaption = "PhotoCaption",
  Document = "Document",
  DocumentCaption = "DocumentCaption",
  Voice = "Voice",
  Location = "Location",
  Poll = "Poll",
  Sticker = "Sticker",
  Unknown = "Unknown",
}

export interface IMessage {
  date: Date;
  chatId: string;
  userId: string;
  from: From;
  messageId: string;
  text?: string;
  caption?: string;
  replyToMessageId?: string;
  messageThreadId?: string;
  photo?: Photo[];
  voice?: Voice;
  poll?: Poll;
  location?: Location;
  document?: MessageDocument;
  forwardFromChat?: ForwardFromChat;
  forwardFromMessageId?: string;
  forwardDate?: Date;
  entities?: TextEntity[];
  captionEntities?: TextEntity[];
  sticker?: Sticker;
  messageType: MessageType;
  isMainBotMessage: boolean;
  isFormalMessage?: boolean;
}

export enum ChatGPTRequestType {
  Chat = "Chat",
  Completion = "Completion",
  // FineTune = 'FineTune',
}

export type ChatGPTResponseToSave = {
  text?: string;
  model: string;
  usage?: object;
};

export interface IRequest {
  completionRequest?: string;
  chatRequest?: any;
  response?: ChatGPTResponseToSave;
  date: Date;
  type: ChatGPTRequestType;
  error?: any;
}

export interface IUser {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  isBot: boolean;
  createdAt: Date;
  updatedAt: Date;
}
