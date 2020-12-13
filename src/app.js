const session = require("express-session");
const express = require("express"); // Framework
const morgan = require("morgan"); // Show browser requests
const cors = require("cors");

const loggerHandler = require("./log/facadeLogger");

const userRoutes = require("./routes/user");
const sessionRoutes = require("./routes/session");
const categoryRoutes = require("./routes/category");
const publicationRoutes = require("./routes/publication");
const notificationRoutes = require("./routes/notification");
const authorRequestRoutes = require("./routes/authorRequest");

const { createRoles, createAdmin } = require("./libs/initialSetUp");

require("./config/passport");

const app = express();
createRoles();
createAdmin();

// Settings
app.set("port", process.env.PORT || 3000);

// Middleware
app.use(
  morgan("combined", {
    stream: loggerHandler.fileStream,
  })
);

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:8080",
    //origin: "https://ingeniofrontend.herokuapp.com",
    credentials: true,
  })
);
app.use((req, res, next) => {
  //res.header('Access-Control-Allow-Origin', 'https://ingeniofrontend.herokuapp.com');
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(express.json());
app.use(
  session({
    secret: "IngenioUN",
    resave: true,
    saveUninitialized: true,
  })
);

// Routes
app.use("/user", userRoutes);
app.use("/session", sessionRoutes);
app.use("/category", categoryRoutes);
app.use("/publication", publicationRoutes);
app.use("/notification", notificationRoutes);
app.use("/author-request", authorRequestRoutes);

module.exports = app;
