const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const initializeLogger = (req, res, next) => {
  const startTime = Date.now();
  logger.info(
    `Request: ${req.originalUrl} ${req} - ${new Date().toISOString()}`
  );

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logMessage = `endpoint: ${req.originalUrl}, method: ${req.method}, - duration: ${duration}ms, status:${res.statusCode}`;

    const statusLogMap = [
      { min: 500, level: "error", message: "Response: ServerError" },
      { min: 400, level: "warn", message: "Response: ClientError" },
      { min: 300, level: "info", message: "Response: Redirect" },
      { min: 200, level: "info", message: "Response: Success" },
      { min: 0, level: "verbose", message: "Response: Info" },
    ];
    const { statusCode } = res;
    const { level, message } = statusLogMap.find(
      (cfg) => statusCode >= cfg.min
    );

    logger[level](`${message} - ${logMessage}`);
  });

  next();
};

module.exports = { initializeLogger };
