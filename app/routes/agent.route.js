module.exports = (app) => {
  const agents = require("../controller/agent.controller");

  var router = require("express").Router();

  // Create a new User
  router.get("/agents", agents.getAgents);

  app.use("/", router);
};
