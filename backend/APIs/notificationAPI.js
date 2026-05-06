import exp from "express";
import jwt from "jsonwebtoken";
import { addNotificationClient, removeNotificationClient } from "../utils/notifications.js";

export const notificationApp = exp.Router();

notificationApp.get("/events", (req, res) => {
  const token = req.query.token || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "please login" });
  }

  try {
    const user = jwt.verify(token, process.env.KEY);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    addNotificationClient(user.id, res);
    res.write(`data: ${JSON.stringify({ message: "Notifications connected" })}\n\n`);

    req.on("close", () => {
      removeNotificationClient(user.id, res);
    });
  } catch {
    res.status(401).json({ message: "Session expired : Re-Login" });
  }
});
