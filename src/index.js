const app = require("./app");
require("./database");
require("./app");

app.listen(app.get("port"));
console.log("Server on port", app.get("port"));
