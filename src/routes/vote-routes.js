const express = require("express");
const voteController = require("../controllers/vote-controller");
const authController = require("../controllers/auth-controller");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/checkout/:id", voteController.checkout);

router.get("/", voteController.results);

module.exports = router;
