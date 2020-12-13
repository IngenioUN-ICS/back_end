const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

var consoleLogger = createLogger({
  format: format.simple(),
  transports: [
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

var fileLogger = createLogger({
  format: format.simple(),
  transports: [
    new transports.DailyRotateFile({
      level: "debug",
      filename: `${__dirname}/./logs/access.log`,
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  exitOnError: false,
});

module.exports.fileLogger = fileLogger;
module.exports.consoleLogger = consoleLogger;
