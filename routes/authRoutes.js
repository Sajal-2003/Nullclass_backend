const express = require("express");
const {
  registerContoller,
  loginController,
  logoutController,
} = require("../controllers/authController");

//router object
const router = express.Router();

//routes
// REGISTER
router.post("/register", registerContoller);

//LOGIN
router.post("/login", loginController);


module.exports = router;
