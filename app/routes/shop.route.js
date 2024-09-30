module.exports = (app) => {
  const shops = require("../controller/shop.controller");

  var router = require("express").Router();

  // Create a new User
  router.get("/shops", shops.getShops);

  app.use("/", router);
};
