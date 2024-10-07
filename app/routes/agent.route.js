module.exports = (app) => {
  const agents = require("../controller/agent.controller");

  var router = require("express").Router();

  // Create a new User
  router.get("/agents", agents.getAgents);
  router.get("/agents/:agentId", agents.getAgent);
  router.post("/agents", agents.addAgent);

  app.use("/", router);
};
