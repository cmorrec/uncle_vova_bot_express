import OpenAITypes, { OpenAI, ClientOptions } from "openai";
// import { encode } from "gpt-3-encoder";

import { ChatGPTResponseToSave } from "@repo/index";
import { config } from "@config";
import { handleError } from "@utils";

export type ChatCompletionRequestMessage = Pick<
  OpenAITypes.Chat.Completions.ChatCompletionMessage,
  "role" | "content"
>;

const MODEL = config.model;

const TEMPERATURE = config.temperature;
const MAX_TOKENS = config.maxTokens;
const configuration: ClientOptions = {
  apiKey: config.openAIAPIKey,
};
const openai: OpenAI = new OpenAI(configuration);

export async function getCompletion(
  requestText: string
): Promise<ChatGPTResponseToSave | undefined> {
  try {
    const response = await openai.completions.create({
      model: MODEL,
      prompt: requestText,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    return {
      text: response.choices[0].text,
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    handleError(error);
  }

  return undefined;
}

export async function getChat(
  requestChat: ChatCompletionRequestMessage[]
): Promise<ChatGPTResponseToSave | undefined> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: requestChat.map((e) => ({
        role: e.role,
        content: e.content,
      })),
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    return {
      text: response.choices[0].message.content ?? undefined,
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    handleError(error);
  }

  return undefined;
}

// function getMaxTokens(
//   input: { prompt: string } | { messages: ChatCompletionRequestMessage[] }
// ): number {
//   const max = MAX_TOKENS;
//   if ("prompt" in input) {
//     const encodedCompletion = encode(input.prompt);

//     return max - encodedCompletion.length;
//   } else if ("messages" in input) {
//     const encodedChatTokenNumber = input.messages
//       .map((e) => encode(e.content ?? "").length)
//       .reduce((acc, cur) => acc + cur);

//     return max - encodedChatTokenNumber;
//   } else {
//     return 0;
//   }
// }
