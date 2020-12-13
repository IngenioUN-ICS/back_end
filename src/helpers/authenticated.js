const logger = require("../log/facadeLogger");
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    logger.info(
      "The user is logged into the platform, can access the required functionality"
    );
    return next();
  }
  logger.warn(
    "The user is not logged in to the platform, cannot access the required functionality"
  );
  return res.status(401).json({
    message: "The user is not logged in to the platform",
  });
};

helpers.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    logger.info(
      "Helper.isLogged: To access the following functionality, the user must not be logged in"
    );
    return next();
  }
  logger.warn(
    "The user is logged in to the platform, cannot access the required functionality"
  );
  return res.status(400).json({
    message: "The user has already logged in to the platform",
  });
};

module.exports = helpers;
