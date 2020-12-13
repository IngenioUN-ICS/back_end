const { fileLogger, consoleLogger } = require("./logger");

const facadeLogger = {
  log: function (level, message) {
    fileLogger.log(level, message.trim());
    consoleLogger.log(level, message.trim());
  },
  error: function (message) {
    fileLogger.error(message.trim());
    consoleLogger.error(message.trim());
  },
  warn: function (message) {
    fileLogger.warn(message.trim());
    consoleLogger.warn(message.trim());
  },
  verbose: function (message) {
    fileLogger.verbose(message.trim());
    consoleLogger.verbose(message.trim());
  },
  info: function (message) {
    fileLogger.info(message.trim());
    consoleLogger.info(message.trim());
  },
  debug: function (message) {
    fileLogger.debug(message.trim());
    consoleLogger.debug(message.trim());
  },
  silly: function (message) {
    fileLogger.silly(message.trim());
    consoleLogger.silly(message.trim());
  },
};

module.exports = facadeLogger;
module.exports.fileStream = {
  write: (message) =>
    message.indexOf("status:5") >= 0
      ? fileLogger.error(message.trim() + error)
      : fileLogger.debug(message.trim()),
};
module.exports.consoleStream = {
  write: (message) =>
    message.indexOf("status:5") >= 0
      ? consoleLogger.error(message.trim() + error)
      : consoleLogger.debug(message.trim()),
};
