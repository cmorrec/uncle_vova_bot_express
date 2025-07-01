import { config } from "@config";
import app from "./server";

app.listen(config.port, () =>
  console.log(`🚀 Server listening on port ${config.port}`)
);
