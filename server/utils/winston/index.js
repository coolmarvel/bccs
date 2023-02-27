const util = require("util");
const winston = require("winston");
const { format } = require("winston");
const moment = require("moment-timezone");
const winstonDaily = require("winston-daily-rotate-file");

const { combine, printf } = format;

const customFormat = printf((message) => {
  return util
    .format("%o", message.message)
    .trim()
    .split("\n")
    .map((line) => {
      return `${message.timestamp} [${message.level}]: ${line}`;
    })
    .join("\n");
});

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) info.timestamp = moment().tz(opts.tz).format("HH:mm:ss");
  return info;
});

const logger = winston.createLogger({
  format: combine(appendTimestamp({ tz: "Asia/seoul" }), customFormat),
  transports: [
    // extend local console
    new winston.transports.Console(),

    // info level logger
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: "../logs/bccs",
      filename: `%DATE%.log`,
      maxFiles: null,
      maxSize: null,
    }),

    // error level logger
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: "../logs/bccs/error",
      filename: `%DATE%.error.log`,
      maxFiles: null,
      maxSize: null,
    }),
  ],
});

const stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = { logger, stream };
