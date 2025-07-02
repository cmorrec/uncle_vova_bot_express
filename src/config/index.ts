import { config as pullEnvs } from "dotenv";
import mongoose from "mongoose";

pullEnvs();

export const config = {
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  botUsername: process.env.TELEGRAM_BOT_USERNAME!,
  botName: process.env.TELEGRAM_BOT_NAME!,
  ownerIds: process.env.OWNER_IDS!,
  port: Number(process.env.PORT),
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN,
    path: process.env.WEBHOOK_PATH,
    secretToken: process.env.WEBHOOK_SECRET_TOKEN!,
  },
  openAIAPIKey: process.env.OPENAI_API_KEY!,
  mongoDBURI: process.env.MONGODB_URI!,
  temperature: Number(process.env.TEMPERATURE!),
  defaultMinusMinutes: Number(process.env.DEFAULT_MINUS_MINUTES!),
  messagesLimit: Number(process.env.MESSAGES_LIMIT!),
  everyNthMessage: Number(process.env.EVERY_NTH_MESSAGE!),
  minMessageLength: Number(process.env.MIN_MESSAGE_LENGTH!),
  maxTokens: Number(process.env.MAX_TOKENS!),
  model: process.env.MODEL!
};

// validation
(() => {
  if (
    !config.botName ||
    !config.botUsername ||
    !config.botToken ||
    !config.ownerIds ||
    !config.port ||
    !config.openAIAPIKey ||
    !config.mongoDBURI ||
    !config.temperature ||
    !config.defaultMinusMinutes ||
    !config.messagesLimit ||
    !config.everyNthMessage ||
    !config.minMessageLength ||
    !config.maxTokens ||
    !config.model
  ) {
    throw new Error("There are no enough envs");
  }
})();

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDBURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
