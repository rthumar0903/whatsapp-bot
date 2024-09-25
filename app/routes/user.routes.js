module.exports = (app) => {
  const user = require("../controller/bot-webhook.controller");

  var router = require("express").Router();

  // setup web
  router.get("/", user.webHookSetUp);

  // connect webhook User
  router.get("/webhook", user.getMessage);

  // Create a new User
  router.post("/webhook", user.senMessage);
};
