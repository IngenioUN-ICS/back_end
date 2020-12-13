const { config } = require("dotenv");
config();

const URL_ATLAS =
  "mongodb+srv://IngenioUN:IngenioUN@cluster0.ejd2r.mongodb.net/<dbname>?retryWrites=true&w=majority";

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || URL_ATLAS,
  PORT: process.env.PORT || 4000,
  SECRET: "ingenio-un-api",
};
