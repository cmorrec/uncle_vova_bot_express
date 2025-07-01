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

const app = express();

(async () => {
  const bot = createBot();
  app.use(express.json());
  connectDB();
  registerControllers(app);

  const webhookPath = config.webhook.path;
  if (webhookPath) {
    app.use(bot.webhookCallback(webhookPath));
    // app.use(webhookPath, (req, res) => bot.handleUpdate(req.body, res));
    console.log("Webhook set");
  } else {
    await bot.launch();
    console.log("Long-polling set");
  }
})();

export default app;
