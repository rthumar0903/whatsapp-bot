module.exports = (app) => {
  const agents = require("../controller/agent.controller");
  const { authorize } = require("../services/auth.service");
  var router = require("express").Router();

  // Create a new User
  router.get("/agents", authorize("Admin"), agents.getAgents);
  router.get(
    "/agents/:agentId",
    authorize(["Agent", "Admin"]),
    agents.getAgent
  );
  router.post("/agents", authorize("Admin"), agents.addAgent);
  router.put("/agents/:agentId", authorize("Admin"), agents.UpdateAgent);

  app.use("/", router);
};
