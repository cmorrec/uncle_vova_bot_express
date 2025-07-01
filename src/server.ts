import express from "express";
import { createBot } from "./bot";
import { config, connectDB } from "./config";
import registerControllers from "./controllers";

(async () => {
  const app = express();
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

  app.listen(config.port, () =>
    console.log(`🚀 Server listening on port ${config.port}`)
  );
})();
