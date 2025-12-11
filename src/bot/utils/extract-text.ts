import { UpdateDBInfo } from "@types";
import { availableTextTypes } from "@utils";

export function extractText(updateDBInfo: UpdateDBInfo): string | undefined {
  const { message } = updateDBInfo;
  const text = message?.text ?? message?.caption;
  if (message && text && availableTextTypes.includes(message.messageType)) {
    return text;
  }

  return undefined;
}
