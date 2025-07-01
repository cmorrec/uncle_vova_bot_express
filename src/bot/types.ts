import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { IChat, IMessage } from "@repo/index";

export type TelegrafContext = Telegraf<Context<Update>>;


export enum ChatTypeEnum {
  CHANNEL = "channel",
  SUPERGROUP = "supergroup",
  GROUP = "group",
  PRIVATE = "private",
}

export type UpdateDBInfo = {
  message: IMessage;
  repliedMessage: IMessage | null;
  chat: IChat;
};

// @ts-ignore
export interface BotContext extends Context {
  update: {
    update_id: number;
    message: Message;
  };
}

export interface Message {
  message_id: number;
  from: From;
  chat: Chat;
  date: number;
  message_thread_id?: number;
  reply_to_message?: Omit<Message, "reply_to_message">;
  text?: string;
  caption?: string;
  photo?: Photo[];
  voice?: Voice;
  poll?: Poll;
  location?: Location;
  document?: Document;
  forward_from_chat?: ForwardFromChat;
  forward_from_message_id?: number;
  forward_date?: number;
  entities?: TextEntity[];
  caption_entities?: TextEntity[];
  sticker?: Sticker;
}

export interface Sticker {
  width: number;
  height: number;
  emoji: string;
  set_name: string;
  is_animated: boolean;
  is_video: boolean;
  type: string;
  thumbnail?: Thumbnail;
  thumb?: Thumb;
  file_id: string;
  file_unique_id: string;
  file_size: number;
}

export interface Thumbnail {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface Thumb {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface ForwardFromChat {
  id: number;
  title: string;
  username: string;
  type: string;
}

export interface TextEntity {
  offset: number;
  length: number;
  type: string;
}

export interface From {
  id: number;
  is_bot: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code: string;
}

export interface Chat {
  id: number;
  title: string;
  type: ChatTypeEnum;
}

export interface Photo {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface Voice {
  duration: number;
  mime_type: string;
  file_id: string;
  file_unique_id: string;
  file_size: number;
}

export interface Poll {
  id: string;
  question: string;
  options: {
    text: string;
    voter_count: number;
  }[];
  total_voter_count: number;
  is_closed: boolean;
  is_anonymous: boolean;
  type: string;
  allows_multiple_answers: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Document {
  file_name: string;
  mime_type: string;
  thumbnail?: Thumbnail;
  thumb?: Thumb;
  file_id: string;
  file_unique_id: string;
  file_size: number;
}
