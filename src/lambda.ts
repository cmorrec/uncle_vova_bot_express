import serverlessExpress from "@vendia/serverless-express";
import { createApp } from "./server";
import service from "@service";

let cachedServer: ReturnType<typeof serverlessExpress> | null = null;

exports.handler = async (event: any, context: any) => {
  if (event.source === "aws.events") {
    return await wakeUp();
  }
  if (!cachedServer) {
    const app = await createApp();
    cachedServer = serverlessExpress({ app });
  }

  return cachedServer!(event, context);
};

async function wakeUp() {
  await createApp();
  await service.wakeUpChat();
}
