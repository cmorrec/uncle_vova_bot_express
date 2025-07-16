import serverlessExpress from "@vendia/serverless-express";
import { createApp } from "./server";
import service from "@service";

let cachedServer: ReturnType<typeof serverlessExpress> | null = null;

exports.handler = async (event: any, context: any) => {
  const isEventBridgeScheduled = event?.["detail-type"] === "Scheduled Event";
  if (isEventBridgeScheduled) {
    console.log("Received event:", JSON.stringify(event));
    await wakeUp();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "wakeUp() executed from EventBridge Scheduler",
      }),
    };
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
