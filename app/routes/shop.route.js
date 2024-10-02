module.exports = (app) => {
  const shops = require("../controller/shop.controller");

  var router = require("express").Router();

  // Create a new User
  router.get("/shops", shops.getShops);
  router.post("/shops", shops.addShops);

  app.use("/", router);
};
