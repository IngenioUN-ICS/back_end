const mongoose = require("mongoose");
const config = require("./config");

mongoose
  .connect(config.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error(err));
