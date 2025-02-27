const express = require("express");
const router = express.Router();
const accessController = require("../controllers/AccessController")

router.get("/", accessController.index);

router.get("/login", accessController.loginPage);

router.post("/login", accessController.login);

module.exports = router;
