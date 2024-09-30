module.exports = (app) => {
  const Order = require("../controller/order.controller");
  var router = require("express").Router();

  router.get("/orders/:agentId", Order.getOrderDetails);
  router.get("/agent/:userId", Order.getAgentDetails);

  app.use("/", router);
};
