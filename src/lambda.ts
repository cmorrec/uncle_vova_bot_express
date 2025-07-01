import serverlessExpress from "@vendia/serverless-express";
import app from "./server";

exports.handler = serverlessExpress({ app });
