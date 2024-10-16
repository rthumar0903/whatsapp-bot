const express = require("express");
require("dotenv").config();
const path = require("path");

// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
// const body_parser = require("body-parser");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors());

app.use(express.json()); /* bodyParser.json() is deprecated */

app.use("/assets", express.static(path.join("app/assets")));

app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

require("./app/routes/user.routes.js")(app);
require("./app/routes/auth.route.js")(app);
require("./app/routes/order.route.js")(app);
require("./app/routes/shop.route.js")(app);
require("./app/routes/agent.route.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("webhook is listening on ", PORT);
});
