import serverlessExpress from "@vendia/serverless-express";
import { createApp } from "./server";

let cachedServer: ReturnType<typeof serverlessExpress> | null = null;

exports.handler = async (event: any, context: any) => {
  if (!cachedServer) {
    const app = await createApp();
    cachedServer = serverlessExpress({ app });
  }

  return cachedServer!(event, context);
};
