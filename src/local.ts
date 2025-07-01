import { config } from "@config";
import { createApp } from "./server";

(async () => {
  const app = await createApp();
  app.listen(config.port, () =>
    console.log(`🚀 Server listening on port ${config.port}`)
  );
})();
