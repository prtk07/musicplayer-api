const express = require("express");
const router = express.Router();
const responseHandler = require("../../response");
const controllers = require("./users.controller");

router.post("/login", controllers.login, responseHandler);
router.post("/signup", controllers.signup, responseHandler);

module.exports = router;
