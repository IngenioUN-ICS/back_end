const express = require("express"); // Framework
const morgan = require("morgan"); // Show browser requests
const cors = require("cors");

const config = require("./config");
const loggerHandler = require("./log/facadeLogger");

const userRoutes = require("./routes/user");
const sessionRoutes = require("./routes/session");
const categoryRoutes = require("./routes/category");
const publicationRoutes = require("./routes/publication");
const notificationRoutes = require("./routes/notification");
const authorRequestRoutes = require("./routes/authorRequest");

const { createRoles, createAdmin } = require("./libs/initialSetUp");

const app = express();
createRoles();
createAdmin();

// Settings
app.set("port", config.PORT);

const morganOptions = {
  stream: loggerHandler.fileStream,
};

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

const corsConfiguration = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
};

// Middlewares
app.use(morgan("combined", morganOptions));
app.use(cors(corsOptions));
app.use(corsConfiguration);
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/session", sessionRoutes);
app.use("/category", categoryRoutes);
app.use("/publication", publicationRoutes);
app.use("/notification", notificationRoutes);
app.use("/author-request", authorRequestRoutes);

module.exports = app;
