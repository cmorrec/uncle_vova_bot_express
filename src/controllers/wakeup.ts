import { Express } from "express";
import service from "@service";

export default function registerWakeUp(app: Express) {
  app.get("/api/wakeup", (req, res) => {
    try {
      const result = service.wakeUpChat();
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
