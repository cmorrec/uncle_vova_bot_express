import { Express } from "express";
import service from "@service";

export default function registerWakeUp(app: Express) {
  app.get("/api/wakeup", async (req, res) => {
    console.log("/wakeup obtain");

    try {
      const result = await service.wakeUpChat();
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
