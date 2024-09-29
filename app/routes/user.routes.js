module.exports = (app) => {
  const user = require("../controller/bot-webhook.controller");
  const customer = require("../controller/customer.controller");
  var router = require("express").Router();

  router.get("/", user.webHookSetUp);

  router.get("/webhook", user.getMessage);

  router.post("/webhook", user.senMessage);

  router.get("/customers/:id", customer.getCustomerDetails);

  app.use("/", router);
};
