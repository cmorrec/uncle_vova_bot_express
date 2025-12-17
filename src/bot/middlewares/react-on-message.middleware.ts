import { BotContext, UpdateDBInfo } from "@types";
import { randomInteger } from "../utils/random-integer";
import { ALL_REACTIONS, POPULAR_REACTIONS, UNPOPULAR_REACTIONS } from "../utils/reactions";
import { extractText } from "../utils/extract-text";
import { MIN_MESSAGE_LENGTH } from "@utils";
import { getChatGPTReaction } from "@chat-gpt";

export async function reactOnMessage({
  ctx,
  updateDBInfo,
}: {
  ctx: BotContext;
  updateDBInfo: UpdateDBInfo;
}) {
  let emoji: typeof ALL_REACTIONS[number] | undefined;
  const text = updateDBInfo ? extractText(updateDBInfo) : undefined;
  if (text && text.length >= MIN_MESSAGE_LENGTH / 2) {
    emoji = await getChatGPTReaction(text, POPULAR_REACTIONS, updateDBInfo.chat);
  }
  if (!emoji) {
    const randomNum = randomInteger(0, UNPOPULAR_REACTIONS.length - 1);
    emoji = UNPOPULAR_REACTIONS[randomNum];
  }
  const succeed = await ctx.react(emoji);

  console.info(
    "React on Message: ",
    `${emoji}: ${succeed ? "Success" : "Fail"}`,
    "\n\n\n"
  );
}
