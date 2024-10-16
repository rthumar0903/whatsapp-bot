const { authorize } = require("../services/auth.service");

module.exports = (app) => {
  const shops = require("../controller/shop.controller");

  var router = require("express").Router();

  // Create a new User
  router.get("/shops", authorize("Admin"), shops.getShops);
  router.post("/shops", authorize("Admin"), shops.addShops);
  router.put("/shops/:shopId", authorize("Admin"), shops.updateShop);

  app.use("/", router);
};
