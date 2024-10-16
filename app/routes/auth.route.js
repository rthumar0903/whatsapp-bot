module.exports = (app) => {
  const auth = require("../controller/auth.controller");

  var router = require("express").Router();

  // Create a new User
  // router.post("/register", auth.register);
  router.post("/login", auth.login);
  router.post("/send-otp", auth.sendOtp);

  app.use("/", router);
};
