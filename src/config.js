const { config } = require("dotenv");
config();

const urlAtlas =
  "mongodb+srv://IngenioUN:IngenioUN@cluster0.ejd2r.mongodb.net/<dbname>?retryWrites=true&w=majority";

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || urlAtlas,
  PORT: process.env.PORT || 3000,
  SECRET: "ingenio-un-api",
};
