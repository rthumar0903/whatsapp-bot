module.exports = (app) => {
  const Order = require("../controller/order.controller");
  const { authorize } = require("../services/auth.service");

  var router = require("express").Router();

  router.get(
    "/orders/:agentId",
    authorize(["Agent", "Admin"]),
    Order.getOrderDetails
  );
  router.get("/agent/:userId", Order.getAgentDetails);

  app.use("/", router);
};
