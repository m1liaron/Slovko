import { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const initializeLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  logger.info(
    `Request: ${req.originalUrl} ${req} - ${new Date().toISOString()}`
  );

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logMessage = `endpoint: ${req.originalUrl}, method: ${req.method}, - duration: ${duration}ms, status:${res.statusCode}`;

    const statusLogMap: { min: number; level: "error" | "warn" | "info" | "verbose";  message: string }[] = [
      { min: 500, level: "error", message: "Response: ServerError" },
      { min: 400, level: "warn", message: "Response: ClientError" },
      { min: 300, level: "info", message: "Response: Redirect" },
      { min: 200, level: "info", message: "Response: Success" },
      { min: 0, level: "verbose", message: "Response: Info" },
    ];

    const { statusCode } = res;
    const matched = statusLogMap.find((cfg) => statusCode >= cfg.min);

    if (matched) {
      const { level, message } = matched;
      logger[level](`${message} - ${logMessage}`);
    } else {
      // fallback just in case
      logger.info(`Response (Unknown Level) - ${logMessage}`);
    }
  });

  next();
};

export { initializeLogger };
