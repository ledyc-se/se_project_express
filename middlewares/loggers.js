const winston = require("winston");
const expressWinston = require("express-winston");
const path = require("path");

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta = {}, timestamp }) =>
      `${timestamp} ${level}: ${meta.error?.stack || message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join("logs", "request.log"),
      format: fileFormat,
    }),
  ],
  meta: true,
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      format: fileFormat,
    }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
