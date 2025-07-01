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
    path: process.env.WEBHOOK_PATH,
    secretToken: process.env.WEBHOOK_SECRET_TOKEN!,
  },
  openAIAPIKey: process.env.OPENAI_API_KEY!,
  mongoDBURI: process.env.MONGODB_URI!,
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
    !config.mongoDBURI
  ) {
    throw new Error("There are no enough envs");
  }
})();

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDBURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
