import express from "express";
import { createBot } from "./bot";
import { config, connectDB } from "./config";
import registerControllers from "./controllers";

// setInterval(() => {
//   const used = process.memoryUsage();
//   console.log('Memory usage:');
//   for (let key in used) {
//     console.log(`${key} ${Math.round(used[key as keyof NodeJS.MemoryUsage] / 1024 / 1024 * 100) / 100} MB`);
//   }
//   console.log('\n');
// }, 10000);

export async function createApp() {
  const app = express();
  await connectDB();
  const bot = createBot();
  app.use(express.json());
  registerControllers(app);

  const webhookPath = config.webhook.path;
  const webhookDomain = config.webhook.domain;
  if (webhookPath && webhookDomain) {
    app.use(
      await bot.createWebhook({
        domain: webhookDomain,
        path: webhookPath,
        // secret_token: config.webhook.secretToken,
      })
    );
    // app.use(webhookPath, (req, res) => bot.handleUpdate(req.body, res));
    console.log("Webhook set");
  } else {
    bot.launch();
    console.log("Long-polling set");
  }

  return app;
}
